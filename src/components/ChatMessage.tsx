import type { Source } from '@/hooks/useChat';
import { client } from '@/config/client';

const C = client.theme;

interface Props {
  role: 'user' | 'assistant';
  text: string;
  sources?: Source[];
}

export default function ChatMessage({ role, text, sources }: Props) {
  const isUser = role === 'user';

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: isUser ? 'flex-end' : 'flex-start',
        animation: 'slideUp 0.3s ease-out',
        marginBottom: 14,
      }}
    >
      <div
        style={{
          maxWidth: '82%',
          padding: '14px 18px',
          borderRadius: isUser ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
          background: isUser ? 'rgba(0,212,255,0.06)' : C.panel,
          border: `1px solid ${isUser ? 'rgba(0,212,255,0.1)' : C.border}`,
          color: C.text,
          fontSize: 14,
          lineHeight: 1.65,
          fontFamily: "'DM Sans',sans-serif",
        }}
      >
        {text.split('\n').map((line, i) => (
          <p key={i} style={{ margin: i ? '10px 0 0' : 0 }}>
            {line}
          </p>
        ))}

        {sources && sources.length > 0 && (
          <div style={{ marginTop: 12, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sources.map((s, i) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  padding: '3px 10px',
                  borderRadius: 5,
                  background: C.cyanGlow,
                  border: '1px solid rgba(0,212,255,0.1)',
                  color: C.cyan,
                  fontSize: 10,
                  textDecoration: 'none',
                  fontFamily: "'JetBrains Mono',monospace",
                }}
              >
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                  <polyline points="15,3 21,3 21,9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                {(s.title || 'Source').substring(0, 28)}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
