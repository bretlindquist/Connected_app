import React from 'react';
import {
  Sparkles,
  Shuffle,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  Clock,
  Check,
  Users
} from 'lucide-react';
import { CardId, ExperiencePackId } from '../types/app';
import { CARDS_VAULT, EXPERIENCE_PACKS } from '../data/cardsVault';

interface LobbyScreenProps {
  ownerName: string;
  onChangeOwnerName: (val: string) => void;
  selectedPackId: ExperiencePackId;
  activeCardIds: CardId[];
  onSelectPack: (packId: ExperiencePackId) => void;
  onOpenMixModal: () => void;
  onOpenVaultDrawer: () => void;
  onSurpriseShuffle: () => void;
  onStartSession: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({
  ownerName,
  onChangeOwnerName,
  selectedPackId,
  activeCardIds,
  onSelectPack,
  onOpenMixModal,
  onOpenVaultDrawer,
  onSurpriseShuffle,
  onStartSession
}) => {
  const selectedPack =
    EXPERIENCE_PACKS.find((p) => p.id === selectedPackId) || EXPERIENCE_PACKS[2];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        paddingBottom: 112,
        paddingTop: 6
      }}
    >
      {/* Top Bar: Brand Pill + All 11 Cards Drawer Trigger */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '6px 12px',
            borderRadius: 999,
            background: 'var(--accent-rose-soft)',
            color: 'var(--accent-rose-deep)',
            fontSize: '0.76rem',
            fontWeight: 700,
            letterSpacing: '0.02em'
          }}
        >
          <Users size={13} />
          <span>Connected · Around the Table</span>
        </div>

        <button
          type="button"
          onClick={onOpenVaultDrawer}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '7px 13px',
            borderRadius: 999,
            background: '#FFFFFF',
            border: '1px solid var(--border-subtle)',
            color: 'var(--ink-primary)',
            fontSize: '0.78rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: 'var(--shadow-pill)'
          }}
        >
          <Layers size={13} color="var(--accent-rose)" />
          <span>All 11 Cards</span>
        </button>
      </header>

      {/* Editorial Hero Section */}
      <section style={{ padding: '2px 2px 0' }}>
        <h1
          className="font-display"
          style={{
            fontSize: 'clamp(2.05rem, 6.5vw, 2.55rem)',
            lineHeight: 1.08,
            margin: '0 0 10px 0',
            color: 'var(--ink-primary)',
            fontWeight: 600,
            letterSpacing: '-0.025em'
          }}
        >
          Pull up a chair.{' '}
          <span
            style={{
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'var(--accent-rose)'
            }}
          >
            Skip the small talk.
          </span>
        </h1>
        <p
          style={{
            margin: 0,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            color: 'var(--ink-secondary)',
            maxWidth: 450
          }}
        >
          Draw terrible 60-second sketches, pull unhinged camera-roll stories, and slide your phone out to the table—built for a first date, old friends, or a big group.
        </p>
      </section>

      {/* Single Phone-Owner Name Card */}
      <section
        style={{
          background: 'var(--surface-card)',
          borderRadius: 22,
          padding: 16,
          border: '1px solid var(--border-hairline)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 8
          }}
        >
          <label
            htmlFor="phone-owner-name-input"
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--ink-secondary)',
              letterSpacing: '0.02em'
            }}
          >
            Your Name (Phone Owner)
          </label>
          <span
            style={{
              fontSize: '0.72rem',
              color: 'var(--ink-muted)',
              fontWeight: 500
            }}
          >
            Only you need to enter your name
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--surface-subtle)',
            borderRadius: 14,
            padding: '11px 14px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background: 'var(--accent-rose)',
              flexShrink: 0
            }}
          />
          <input
            id="phone-owner-name-input"
            type="text"
            value={ownerName}
            onChange={(e) => onChangeOwnerName(e.target.value)}
            placeholder="Your first name (e.g., Alex)"
            maxLength={22}
            style={{
              width: '100%',
              border: 'none',
              background: 'transparent',
              color: 'var(--ink-primary)',
              fontSize: '0.96rem',
              fontWeight: 600,
              outline: 'none'
            }}
          />
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '0.76rem',
            lineHeight: 1.4,
            color: 'var(--ink-muted)'
          }}
        >
          Everyone at the table can play on their own phone and slide them out to compare—or you can pass this phone around after your turn.
        </p>
      </section>

      {/* Experience Packs Section (Progressive Disclosure Accordion) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0 4px'
          }}
        >
          <span
            style={{
              fontSize: '0.8rem',
              fontWeight: 700,
              color: 'var(--ink-secondary)'
            }}
          >
            Choose your table experience
          </span>
          <button
            type="button"
            onClick={onSurpriseShuffle}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-rose)',
              fontSize: '0.78rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              cursor: 'pointer',
              padding: 0
            }}
          >
            <Shuffle size={13} />
            <span>Surprise Us</span>
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EXPERIENCE_PACKS.map((pack) => {
            const isSelected = selectedPackId === pack.id;
            const packCards =
              isSelected && pack.isCustomMix ? activeCardIds : pack.defaultCardIds;

            return (
              <div
                key={pack.id}
                onClick={() => onSelectPack(pack.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectPack(pack.id);
                  }
                }}
                style={{
                  textAlign: 'left',
                  background: isSelected
                    ? '#FFFFFF'
                    : 'rgba(255, 255, 255, 0.72)',
                  color: 'var(--ink-primary)',
                  borderRadius: 22,
                  padding: isSelected ? '18px' : '14px 16px',
                  border: isSelected
                    ? '1.5px solid var(--accent-rose)'
                    : '1px solid var(--border-hairline)',
                  boxShadow: isSelected
                    ? '0 14px 34px -8px rgba(224, 90, 71, 0.14), 0 4px 12px rgba(30, 22, 26, 0.04)'
                    : '0 2px 8px rgba(30, 22, 26, 0.03)',
                  cursor: 'pointer',
                  transition: 'all 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
                  position: 'relative'
                }}
              >
                {/* Header Row: Radio Indicator + Title + Right Pill */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 10
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      minWidth: 0
                    }}
                  >
                    {/* Radio Selection Circle */}
                    <div
                      style={{
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        border: isSelected
                          ? 'none'
                          : '1.5px solid rgba(30, 22, 26, 0.22)',
                        background: isSelected
                          ? 'var(--accent-rose)'
                          : 'transparent',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isSelected && <Check size={13} strokeWidth={3} />}
                    </div>

                    <div style={{ minWidth: 0 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 8,
                          flexWrap: 'wrap'
                        }}
                      >
                        <h3
                          className="font-display"
                          style={{
                            margin: 0,
                            fontSize: isSelected ? '1.18rem' : '1.04rem',
                            fontWeight: 600,
                            color: 'var(--ink-primary)'
                          }}
                        >
                          {pack.title}
                        </h3>
                        {pack.featured && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: 999,
                              background: 'var(--accent-rose-soft)',
                              color: 'var(--accent-rose-deep)'
                            }}
                          >
                            Table Favorite
                          </span>
                        )}
                      </div>

                      {!isSelected && (
                        <p
                          style={{
                            margin: '2px 0 0 0',
                            fontSize: '0.8rem',
                            color: 'var(--ink-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {pack.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Compact Meta Pill */}
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      padding: '5px 10px',
                      borderRadius: 999,
                      background: isSelected
                        ? 'var(--surface-blush)'
                        : 'var(--surface-subtle)',
                      color: isSelected
                        ? 'var(--accent-rose-deep)'
                        : 'var(--ink-secondary)',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      flexShrink: 0
                    }}
                  >
                    <span>
                      {pack.isCustomMix && isSelected
                        ? `${activeCardIds.length} Cards`
                        : pack.cardCountLabel}
                    </span>
                  </div>
                </div>

                {/* Expanded Body ONLY for Selected Pack */}
                {isSelected && (
                  <div
                    style={{
                      marginTop: 12,
                      paddingTop: 12,
                      borderTop: '1px solid var(--border-hairline)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 12
                    }}
                  >
                    <p
                      style={{
                        margin: 0,
                        fontSize: '0.86rem',
                        lineHeight: 1.48,
                        color: 'var(--ink-secondary)'
                      }}
                    >
                      {pack.description}
                    </p>

                    {/* Time & Conversation Meta Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        fontSize: '0.76rem',
                        color: 'var(--ink-muted)',
                        fontWeight: 600
                      }}
                    >
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}
                      >
                        <Clock size={12} color="var(--accent-rose)" />
                        {pack.sprintTimeLabel}
                      </span>
                      <span>•</span>
                      <span>{pack.convoTimeLabel}</span>
                    </div>

                    {/* Card Sequence Pills */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 6
                      }}
                    >
                      {packCards.map((cId, idx) => {
                        const cardMeta = CARDS_VAULT[cId];
                        return (
                          <span
                            key={`${pack.id}-${cId}-${idx}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 6,
                              fontSize: '0.76rem',
                              fontWeight: 600,
                              padding: '5px 11px',
                              borderRadius: 999,
                              background: 'var(--surface-subtle)',
                              color: 'var(--ink-primary)'
                            }}
                          >
                            <span
                              style={{
                                width: 7,
                                height: 7,
                                borderRadius: '50%',
                                background: cardMeta.accentColor
                              }}
                            />
                            <span>
                              {idx + 1}. {cardMeta.shortTitle}
                            </span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Custom Mix Controls if Pack 5 */}
                    {pack.isCustomMix && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 8,
                          paddingTop: 2
                        }}
                      >
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenMixModal();
                          }}
                          className="btn-paper-pill"
                          style={{
                            flex: 1,
                            padding: '9px 14px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <SlidersHorizontal size={14} />
                          <span>Choose Cards ({activeCardIds.length})</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSurpriseShuffle();
                          }}
                          className="btn-paper-pill"
                          style={{
                            padding: '9px 14px',
                            fontSize: '0.8rem'
                          }}
                        >
                          <Shuffle size={14} />
                          <span>Shuffle 4</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky Launch Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 40,
          background:
            'linear-gradient(to top, rgba(250, 246, 240, 0.98) 70%, rgba(250, 246, 240, 0))',
          backdropFilter: 'blur(10px)',
          padding: '14px 16px calc(14px + env(safe-area-inset-bottom, 0px))',
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 460,
            display: 'flex',
            gap: 10,
            alignItems: 'center'
          }}
        >
          <button
            type="button"
            onClick={onOpenMixModal}
            aria-label="Customize card lineup"
            style={{
              height: 52,
              padding: '0 16px',
              borderRadius: 999,
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              color: 'var(--ink-primary)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-pill)',
              flexShrink: 0
            }}
          >
            <SlidersHorizontal size={16} color="var(--accent-rose)" />
            <span>Mix</span>
          </button>

          <button
            type="button"
            onClick={onStartSession}
            className="btn-primary-brass"
            style={{
              flex: 1,
              height: 52,
              fontSize: '0.96rem',
              padding: '0 22px'
            }}
          >
            <Sparkles size={17} />
            <span>
              Start {selectedPack.title.replace(/^The\s+/i, '')} (
              {activeCardIds.length}{' '}
              {activeCardIds.length === 1 ? 'Card' : 'Cards'})
            </span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};
