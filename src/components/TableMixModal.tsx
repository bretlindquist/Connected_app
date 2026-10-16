import React from 'react';
import { X, Lock, Shuffle, Check, Sparkles } from 'lucide-react';
import { CardId } from '../types/app';
import { ALL_CARD_IDS, CARDS_VAULT } from '../data/cardsVault';

interface TableMixModalProps {
  isOpen: boolean;
  selectedCards: CardId[];
  onToggleCard: (cardId: CardId) => void;
  onSurpriseDeal: () => void;
  onClose: () => void;
  onApplyAndStart: () => void;
}

export const TableMixModal: React.FC<TableMixModalProps> = ({
  isOpen,
  selectedCards,
  onToggleCard,
  onSurpriseDeal,
  onClose,
  onApplyAndStart
}) => {
  if (!isOpen) return null;

  const totalSprintSeconds = selectedCards.reduce(
    (acc, id) => acc + CARDS_VAULT[id].timerSeconds,
    0
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(30, 22, 26, 0.45)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 480,
          maxHeight: '88dvh',
          background: 'var(--bg-canvas)',
          color: 'var(--ink-primary)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '20px 18px calc(22px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          boxShadow: 'var(--shadow-modal)'
        }}
      >
        {/* Top Handle */}
        <div
          style={{
            width: 40,
            height: 4,
            borderRadius: 999,
            background: 'rgba(30, 22, 26, 0.15)',
            alignSelf: 'center',
            marginBottom: 2
          }}
        />

        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 12
          }}
        >
          <div>
            <span
              className="stamp-badge"
              style={{
                background: 'var(--accent-rose-soft)',
                color: 'var(--accent-rose-deep)',
                marginBottom: 6
              }}
            >
              Custom Table Mix
            </span>
            <h2
              className="font-display"
              style={{
                margin: 0,
                fontSize: '1.4rem',
                fontWeight: 600,
                color: 'var(--ink-primary)'
              }}
            >
              Curate Your Shared Deck
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.84rem',
                color: 'var(--ink-secondary)'
              }}
            >
              Card #1 is always the 60s Napkin Sketch. Pick any combination for the rest of your table!
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--ink-primary)',
              flexShrink: 0
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Summary & Quick Shuffle Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFFFFF',
            padding: '10px 14px',
            borderRadius: 16,
            border: '1px solid var(--border-hairline)',
            boxShadow: 'var(--shadow-pill)'
          }}
        >
          <div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700 }}>
              {selectedCards.length}{' '}
              {selectedCards.length === 1 ? 'Card' : 'Cards'} Selected
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--ink-muted)' }}>
              ~{Math.ceil(totalSprintSeconds / 60)} min creation sprint
            </div>
          </div>
          <button
            type="button"
            onClick={onSurpriseDeal}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              background: 'var(--accent-rose-soft)',
              color: 'var(--accent-rose-deep)',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Shuffle size={13} />
            <span>Deal 4 Surprise Cards</span>
          </button>
        </div>

        {/* Scrollable List of All 11 Cards */}
        <div
          className="hide-scrollbar"
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            paddingRight: 2,
            flex: 1
          }}
        >
          {ALL_CARD_IDS.map((cardId) => {
            const card = CARDS_VAULT[cardId];
            const isLocked = cardId === 'napkin-sketch';
            const isSelected = selectedCards.includes(cardId);

            return (
              <button
                key={cardId}
                type="button"
                onClick={() => {
                  if (!isLocked) onToggleCard(cardId);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left',
                  padding: '12px 14px',
                  borderRadius: 18,
                  background: isSelected
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.55)',
                  border: isSelected
                    ? `1.5px solid ${card.accentColor}`
                    : '1px solid var(--border-hairline)',
                  boxShadow: isSelected ? 'var(--shadow-pill)' : 'none',
                  cursor: isLocked ? 'default' : 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 999,
                    background: isSelected
                      ? card.accentColor
                      : 'var(--surface-subtle)',
                    color: isSelected ? '#FFFFFF' : 'var(--ink-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {isLocked ? (
                    <Lock size={13} />
                  ) : isSelected ? (
                    <Check size={14} strokeWidth={2.5} />
                  ) : (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}
                    >
                      {card.number}
                    </span>
                  )}
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 6
                    }}
                  >
                    <span
                      className="font-display"
                      style={{
                        fontWeight: 600,
                        fontSize: '0.96rem',
                        color: 'var(--ink-primary)'
                      }}
                    >
                      {card.title}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 600,
                        color: card.accentColor,
                        flexShrink: 0
                      }}
                    >
                      {card.timerSeconds}s
                    </span>
                  </div>
                  <p
                    style={{
                      margin: '2px 0 0 0',
                      fontSize: '0.78rem',
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.35
                    }}
                  >
                    {card.subtitle}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Confirm CTA */}
        <button
          type="button"
          onClick={onApplyAndStart}
          className="btn-primary-brass"
          style={{ width: '100%' }}
        >
          <Sparkles size={17} />
          <span>Lock In {selectedCards.length}-Card Table Mix</span>
        </button>
      </div>
    </div>
  );
};
