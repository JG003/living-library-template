import { useRef, useEffect } from 'react';
import { client } from '@/config/client';

const C = client.theme;

interface VoiceTranscript {
  role: 'user' | 'assistant';
  text: string;
}

interface VoiceSessionProps {
  onEnd: () => void;
  transcripts: VoiceTranscript[];
  audioLevel: number;
}

export default function VoiceSession({ onEnd, transcripts, audioLevel = 0 }: VoiceSessionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcripts]);

  // 5-layer glow system — tuned for circular image with focused hotspot
  const glowOuter = 0.03 + audioLevel * 0.18;
  const blurSize = 12 + audioLevel * 25;
  const borderGlow = 0.1 + audioLevel * 0.3;
  const glowCore = 0.04 + audioLevel * 0.28;
  const hotspotOpacity = 0.1 + audioLevel * 0.55;

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '0 24px',
        animation: 'fadeIn 0.4s ease-out',
      }}
    >
      {/* Image container with 5-layer glow */}
      <div
        style={{
          position: 'relative',
          width: 180,
          height: 180,
          marginTop: 40,
          marginBottom: 28,
          flexShrink: 0,
        }}
      >
        {/* Layer 1: Outer ambient glow — behind */}
        <div
          style={{
            position: 'absolute',
            inset: -30,
            borderRadius: '50%',
            background: `radial-gradient(circle, rgba(0,212,255,${glowOuter}) 0%, rgba(0,212,255,${glowOuter * 0.3}) 40%, transparent 70%)`,
            filter: `blur(${blurSize}px)`,
            transition: 'all 0.1s ease-out',
            pointerEvents: 'none',
          }}
        />

        {/* Layer 2: The image, circular clip */}
        <div
          style={{
            position: 'relative',
            width: 180,
            height: 180,
            borderRadius: '50%',
            overflow: 'hidden',
            border: `1.5px solid rgba(0,212,255,${borderGlow})`,
            transition: 'border-color 0.1s ease-out',
            zIndex: 2,
          }}
        >
          <img
            src="/image.png"
            alt="Voice Avatar"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              // Fallback to avatar.jpg if image.png not found
              (e.currentTarget as HTMLImageElement).src = '/avatar.jpg';
            }}
          />
        </div>

        {/* Layer 3: Broad glow wash — on top */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(ellipse at 50% 35%, rgba(0,212,255,${glowCore}) 0%, rgba(0,212,255,${glowCore * 0.15}) 40%, transparent 65%)`,
            pointerEvents: 'none',
            transition: 'all 0.1s ease-out',
            zIndex: 3,
          }}
        />

        {/* Layer 4: Focused hotspot — small intense dot at center */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 40%, rgba(0,212,255,${hotspotOpacity}) 0%, rgba(0,212,255,${hotspotOpacity * 0.3}) 8%, transparent 18%)`,
            pointerEvents: 'none',
            transition: 'all 0.1s ease-out',
            zIndex: 4,
          }}
        />

        {/* Layer 5: Edge rim light */}
        <div
          style={{
            position: 'absolute',
            inset: -1,
            borderRadius: '50%',
            boxShadow: `inset 0 0 ${8 + audioLevel * 12}px rgba(0,212,255,${0.05 + audioLevel * 0.12})`,
            pointerEvents: 'none',
            transition: 'all 0.1s ease-out',
            zIndex: 5,
          }}
        />
      </div>

      {/* Status indicator */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: C.cyan,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 11,
            letterSpacing: 1,
            color: C.dim,
          }}
        >
          voice session active
        </span>
      </div>

      {/* Transcript area — scrolling messages */}
      <div
        style={{
          flex: 1,
          width: '100%',
          maxWidth: 560,
          overflowY: 'auto',
          paddingBottom: 20,
        }}
      >
        {transcripts.map((t, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              justifyContent: t.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 10,
              animation: 'slideUp 0.3s ease-out',
            }}
          >
            <div
              style={{
                maxWidth: '85%',
                padding: '10px 14px',
                borderRadius: t.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                background: t.role === 'user' ? 'rgba(0,212,255,0.06)' : C.panel,
                border: `1px solid ${t.role === 'user' ? 'rgba(0,212,255,0.1)' : C.border}`,
                color: t.role === 'user' ? C.text : 'rgba(255,255,255,0.7)',
                fontSize: 13,
                lineHeight: 1.6,
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {t.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>

      {/* End session button */}
      <div style={{ padding: '16px 0 28px', flexShrink: 0 }}>
        <button
          onClick={onEnd}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 24px',
            borderRadius: 10,
            border: '1px solid rgba(0,212,255,0.15)',
            background: 'rgba(0,212,255,0.04)',
            color: C.dim,
            fontSize: 12,
            fontFamily: "'JetBrains Mono',monospace",
            letterSpacing: 0.5,
            cursor: 'pointer',
            transition: 'all 0.25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)';
            e.currentTarget.style.color = C.text;
            e.currentTarget.style.background = 'rgba(0,212,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(0,212,255,0.15)';
            e.currentTarget.style.color = C.dim;
            e.currentTarget.style.background = 'rgba(0,212,255,0.04)';
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <rect x="4" y="4" width="16" height="16" rx="2" />
          </svg>
          end session
        </button>
      </div>
    </div>
  );
}
