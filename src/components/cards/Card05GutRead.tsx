import React from 'react';
import { Sparkles, Award } from 'lucide-react';
import { GutReadData } from '../../types/app';
import { GUT_READ_STEMS } from '../../data/cardsVault';

interface Card05Props {
  mode: 'create' | 'reveal';
  data: GutReadData;
  playerName: string;
  partnerName: string;
  onChange: (updated: GutReadData) => void;
}

export const Card05GutRead: React.FC<Card05Props> = ({
  mode,
  data,
  playerName,
  partnerName,
  onChange
}) => {
  const currentStemObj =
    GUT_READ_STEMS[data.stemIndex] || GUT_READ_STEMS[0];

  const handleCycleStem = () => {
    const nextIdx = (data.stemIndex + 1) % GUT_READ_STEMS.length;
    onChange({
      ...data,
      stemIndex: nextIdx,
      prediction: GUT_READ_STEMS[nextIdx].chips[0]
    });
  };

  if (mode === 'reveal') {
    const stamps: Array<{
      id: 'scary-accurate' | 'painfully-close' | 'totally-wrong';
      label: string;
      color: string;
      bg: string;
    }> = [
      {
        id: 'scary-accurate',
        label: '🎯 Scary Accurate',
        color: '#2F7A5E',
        bg: 'rgba(47, 122, 94, 0.1)'
      },
      {
        id: 'painfully-close',
        label: '🔥 Painfully Close',
        color: '#D4953A',
        bg: 'rgba(212, 149, 58, 0.12)'
      },
      {
        id: 'totally-wrong',
        label: '😂 Way Off (Tell Me Why!)',
        color: '#E05A47',
        bg: 'var(--accent-rose-soft)'
      }
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            background: 'var(--surface-subtle)',
            borderRadius: 20,
            padding: 18,
            border: '1px solid var(--border-hairline)',
            position: 'relative'
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-cobalt)',
              marginBottom: 6
            }}
          >
            {playerName}’s Gut-Read About {partnerName}
          </div>

          <div
            style={{
              fontSize: '0.9rem',
              color: 'var(--ink-secondary)',
              marginBottom: 8
            }}
          >
            “{currentStemObj.stem}”
          </div>

          <div
            className="font-display"
            style={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'var(--ink-primary)',
              padding: '14px 16px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid var(--border-hairline)',
              boxShadow: 'var(--shadow-pill)'
            }}
          >
            “{data.prediction || 'Still reading the room...'}”
          </div>
        </div>

        {/* Partner Stamp Buttons */}
        <div>
          <div
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--ink-secondary)',
              marginBottom: 8
            }}
          >
            <Award
              size={14}
              color="var(--accent-rose)"
              style={{ verticalAlign: 'middle', marginRight: 5 }}
            />
            {partnerName}, stamp your official verdict:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {stamps.map((st) => {
              const active = data.accuracyStamp === st.id;
              return (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onChange({ ...data, accuracyStamp: st.id })}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 999,
                    border: active
                      ? `2px solid ${st.color}`
                      : '1px solid var(--border-subtle)',
                    background: active ? st.bg : '#FFFFFF',
                    color: active ? st.color : 'var(--ink-primary)',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span>{st.label}</span>
                  {active && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        background: st.color,
                        color: '#FFFFFF'
                      }}
                    >
                      Stamped
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Stem Selector */}
      <div
        style={{
          background: 'var(--surface-subtle)',
          padding: 14,
          borderRadius: 18,
          border: '1px solid var(--border-hairline)',
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
              fontSize: '0.73rem',
              fontWeight: 700,
              color: 'var(--accent-cobalt)'
            }}
          >
            Prompt Stem #{data.stemIndex + 1} of {GUT_READ_STEMS.length}
          </span>
          <button
            type="button"
            onClick={handleCycleStem}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              padding: '5px 11px',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              background: '#FFFFFF',
              fontSize: '0.73rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: 'var(--ink-primary)'
            }}
          >
            <Sparkles size={12} color="var(--accent-cobalt)" />
            <span>Try Another Stem</span>
          </button>
        </div>

        <div
          className="font-display"
          style={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--ink-primary)'
          }}
        >
          “{currentStemObj.stem}”
        </div>
      </div>

      {/* Quick Inspiration Chips */}
      <div>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            marginBottom: 6
          }}
        >
          Tap a quick read about {partnerName}, or write your own below:
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {currentStemObj.chips.map((chip) => {
            const selected = data.prediction === chip;
            return (
              <button
                key={chip}
                type="button"
                onClick={() => onChange({ ...data, prediction: chip })}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: 14,
                  border: selected
                    ? '1.5px solid var(--accent-cobalt)'
                    : '1px solid var(--border-hairline)',
                  background: selected
                    ? 'rgba(59, 91, 219, 0.08)'
                    : 'var(--surface-subtle)',
                  color: selected
                    ? 'var(--accent-cobalt)'
                    : 'var(--ink-primary)',
                  fontSize: '0.83rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {chip}
              </button>
            );
          })}
        </div>
      </div>

      <input
        type="text"
        className="paper-input"
        value={data.prediction}
        onChange={(e) => onChange({ ...data, prediction: e.target.value })}
        placeholder={`Write your playful gut-read about ${partnerName}...`}
        maxLength={90}
      />
    </div>
  );
};
