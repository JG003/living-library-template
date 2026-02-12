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

        const data = await res.json();

        // Persist conversation ID for multi-turn
        if (data.conversation_id) {
          conversationId.current = data.conversation_id;
        }

        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: data.message ?? 'Sorry, I couldn't generate a response.',
            sources: data.sources ?? [],
          },
        ]);
      } catch (err) {
        console.error('Chat error:', err);
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'Something went wrong connecting to the knowledge base. Please try again.',
          },
        ]);
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
