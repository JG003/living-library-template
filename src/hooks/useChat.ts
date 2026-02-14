import { useState, useCallback, useRef } from 'react';
import { client } from '@/config/client';

export interface Source {
  title: string;
  url: string;
  type?: string;
  similarity?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
}

/**
 * Parse an SSE stream, calling `onEvent` for each complete event.
 */
async function readSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (event: string, data: string) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    // Split on double-newline (SSE event boundary)
    const parts = buffer.split('\n\n');
    buffer = parts.pop() || '';

    for (const part of parts) {
      let eventType = 'message';
      let data = '';
      for (const line of part.split('\n')) {
        if (line.startsWith('event: ')) eventType = line.slice(7).trim();
        else if (line.startsWith('data: ')) data = line.slice(6);
      }
      if (data) onEvent(eventType, data);
    }
  }
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [thinking, setThinking] = useState(false);
  const conversationId = useRef<string | null>(null);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      // Add user message immediately
      setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);
      setThinking(true);

      // Append a blank assistant message that we'll stream into
      setMessages((prev) => [...prev, { role: 'assistant', text: '' }]);

      try {
        const res = await fetch(`${client.supabaseUrl}/functions/v1/chat`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${client.supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: trimmed,
            client_slug: client.slug,
            conversation_id: conversationId.current,
          }),
        });

        if (!res.ok) throw new Error(`Chat API returned ${res.status}`);

        if (!res.body) throw new Error('No response body');

        await readSSE(res.body, (event, data) => {
          if (event === 'delta') {
            const { text: delta } = JSON.parse(data);
            // Append delta text to the last (assistant) message
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, text: last.text + delta };
              return updated;
            });
          } else if (event === 'sources') {
            const { sources, conversation_id } = JSON.parse(data);
            if (conversation_id) {
              conversationId.current = conversation_id;
            }
            // Attach sources to the last (assistant) message
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = { ...last, sources: sources ?? [] };
              return updated;
            });
          } else if (event === 'error') {
            const { error } = JSON.parse(data);
            console.error('Stream error:', error);
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];
              updated[updated.length - 1] = {
                ...last,
                text: last.text || "Sorry, I couldn't generate a response.",
              };
              return updated;
            });
          }
        });

        // If the assistant message is still empty after stream, show fallback
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === 'assistant' && !last.text) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: "Sorry, I couldn't generate a response.",
            };
            return updated;
          }
          return prev;
        });
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          // If the last message is the empty assistant placeholder, replace it
          if (last.role === 'assistant' && !last.text) {
            const updated = [...prev];
            updated[updated.length - 1] = {
              ...last,
              text: 'Something went wrong connecting to the knowledge base. Please try again.',
            };
            return updated;
          }
          return [
            ...prev,
            {
              role: 'assistant',
              text: 'Something went wrong connecting to the knowledge base. Please try again.',
            },
          ];
        });
      } finally {
        setThinking(false);
      }
    },
    [thinking],
  );

  const reset = useCallback(() => {
    setMessages([]);
    conversationId.current = null;
  }, []);

  return { messages, thinking, send, reset };
}
