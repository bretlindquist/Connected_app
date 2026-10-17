import React, { useState } from 'react';
import { Eye, Sparkles } from 'lucide-react';
import { EmojiPitchData } from '../../types/app';

interface Card07Props {
  mode: 'create' | 'reveal';
  data: EmojiPitchData;
  playerName: string;
  partnerName?: string;
  onChange: (updated: EmojiPitchData) => void;
}

const CURATED_EMOJI_PALETTE = [
  '✈️', '🍷', '🌧️', '🏕️', '🚓', '🍕', '🎸', '🐕',
  '🌊', '🏔️', '🔑', '🌶️', '🎭', '🚤', '🕯️', '🪩',
  '🧳', '🍜', '🎨', '🚲', '⚡', '🦊', '🏖️', '🎷',
  '🛸', '☕', '🎢', '📸', '🌮', '🔥', '🛶', '🌙'
];

const QUICK_COMBOS: Array<{
  emojis: [string, string, string];
  title: string;
}> = [
  {
    emojis: ['✈️', '🧳', '🍜'],
    title: 'Lost luggage, best street food of my life'
  },
  {
    emojis: ['🏕️', '🌧️', '🍷'],
    title: 'Camping trip rained out into a cozy cabin night'
  },
  {
    emojis: ['🚲', '🥖', '🌅'],
    title: 'My 10/10 Saturday morning ritual'
  }
];

export const Card07EmojiPitch: React.FC<Card07Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const [activeSlot, setActiveSlot] = useState<0 | 1 | 2>(0);
  const [flipped, setFlipped] = useState(false);

  const handleSelectEmoji = (emoji: string) => {
    const next: [string, string, string] = [...data.emojis] as [
      string,
      string,
      string
    ];
    next[activeSlot] = emoji;
    onChange({ ...data, emojis: next });
    setActiveSlot(((activeSlot + 1) % 3) as 0 | 1 | 2);
  };

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Coaster Display */}
        <div
          style={{
            background: 'var(--bg-canvas)',
            borderRadius: 24,
            padding: '24px 18px',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-pill)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}
        >
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-champagne)'
            }}
          >
            {playerName}’s 3-Emoji Coaster Pitch
          </span>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: 14
            }}
          >
            {data.emojis.map((em, i) => (
              <div
                key={i}
                style={{
                  width: 74,
                  height: 74,
                  borderRadius: 20,
                  background: '#FFFFFF',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '2.45rem',
                  boxShadow: '0 6px 16px rgba(30, 22, 26, 0.06)'
                }}
              >
                {em}
              </div>
            ))}
          </div>

          {!flipped ? (
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="btn-paper-pill"
              style={{
                width: '100%',
                background: '#FFFFFF',
                border: '1.5px solid var(--border-accent)',
                color: 'var(--accent-rose-deep)'
              }}
            >
              <Eye size={15} />
              <span>
                Let the table guess the plot · Tap to flip coaster
              </span>
            </button>
          ) : (
            <div
              style={{
                width: '100%',
                background: '#FFFFFF',
                borderRadius: 18,
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
                The Real Story Headline
              </div>
              <div
                className="font-hand"
                style={{
                  fontSize: '1.45rem',
                  color: 'var(--ink-primary)',
                  marginTop: 4
                }}
              >
                “{data.storyTitle || 'Ask me what happened!'}”
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* 3 Emoji Slots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          padding: '14px 10px',
          background: 'var(--surface-subtle)',
          borderRadius: 20
        }}
      >
        {([0, 1, 2] as const).map((slotIdx) => {
          const isSelected = activeSlot === slotIdx;
          return (
            <button
              key={slotIdx}
              type="button"
              onClick={() => setActiveSlot(slotIdx)}
              style={{
                width: 72,
                height: 72,
                borderRadius: 20,
                background: '#FFFFFF',
                border: isSelected
                  ? '2px solid var(--accent-rose)'
                  : '1px solid var(--border-subtle)',
                boxShadow: isSelected
                  ? '0 0 0 3px rgba(224, 90, 71, 0.16)'
                  : 'var(--shadow-pill)',
                fontSize: '2.2rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{data.emojis[slotIdx]}</span>
              <span
                style={{
                  position: 'absolute',
                  bottom: 4,
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  color: isSelected
                    ? 'var(--accent-rose)'
                    : 'var(--ink-muted)'
                }}
              >
                #{slotIdx + 1}
              </span>
            </button>
          );
        })}
      </div>

      {/* Emoji Picker Grid */}
      <div>
        <div
          style={{
            fontSize: '0.73rem',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            marginBottom: 6
          }}
        >
          Tap an emoji for Slot #{activeSlot + 1}:
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(8, 1fr)',
            gap: 6,
            background: 'var(--surface-subtle)',
            padding: 10,
            borderRadius: 18
          }}
        >
          {CURATED_EMOJI_PALETTE.map((em) => (
            <button
              key={em}
              type="button"
              onClick={() => handleSelectEmoji(em)}
              style={{
                fontSize: '1.4rem',
                padding: '6px 0',
                borderRadius: 10,
                border: 'none',
                background: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {em}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Combo Starters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {QUICK_COMBOS.map((c, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() =>
              onChange({ emojis: c.emojis, storyTitle: c.title })
            }
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              border: '1px solid var(--border-subtle)',
              background: '#FFFFFF',
              fontSize: '0.73rem',
              fontWeight: 600,
              cursor: 'pointer',
              color: 'var(--ink-primary)'
            }}
          >
            <Sparkles
              size={11}
              color="var(--accent-rose)"
              style={{ marginRight: 4, display: 'inline' }}
            />
            {c.emojis.join('')} {c.title.slice(0, 22)}...
          </button>
        ))}
      </div>

      <input
        type="text"
        className="paper-input"
        value={data.storyTitle}
        onChange={(e) => onChange({ ...data, storyTitle: e.target.value })}
        placeholder="Secret story title (hidden on the back until they guess)..."
        maxLength={75}
      />
    </div>
  );
};
