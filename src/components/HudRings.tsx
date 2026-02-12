import { client } from '@/config/client';

const C = client.theme;

interface Props {
  active: boolean;
  size?: number;
}

export default function HudRings({ active, size = 280 }: Props) {
  const r1 = size * 0.48;
  const r2 = size * 0.42;
  const r3 = size * 0.36;
  const cx = size / 2;
  const cy = size / 2;

  const ticks = Array.from({ length: 36 }, (_, i) => {
    const angle = (i * 10 * Math.PI) / 180;
    const major = i % 3 === 0;
    return {
      x1: cx + (r1 + 6) * Math.cos(angle),
      y1: cy + (r1 + 6) * Math.sin(angle),
      x2: cx + (r1 + (major ? 14 : 9)) * Math.cos(angle),
      y2: cy + (r1 + (major ? 14 : 9)) * Math.sin(angle),
      width: major ? 1.2 : 0.6,
    };
  });

  const corners = [
    [-1, -1],
    [1, -1],
    [1, 1],
    [-1, 1],
  ] as const;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer ring — dashed, slow rotation */}
      <circle
        cx={cx}
        cy={cy}
        r={r1}
        fill="none"
        stroke={active ? 'rgba(0,212,255,0.15)' : 'rgba(0,212,255,0.08)'}
        strokeWidth="1"
        strokeDasharray="4 8"
        filter="url(#glow)"
        style={{ animation: 'spinSlow 30s linear infinite', transformOrigin: 'center' }}
      />

      {/* Middle ring — segmented */}
      <circle
        cx={cx}
        cy={cy}
        r={r2}
        fill="none"
        stroke={active ? 'rgba(0,212,255,0.25)' : 'rgba(0,212,255,0.1)'}
        strokeWidth="1.5"
        strokeDasharray="20 10 5 10"
        filter="url(#glow)"
        style={{
          animation: 'spinReverse 20s linear infinite',
          transformOrigin: 'center',
          transition: 'stroke 0.6s',
        }}
      />

      {/* Inner ring — solid thin */}
      <circle
        cx={cx}
        cy={cy}
        r={r3}
        fill="none"
        stroke={active ? 'rgba(0,212,255,0.35)' : 'rgba(0,212,255,0.12)'}
        strokeWidth="0.8"
        filter="url(#glow)"
        style={{
          animation: 'spinSlow 15s linear infinite',
          transformOrigin: 'center',
          transition: 'stroke 0.6s',
        }}
      />

      {/* Tick marks */}
      {ticks.map((t, i) => (
        <line
          key={i}
          x1={t.x1}
          y1={t.y1}
          x2={t.x2}
          y2={t.y2}
          stroke={active ? 'rgba(0,212,255,0.2)' : 'rgba(0,212,255,0.06)'}
          strokeWidth={t.width}
          style={{ transition: 'stroke 0.6s' }}
        />
      ))}

      {/* Crosshairs */}
      <line x1={cx} y1={cy - r1 - 18} x2={cx} y2={cy - r1 - 6} stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />
      <line x1={cx} y1={cy + r1 + 6} x2={cx} y2={cy + r1 + 18} stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />
      <line x1={cx - r1 - 18} y1={cy} x2={cx - r1 - 6} y2={cy} stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />
      <line x1={cx + r1 + 6} y1={cy} x2={cx + r1 + 18} y2={cy} stroke="rgba(0,212,255,0.12)" strokeWidth="0.8" />

      {/* Corner brackets */}
      {corners.map(([dx, dy], i) => {
        const bx = cx + dx * (r1 + 24);
        const by = cy + dy * (r1 + 24);
        return (
          <g key={i} stroke="rgba(0,212,255,0.1)" strokeWidth="0.8" fill="none">
            <line x1={bx} y1={by} x2={bx - dx * 12} y2={by} />
            <line x1={bx} y1={by} x2={bx} y2={by - dy * 12} />
          </g>
        );
      })}
    </svg>
  );
}
