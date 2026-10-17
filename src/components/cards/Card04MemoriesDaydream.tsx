import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { MemoriesDaydreamData } from '../../types/app';

interface Card04Props {
  mode: 'create' | 'reveal';
  data: MemoriesDaydreamData;
  playerName: string;
  partnerName?: string;
  onChange: (updated: MemoriesDaydreamData) => void;
}

export const Card04MemoriesDaydream: React.FC<Card04Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const [guessedIdx, setGuessedIdx] = useState<number | null>(null);

  const handleUpdateItem = (index: 0 | 1 | 2, val: string) => {
    const next: [string, string, string] = [...data.items] as [
      string,
      string,
      string
    ];
    next[index] = val;
    onChange({ ...data, items: next });
  };

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--ink-secondary)',
            marginBottom: 2
          }}
        >
          Read all 3 out loud! Have the table vote &amp; tap the ONE they think is{' '}
          {playerName === 'You' ? 'your' : `${playerName}’s`} unlived{' '}
          <strong style={{ color: 'var(--accent-berry)' }}>Daydream</strong>:
        </div>

        {[0, 1, 2].map((idx) => {
          const text = data.items[idx] || `Story #${idx + 1}`;
          const isDaydream = data.daydreamIndex === idx;
          const isRevealed = guessedIdx !== null;
          const isChosen = guessedIdx === idx;

          return (
            <button
              key={idx}
              type="button"
              onClick={() => setGuessedIdx(idx)}
              style={{
                textAlign: 'left',
                padding: '15px 16px',
                borderRadius: 18,
                background: isRevealed
                  ? isDaydream
                    ? 'var(--surface-berry-tint)'
                    : '#FFFFFF'
                  : 'var(--surface-subtle)',
                border: isRevealed
                  ? isDaydream
                    ? '2px solid var(--accent-berry)'
                    : '1px solid var(--border-hairline)'
                  : '1px solid var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4
                }}
              >
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: isRevealed
                      ? isDaydream
                        ? 'var(--accent-berry)'
                        : 'var(--accent-sage)'
                      : 'var(--ink-muted)'
                  }}
                >
                  {isRevealed
                    ? isDaydream
                      ? '✨ THE UNLIVED DAYDREAM'
                      : '✓ TRUE PAST MEMORY'
                    : `Story Ticket #${idx + 1}`}
                </span>
                {isChosen && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: isDaydream
                        ? 'var(--accent-berry)'
                        : 'var(--accent-rose)'
                    }}
                  >
                    {isDaydream
                      ? 'Spot on!'
                      : `Fooled you! That actually happened.`}
                  </span>
                )}
              </div>

              <div
                className="font-display"
                style={{
                  fontSize: '1.04rem',
                  color: 'var(--ink-primary)',
                  fontWeight: 600
                }}
              >
                “{text}”
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--ink-secondary)',
          lineHeight: 1.4
        }}
      >
        Write 3 short headlines—two real memories and one daydream you haven’t lived yet. Tap the pill next to the one that is your{' '}
        <strong style={{ color: 'var(--accent-berry)' }}>Daydream</strong>:
      </div>

      {([0, 1, 2] as const).map((idx) => {
        const isDaydream = data.daydreamIndex === idx;
        return (
          <div
            key={idx}
            style={{
              background: isDaydream
                ? 'var(--surface-berry-tint)'
                : 'var(--surface-subtle)',
              padding: 13,
              borderRadius: 18,
              border: isDaydream
                ? '1.5px solid var(--accent-berry)'
                : '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span
                style={{
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  color: isDaydream
                    ? 'var(--accent-berry)'
                    : 'var(--ink-secondary)'
                }}
              >
                {isDaydream ? '✨ Secret Daydream' : `✓ Real Memory`}
              </span>

              <button
                type="button"
                onClick={() => onChange({ ...data, daydreamIndex: idx })}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 11px',
                  borderRadius: 999,
                  border: isDaydream
                    ? 'none'
                    : '1px solid var(--border-subtle)',
                  background: isDaydream ? 'var(--accent-berry)' : '#FFFFFF',
                  color: isDaydream ? '#FFFFFF' : 'var(--ink-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                {isDaydream ? (
                  <>
                    <Sparkles size={11} />
                    <span>Marked as Daydream</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={11} />
                    <span>Mark as Daydream</span>
                  </>
                )}
              </button>
            </div>

            <input
              type="text"
              className="paper-input"
              value={data.items[idx]}
              onChange={(e) => handleUpdateItem(idx, e.target.value)}
              placeholder={
                isDaydream
                  ? 'A future adventure or secret wish...'
                  : 'A real micro-story from your past...'
              }
              maxLength={85}
            />
          </div>
        );
      })}
    </div>
  );
};
