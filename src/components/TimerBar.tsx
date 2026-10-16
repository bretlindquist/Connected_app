import React, { useEffect, useState } from 'react';
import { Clock, Plus } from 'lucide-react';

interface TimerBarProps {
  totalSeconds: number;
  cardKey: string;
  isPaused?: boolean;
  badgeText: string;
  accentColor?: string;
}

export const TimerBar: React.FC<TimerBarProps> = ({
  totalSeconds,
  cardKey,
  isPaused = false,
  badgeText,
  accentColor = 'var(--accent-rose)'
}) => {
  const [remaining, setRemaining] = useState(totalSeconds);
  const [maxTime, setMaxTime] = useState(totalSeconds);

  useEffect(() => {
    setRemaining(totalSeconds);
    setMaxTime(totalSeconds);
  }, [cardKey, totalSeconds]);

  useEffect(() => {
    if (isPaused) return;
    const interval = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleAddGrace = () => {
    setRemaining((prev) => prev + 15);
    setMaxTime((prev) => Math.max(prev, remaining + 15));
  };

  const pct = Math.max(0, Math.min(100, (remaining / maxTime) * 100));
  const isLow = remaining <= 12 && remaining > 0;
  const isDone = remaining === 0;

  return (
    <div style={{ marginBottom: 14 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8,
          gap: 8
        }}
      >
        <span
          className="stamp-badge"
          style={{
            background: `${accentColor}15`,
            color: accentColor
          }}
        >
          {badgeText}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '4px 10px',
              borderRadius: 999,
              background: isDone
                ? 'var(--accent-rose-soft)'
                : isLow
                ? 'rgba(212, 149, 58, 0.15)'
                : 'var(--surface-subtle)',
              color: isDone
                ? 'var(--accent-rose-deep)'
                : isLow
                ? '#B8791E'
                : 'var(--ink-secondary)',
              fontSize: '0.75rem',
              fontWeight: 700
            }}
          >
            <Clock size={12} />
            <span>
              {isPaused
                ? 'Paused'
                : isDone
                ? 'Time’s up · take a breath!'
                : `${remaining}s`}
            </span>
          </div>

          <button
            type="button"
            onClick={handleAddGrace}
            title="Add 15 seconds"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 2,
              padding: '4px 9px',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              background: '#FFFFFF',
              color: 'var(--ink-primary)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Plus size={11} />
            <span>15s</span>
          </button>
        </div>
      </div>

      {/* Delicate 4px progress bar */}
      <div
        style={{
          width: '100%',
          height: 4,
          background: 'var(--surface-subtle)',
          borderRadius: 999,
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: isDone
              ? 'var(--accent-rose)'
              : isLow
              ? 'var(--accent-champagne)'
              : accentColor,
            transition: 'width 0.9s linear, background-color 0.3s ease',
            borderRadius: 999
          }}
        />
      </div>
    </div>
  );
};
