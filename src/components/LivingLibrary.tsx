import { useState, useRef, useEffect } from 'react';
import { client } from '@/config/client';
import { useChat } from '@/hooks/useChat';
import HudRings from './HudRings';
import ChatMessage from './ChatMessage';
import ThinkingDots from './ThinkingDots';
import SidePanel from './SidePanel';

const C = client.theme;

export default function LivingLibrary() {
  const { messages, thinking, send, reset } = useChat();
  const [input, setInput] = useState('');
  const [sidebar, setSidebar] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, thinking]);

  const handleSend = (text: string) => {
    if (!text.trim() || thinking) return;
    send(text);
    setInput('');
  };

  const hasChat = messages.length > 0;

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: C.bg,
        fontFamily: "'DM Sans',sans-serif",
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Ambient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background: `
            radial-gradient(ellipse at 50% 40%, rgba(0,212,255,0.03) 0%, transparent 60%),
            radial-gradient(ellipse at 20% 80%, rgba(0,100,200,0.02) 0%, transparent 50%),
            ${C.bg}
          `,
        }}
      />

      {/* Scanline */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: 1,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.06) 50%, transparent 100%)',
          animation: 'scanline 8s linear infinite',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Top bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Nav button */}
          <button
            onClick={() => setSidebar(true)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 8,
              color: C.dim,
              transition: 'color 0.25s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.cyan)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            >
              <polyline points="4,7 10,12 4,17" />
              <polyline points="12,7 18,12 12,17" />
            </svg>
          </button>

          {/* Session reset indicator — only visible during conversation */}
          {hasChat && (
            <button
              onClick={() => {
                reset();
                setInput('');
              }}
              title="End session"
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                border: '1px solid rgba(0,212,255,0.12)',
                background: 'rgba(0,212,255,0.04)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'sessionPulse 3s ease-in-out infinite, fadeIn 0.4s ease-out',
                transition: 'all 0.25s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)';
                e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke={C.cyan}
                strokeWidth="1.5"
                strokeLinecap="round"
              >
                <path d="M3 12a9 9 0 109-9" />
                <polyline points="3,3 3,9 9,9" />
              </svg>
            </button>
          )}
        </div>

        {/* Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: C.text, lineHeight: 1.2 }}>{client.name}</div>
            <div
              style={{
                fontSize: 10,
                color: C.muted,
                fontFamily: "'JetBrains Mono',monospace",
                letterSpacing: 0.3,
              }}
            >
              {client.tagline}
            </div>
          </div>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              overflow: 'hidden',
              border: '1px solid rgba(0,212,255,0.15)',
              background: 'linear-gradient(135deg, #12162050, #080c14)',
            }}
          >
            <img
              src="/avatar.jpg"
              alt="Josh Galt"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                const el = e.currentTarget;
                el.style.display = 'none';
                el.parentElement!.innerHTML =
                  '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#5a6280" stroke-width="1.2" style="margin:auto;display:block;margin-top:10px"><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0112 0v1"/></svg>';
              }}
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* ── Initial state: HUD + Voice + Input ── */}
        {!hasChat && (
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 24px',
              animation: 'fadeIn 0.5s ease-out',
              position: 'relative',
            }}
          >
            {/* HUD rings with mic button */}
            <div style={{ position: 'relative', width: 280, height: 280, marginBottom: 40 }}>
              <HudRings active={false} size={280} />
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 5,
                }}
              >
                {/* Voice button — visual placeholder */}
                <button
                  style={{
                    position: 'relative',
                    width: 88,
                    height: 88,
                    borderRadius: '50%',
                    border: '1.5px solid rgba(0,212,255,0.15)',
                    background: 'rgba(0,212,255,0.04)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.4s ease',
                    boxShadow: '0 0 30px rgba(0,212,255,0.06)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)';
                    e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                    e.currentTarget.style.boxShadow = '0 0 40px rgba(0,212,255,0.15), 0 0 80px rgba(0,212,255,0.06)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)';
                    e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
                    e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.06)';
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: -20,
                      borderRadius: '50%',
                      background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
                      animation: 'breathe 4s ease-in-out infinite',
                    }}
                  />
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    style={{ position: 'relative', zIndex: 2 }}
                  >
                    <rect x="9" y="1" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0014 0" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Text input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                width: '100%',
                maxWidth: 480,
                marginBottom: 28,
              }}
            >
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '11px 16px',
                  borderRadius: 10,
                  background: 'rgba(255,255,255,0.03)',
                  border: `1px solid ${C.border}`,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = C.borderLit;
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }}
                onBlur={(e) => {
                  if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="question everything..."
                  style={{
                    flex: 1,
                    background: 'none',
                    border: 'none',
                    color: C.text,
                    fontSize: 14,
                    fontFamily: "'DM Sans',sans-serif",
                  }}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 7,
                    border: 'none',
                    background: input.trim() ? C.cyan : 'rgba(255,255,255,0.03)',
                    color: input.trim() ? C.bg : C.muted,
                    cursor: input.trim() ? 'pointer' : 'default',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.25s',
                    flexShrink: 0,
                  }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12,5 19,12 12,19" />
                  </svg>
                </button>
              </div>
            </form>

            {/* Topic pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
              {client.topics.map((t, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(t.q)}
                  style={{
                    padding: '7px 18px',
                    borderRadius: 7,
                    border: `1px solid ${C.border}`,
                    background: 'transparent',
                    color: C.dim,
                    fontSize: 12,
                    fontFamily: "'JetBrains Mono',monospace",
                    letterSpacing: 0.5,
                    cursor: 'pointer',
                    transition: 'all 0.25s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = C.borderLit;
                    e.currentTarget.style.color = C.text;
                    e.currentTarget.style.background = C.panel;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = C.border;
                    e.currentTarget.style.color = C.dim;
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Conversation state ── */}
        {hasChat && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              <div style={{ maxWidth: 660, margin: '0 auto' }}>
                {messages.map((m, i) => (
                  <ChatMessage key={i} role={m.role} text={m.text} sources={m.sources} />
                ))}
                {thinking && <ThinkingDots />}
                <div ref={endRef} />
              </div>
            </div>

            {/* Bottom input */}
            <div
              style={{
                padding: '12px 24px 20px',
                background: `linear-gradient(to top, ${C.bg} 70%, transparent)`,
              }}
            >
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(input);
                }}
                style={{
                  maxWidth: 660,
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px 14px',
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.03)',
                    border: `1px solid ${C.border}`,
                    transition: 'border-color 0.2s, background 0.2s',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = C.borderLit;
                    e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  }}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                    }
                  }}
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    disabled={thinking}
                    style={{
                      flex: 1,
                      background: 'none',
                      border: 'none',
                      color: C.text,
                      fontSize: 14,
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || thinking}
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 7,
                      border: 'none',
                      background: input.trim() ? C.cyan : 'rgba(255,255,255,0.03)',
                      color: input.trim() ? C.bg : C.muted,
                      cursor: input.trim() ? 'pointer' : 'default',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.25s',
                      flexShrink: 0,
                    }}
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12,5 19,12 12,19" />
                    </svg>
                  </button>
                </div>

                {/* Mic button (compact, conversation state) */}
                <button
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    flexShrink: 0,
                    border: '1px solid rgba(0,212,255,0.12)',
                    background: C.cyanGlow,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)';
                    e.currentTarget.style.background = 'rgba(0,212,255,0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.12)';
                    e.currentTarget.style.background = C.cyanGlow;
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  >
                    <rect x="9" y="1" width="6" height="12" rx="3" />
                    <path d="M5 10a7 7 0 0014 0" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <SidePanel open={sidebar} onClose={() => setSidebar(false)} onNewConversation={reset} />

      {/* Footer attribution */}
      <div
        style={{
          position: 'fixed',
          bottom: hasChat ? 70 : 12,
          left: 0,
          right: 0,
          textAlign: 'center',
          padding: '6px 0',
          zIndex: 5,
          pointerEvents: 'none',
          transition: 'bottom 0.3s ease',
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: '#2a3048',
            pointerEvents: 'auto',
          }}
        >
          Living Library built by{' '}
          <a
            href="https://AnabasisIntelligence.com/living-library"
            target="_blank"
            style={{
              color: '#5a6280',
              textDecoration: 'none',
              transition: 'color 0.25s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#00d4ff')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#5a6280')}
          >
            Anabasis Intelligence
          </a>
        </span>
      </div>
    </div>
  );
}
