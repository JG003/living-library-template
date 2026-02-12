import { useState } from 'react';
import { client } from '@/config/client';

const C = client.theme;

interface Props {
  open: boolean;
  onClose: () => void;
  onNewConversation: () => void;
}

export default function SidePanel({ open, onClose, onNewConversation }: Props) {
  const [tab, setTab] = useState<'library' | 'about'>('library');

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            zIndex: 40,
            animation: 'fadeIn 0.2s ease-out',
          }}
        />
      )}

      {/* Panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: 'min(340px, 85vw)',
          zIndex: 50,
          background: 'rgba(10,14,22,0.97)',
          backdropFilter: 'blur(40px)',
          borderRight: `1px solid ${C.border}`,
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '18px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${C.border}`,
          }}
        >
          <span
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: 10,
              letterSpacing: 2.5,
              color: C.cyan,
              fontWeight: 500,
            }}
          >
            LIVING LIBRARY
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: C.dim,
              padding: 4,
              display: 'flex',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = C.text)}
            onMouseLeave={(e) => (e.currentTarget.style.color = C.dim)}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              <polyline points="18,7 12,12 18,17" />
              <polyline points="10,7 4,12 10,17" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${C.border}`, padding: '0 20px' }}>
          {(['library', 'about'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '11px 16px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t ? `1.5px solid ${C.cyan}` : '1.5px solid transparent',
                color: tab === t ? C.text : C.dim,
                fontFamily: "'DM Sans',sans-serif",
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 20px' }}>
          {tab === 'library' && (
            <>
              <input
                placeholder="Search..."
                style={{
                  width: '100%',
                  padding: '9px 14px',
                  borderRadius: 7,
                  border: `1px solid ${C.border}`,
                  background: C.panel,
                  color: C.text,
                  fontSize: 12,
                  fontFamily: "'JetBrains Mono',monospace",
                  outline: 'none',
                  marginBottom: 10,
                  boxSizing: 'border-box',
                }}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                {client.contentItems.map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '10px 12px',
                      borderRadius: 7,
                      border: `1px solid ${C.border}`,
                      background: C.panel,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = C.borderLit;
                      e.currentTarget.style.background = C.panelHover;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = C.border;
                      e.currentTarget.style.background = C.panel;
                    }}
                  >
                    <div
                      style={{
                        fontSize: 12,
                        color: C.text,
                        lineHeight: 1.4,
                        fontFamily: "'DM Sans',sans-serif",
                        marginBottom: 4,
                      }}
                    >
                      {item.title}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: 9,
                          fontFamily: "'JetBrains Mono',monospace",
                          letterSpacing: 0.5,
                          padding: '1px 6px',
                          borderRadius: 4,
                          background: C.cyanGlow,
                          color: C.cyan,
                        }}
                      >
                        {item.type}
                      </span>
                      <span style={{ fontSize: 10, color: C.muted }}>{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 'about' && (
            <div style={{ fontFamily: "'DM Sans',sans-serif" }}>
              <div
                style={{
                  padding: '14px 14px',
                  borderRadius: 7,
                  border: `1px solid ${C.border}`,
                  background: C.panel,
                  marginBottom: 18,
                }}
              >
                <p style={{ color: C.text, fontSize: 13, lineHeight: 1.7, margin: 0 }}>{client.bio}</p>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono',monospace",
                  fontSize: 9,
                  letterSpacing: 2,
                  color: C.muted,
                  textTransform: 'uppercase',
                }}
              >
                Projects
              </span>
              <div style={{ marginTop: 8 }}>
                {client.links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '8px 10px',
                      borderRadius: 5,
                      color: C.dim,
                      textDecoration: 'none',
                      fontSize: 12,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.panel;
                      e.currentTarget.style.color = C.text;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = C.dim;
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                      <polyline points="15,3 21,3 21,9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* New conversation button */}
        <div style={{ padding: '14px 20px', borderTop: `1px solid ${C.border}` }}>
          <button
            onClick={() => {
              onNewConversation();
              onClose();
            }}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 7,
              border: `1px solid ${C.borderLit}`,
              background: C.cyanGlow,
              color: C.cyan,
              fontSize: 12,
              fontFamily: "'JetBrains Mono',monospace",
              letterSpacing: 0.5,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            New Conversation
          </button>
        </div>
      </div>
    </>
  );
}
