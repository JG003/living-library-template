import { client } from '@/config/client';

const C = client.theme;

export default function ThinkingDots() {
  return (
    <div style={{ display: 'flex', marginBottom: 14, animation: 'slideUp 0.3s ease-out' }}>
      <div
        style={{
          padding: '14px 22px',
          borderRadius: '14px 14px 14px 4px',
          background: C.panel,
          border: `1px solid ${C.border}`,
          display: 'flex',
          gap: 6,
        }}
      >
        {[0, 0.15, 0.3].map((delay, i) => (
          <span
            key={i}
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: C.cyan,
              opacity: 0.4,
              animation: `pulse 1.4s ease-in-out ${delay}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
