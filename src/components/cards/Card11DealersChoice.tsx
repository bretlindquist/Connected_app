import React from 'react';
import { Check } from 'lucide-react';
import { DealersChoiceData } from '../../types/app';
import { DEALERS_CHOICE_PROMPTS } from '../../data/cardsVault';

interface Card11Props {
  mode: 'create' | 'reveal';
  data: DealersChoiceData;
  playerName: string;
  partnerName: string;
  onChange: (updated: DealersChoiceData) => void;
}

export const Card11DealersChoice: React.FC<Card11Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const selectedPrompt =
    DEALERS_CHOICE_PROMPTS.find((p) => p.id === data.selectedPromptId) ||
    DEALERS_CHOICE_PROMPTS[0];

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            background: 'rgba(47, 122, 94, 0.08)',
            borderRadius: 22,
            padding: 20,
            border: '1.5px solid rgba(47, 122, 94, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12
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
              className="stamp-badge"
              style={{
                background: 'var(--accent-sage)',
                color: '#FFFFFF'
              }}
            >
              {selectedPrompt.hookBadge}
            </span>
            <span
              style={{
                fontSize: '0.73rem',
                fontWeight: 600,
                color: 'var(--ink-secondary)'
              }}
            >
              {selectedPrompt.classicOrigin}
            </span>
          </div>

          <div
            className="font-display"
            style={{
              fontSize: '1.28rem',
              lineHeight: 1.25,
              fontWeight: 600,
              color: 'var(--ink-primary)'
            }}
          >
            “{selectedPrompt.question}”
          </div>

          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 16,
              padding: '14px 16px',
              border: '1px solid var(--border-hairline)',
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
              {playerName}’s Story Cue
            </div>
            <div
              className="font-hand"
              style={{
                fontSize: '1.42rem',
                color: 'var(--ink-primary)',
                marginTop: 4
              }}
            >
              “{data.QuickNote || 'Let me tell you the story live...'}”
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          fontSize: '0.78rem',
          fontWeight: 700,
          color: 'var(--ink-secondary)'
        }}
      >
        Pick 1 of the 8 Joe Hudson-spun prompts to answer:
      </div>

      {/* 2-Column Interactive Grid of 8 Prompts */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          maxHeight: 280,
          overflowY: 'auto',
          paddingRight: 2
        }}
      >
        {DEALERS_CHOICE_PROMPTS.map((item) => {
          const isSelected = data.selectedPromptId === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() =>
                onChange({ ...data, selectedPromptId: item.id })
              }
              style={{
                textAlign: 'left',
                padding: '11px 12px',
                borderRadius: 16,
                background: isSelected
                  ? 'rgba(47, 122, 94, 0.08)'
                  : 'var(--surface-subtle)',
                border: isSelected
                  ? '1.5px solid var(--accent-sage)'
                  : '1px solid var(--border-hairline)',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 6,
                transition: 'all 0.15s ease'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: isSelected
                      ? 'var(--accent-sage)'
                      : 'var(--accent-rose)'
                  }}
                >
                  {item.hookBadge}
                </span>
                {isSelected && <Check size={13} color="var(--accent-sage)" />}
              </div>

              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: 'var(--ink-primary)'
                }}
              >
                {item.question}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Prompt & Story Cue */}
      <div
        style={{
          background: 'var(--surface-subtle)',
          padding: 13,
          borderRadius: 18,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }}
      >
        <div
          style={{
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--accent-sage)'
          }}
        >
          Selected: “{selectedPrompt.question}”
        </div>
        <input
          type="text"
          className="paper-input"
          value={data.QuickNote}
          onChange={(e) => onChange({ ...data, QuickNote: e.target.value })}
          placeholder="Jot a 3–6 word story cue so you remember what to share..."
          maxLength={80}
        />
      </div>
    </div>
  );
};
