import React from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { SpicyHillData } from '../../types/app';
import { SPICY_HILL_STARTERS } from '../../data/cardsVault';

interface Card09Props {
  mode: 'create' | 'reveal';
  data: SpicyHillData;
  playerName: string;
  partnerName: string;
  onChange: (updated: SpicyHillData) => void;
}

const HEAT_LABELS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: '🌶️ Mildly Warm (Polite Society)',
  2: '🌶️🌶️ Medium Kick (Dinner Table Debate)',
  3: '🌶️🌶️🌶️ Habanero (I Stand By This)',
  4: '🌶️🌶️🌶️🌶️ Ghost Pepper (Unapologetic)',
  5: '🌶️🌶️🌶️🌶️🌶️ Carolina Reaper (Will Die On This Hill)'
};

export const Card09SpicyHill: React.FC<Card09Props> = ({
  mode,
  data,
  playerName,
  partnerName,
  onChange
}) => {
  const handleRandomStarter = () => {
    const currentIdx = SPICY_HILL_STARTERS.indexOf(data.opinion);
    const nextIdx = (currentIdx + 1) % SPICY_HILL_STARTERS.length;
    onChange({ ...data, opinion: SPICY_HILL_STARTERS[nextIdx] });
  };

  if (mode === 'reveal') {
    const stamped = data.partnerReaction !== null;
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Clean Editorial Hot-Take Ticket */}
        <div
          style={{
            background: 'var(--surface-blush)',
            borderRadius: 22,
            padding: 20,
            border: '1.5px solid rgba(224, 90, 71, 0.25)',
            position: 'relative'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 10
            }}
          >
            <span
              className="stamp-badge"
              style={{
                background: 'var(--accent-rose)',
                color: '#FFFFFF'
              }}
            >
              <Flame size={11} /> {playerName}’s Spicy Hill
            </span>
          </div>

          <div
            className="font-display"
            style={{
              fontSize: '1.35rem',
              lineHeight: 1.25,
              fontWeight: 600,
              color: 'var(--ink-primary)',
              marginBottom: 14
            }}
          >
            “{data.opinion || 'Ask me my hottest harmless opinion!'}”
          </div>

          {/* Partner Reaction Stamps */}
          <div
            style={{
              borderTop: '1px solid rgba(224, 90, 71, 0.18)',
              paddingTop: 14
            }}
          >
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--ink-secondary)',
                marginBottom: 8
              }}
            >
              {partnerName}, stamp your reaction to unlock {playerName}’s heat meter:
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10
              }}
            >
              <button
                type="button"
                onClick={() => onChange({ ...data, partnerReaction: 'agree' })}
                style={{
                  padding: '12px',
                  borderRadius: 999,
                  border:
                    data.partnerReaction === 'agree'
                      ? '2px solid var(--accent-sage)'
                      : '1px solid var(--border-subtle)',
                  background:
                    data.partnerReaction === 'agree'
                      ? 'var(--accent-sage)'
                      : '#FFFFFF',
                  color:
                    data.partnerReaction === 'agree'
                      ? '#FFFFFF'
                      : 'var(--ink-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🤝 100% Agree
              </button>

              <button
                type="button"
                onClick={() =>
                  onChange({ ...data, partnerReaction: 'fight-me' })
                }
                style={{
                  padding: '12px',
                  borderRadius: 999,
                  border:
                    data.partnerReaction === 'fight-me'
                      ? '2px solid var(--accent-rose)'
                      : '1px solid var(--border-subtle)',
                  background:
                    data.partnerReaction === 'fight-me'
                      ? 'var(--accent-rose)'
                      : '#FFFFFF',
                  color:
                    data.partnerReaction === 'fight-me'
                      ? '#FFFFFF'
                      : 'var(--ink-primary)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                🥊 Fight Me On This
              </button>
            </div>
          </div>

          {/* Revealed Chili Heat Meter */}
          {stamped && (
            <div
              style={{
                marginTop: 14,
                padding: '11px 14px',
                borderRadius: 14,
                background: '#FFFFFF',
                border: '1px solid var(--border-hairline)',
                textAlign: 'center',
                boxShadow: 'var(--shadow-pill)'
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: 'var(--ink-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                {playerName}’s Self-Rated Spice Level
              </div>
              <div
                style={{
                  fontSize: '0.92rem',
                  fontWeight: 700,
                  color: 'var(--accent-rose-deep)',
                  marginTop: 2
                }}
              >
                {HEAT_LABELS[data.spiceLevel]}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--ink-secondary)'
          }}
        >
          Your Harmless Hill to Die On:
        </span>
        <button
          type="button"
          onClick={handleRandomStarter}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 11px',
            borderRadius: 999,
            border: '1px solid rgba(224, 90, 71, 0.25)',
            background: 'var(--surface-blush)',
            fontSize: '0.73rem',
            fontWeight: 700,
            cursor: 'pointer',
            color: 'var(--accent-rose-deep)'
          }}
        >
          <Sparkles size={12} />
          <span>Deal Sample Take</span>
        </button>
      </div>

      <textarea
        rows={3}
        className="paper-input"
        value={data.opinion}
        onChange={(e) => onChange({ ...data, opinion: e.target.value })}
        placeholder="e.g., Breakfast food is 10x better at 10 PM than at 8 AM..."
        maxLength={140}
        style={{ resize: 'none' }}
      />

      {/* 5-Chili Heat Slider */}
      <div
        style={{
          background: 'var(--surface-subtle)',
          padding: 14,
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 10
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
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--ink-secondary)'
            }}
          >
            Set Your Heat Meter:
          </span>
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--accent-rose-deep)'
            }}
          >
            {HEAT_LABELS[data.spiceLevel]}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: 6
          }}
        >
          {([1, 2, 3, 4, 5] as const).map((lvl) => {
            const active = data.spiceLevel >= lvl;
            return (
              <button
                key={lvl}
                type="button"
                onClick={() => onChange({ ...data, spiceLevel: lvl })}
                style={{
                  padding: '10px 0',
                  borderRadius: 12,
                  border:
                    data.spiceLevel === lvl
                      ? '2px solid var(--accent-rose)'
                      : '1px solid var(--border-subtle)',
                  background: active ? 'var(--surface-blush)' : '#FFFFFF',
                  fontSize: '1.15rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                🌶️
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
