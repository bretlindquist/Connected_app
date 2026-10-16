import React from 'react';
import { X, Play, Plus, Check, Sparkles } from 'lucide-react';
import { CardId } from '../types/app';
import { ALL_CARD_IDS, CARDS_VAULT } from '../data/cardsVault';

interface VaultDrawerProps {
  isOpen: boolean;
  activeCardIds: CardId[];
  onClose: () => void;
  onPlaySingleCardNow: (cardId: CardId) => void;
  onToggleCardInDeck: (cardId: CardId) => void;
}

export const VaultDrawer: React.FC<VaultDrawerProps> = ({
  isOpen,
  activeCardIds,
  onClose,
  onPlaySingleCardNow,
  onToggleCardInDeck
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 85,
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
          maxHeight: '90dvh',
          background: 'var(--bg-canvas)',
          color: 'var(--ink-primary)',
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '20px 18px calc(24px + env(safe-area-inset-bottom, 0px))',
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
              <Sparkles size={11} />
              All 11 Interactive Cards
            </span>
            <h2
              className="font-display"
              style={{ margin: 0, fontSize: '1.4rem', fontWeight: 600 }}
            >
              The Connection Vault
            </h2>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '0.84rem',
                color: 'var(--ink-secondary)'
              }}
            >
              Launch any single card on the spot, or add it into your active deck.
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

        {/* All 11 Cards List */}
        <div
          className="hide-scrollbar"
          style={{
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            flex: 1
          }}
        >
          {ALL_CARD_IDS.map((cardId) => {
            const card = CARDS_VAULT[cardId];
            const inDeck = activeCardIds.includes(cardId);

            return (
              <div
                key={cardId}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 20,
                  padding: '15px 16px',
                  border: '1px solid var(--border-hairline)',
                  boxShadow: 'var(--shadow-pill)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 8
                  }}
                >
                  <span
                    className="stamp-badge"
                    style={{
                      background: `${card.accentColor}15`,
                      color: card.accentColor
                    }}
                  >
                    Card #{card.number} · {card.badge}
                  </span>
                  <span
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      color: 'var(--ink-muted)'
                    }}
                  >
                    {card.timerSeconds}s sprint
                  </span>
                </div>

                <div>
                  <h3
                    className="font-display"
                    style={{
                      margin: '0 0 4px 0',
                      fontSize: '1.08rem',
                      fontWeight: 600,
                      color: 'var(--ink-primary)'
                    }}
                  >
                    {card.title}
                  </h3>
                  <p
                    style={{
                      margin: 0,
                      fontSize: '0.83rem',
                      color: 'var(--ink-secondary)',
                      lineHeight: 1.42
                    }}
                  >
                    {card.subtitle}
                  </p>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 2 }}>
                  <button
                    type="button"
                    onClick={() => onPlaySingleCardNow(cardId)}
                    style={{
                      flex: 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      padding: '10px 14px',
                      borderRadius: 999,
                      border: 'none',
                      background: 'var(--accent-rose)',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Play size={13} fill="currentColor" />
                    <span>Play Just This Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleCardInDeck(cardId)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 5,
                      padding: '10px 14px',
                      borderRadius: 999,
                      border: inDeck
                        ? '1.5px solid var(--accent-sage)'
                        : '1px solid var(--border-subtle)',
                      background: inDeck
                        ? 'rgba(47, 122, 94, 0.1)'
                        : 'var(--surface-subtle)',
                      color: inDeck
                        ? 'var(--accent-sage)'
                        : 'var(--ink-primary)',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {inDeck ? <Check size={14} /> : <Plus size={14} />}
                    <span>{inDeck ? 'In Deck' : 'Add to Mix'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
