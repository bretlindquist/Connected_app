import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Copy,
  Check,
  QrCode,
  Send,
  UserPlus,
  Users,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CardId, PlayerResponses, TableSessionState } from '../types/app';
import { CARDS_VAULT } from '../data/cardsVault';
import { TimerBar } from './TimerBar';
import {
  encodePartnerDeckCode,
  decodePartnerDeckCode,
  buildShareableUrlWithSession
} from '../utils/shareCodec';

import { Card01NapkinSketch } from './cards/Card01NapkinSketch';
import { Card02CameraRoll } from './cards/Card02CameraRoll';
import { Card03DropPin } from './cards/Card03DropPin';
import { Card04MemoriesDaydream } from './cards/Card04MemoriesDaydream';
import { Card05GutRead } from './cards/Card05GutRead';
import { Card06Soundtrack } from './cards/Card06Soundtrack';
import { Card07EmojiPitch } from './cards/Card07EmojiPitch';
import { Card08BrainPie } from './cards/Card08BrainPie';
import { Card09SpicyHill } from './cards/Card09SpicyHill';
import { Card10TwoBrains } from './cards/Card10TwoBrains';
import { Card11DealersChoice } from './cards/Card11DealersChoice';

interface CreationFlowProps {
  session: TableSessionState;
  activePlayerIndex: number;
  cardIndex: number;
  isReadyToShareScreen: boolean;
  onUpdatePlayerResponses: (
    playerIndex: number,
    updater: (prev: PlayerResponses) => PlayerResponses
  ) => void;
  onChangeSharedTwoBrainsPrompt: (prompt: string) => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onAddAnotherPlayerOnSamePhone: (newPlayerName: string) => void;
  onImportExternalPlayerResponses: (
    importedName: string,
    responses: PlayerResponses
  ) => void;
  onProceedToReveal: () => void;
  onExitToLobby: () => void;
}

const PLAYER_BADGE_COLORS = [
  {
    bg: 'var(--surface-blush)',
    border: 'rgba(224, 90, 71, 0.25)',
    dot: 'var(--accent-rose)'
  },
  {
    bg: 'var(--surface-berry-tint)',
    border: 'rgba(110, 46, 83, 0.22)',
    dot: 'var(--accent-berry)'
  },
  {
    bg: 'rgba(46, 109, 90, 0.1)',
    border: 'rgba(46, 109, 90, 0.24)',
    dot: 'var(--accent-sage)'
  },
  {
    bg: 'rgba(59, 91, 153, 0.1)',
    border: 'rgba(59, 91, 153, 0.24)',
    dot: 'var(--accent-cobalt)'
  }
];

export const CreationFlow: React.FC<CreationFlowProps> = ({
  session,
  activePlayerIndex,
  cardIndex,
  isReadyToShareScreen,
  onUpdatePlayerResponses,
  onChangeSharedTwoBrainsPrompt,
  onNextCard,
  onPrevCard,
  onAddAnotherPlayerOnSamePhone,
  onImportExternalPlayerResponses,
  onProceedToReveal,
  onExitToLobby
}) => {
  const [timerPaused, setTimerPaused] = useState(false);
  const [nextPlayerName, setNextPlayerName] = useState('');
  const [showAddPlayerInput, setShowAddPlayerInput] = useState(false);
  const [showTableQrTools, setShowTableQrTools] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [importError, setImportError] = useState('');
  const [partnerImportedName, setPartnerImportedName] = useState('');

  const playerObj = session.players[activePlayerIndex] || session.players[0];
  const playerName =
    playerObj?.name?.trim() ||
    (activePlayerIndex === 0 ? 'You' : `Person ${activePlayerIndex + 1}`);
  const badgeStyle =
    PLAYER_BADGE_COLORS[activePlayerIndex % PLAYER_BADGE_COLORS.length];

  // 1. Ready-to-Share / Pass-the-Phone Table Hub
  if (isReadyToShareScreen) {
    const ownerPlayer = session.players[0];
    const myDeckCode = encodePartnerDeckCode(
      ownerPlayer?.name?.trim() || 'Player 1',
      ownerPlayer.responses
    );
    const fullShareUrl = buildShareableUrlWithSession(session);

    const handleCopyCode = async () => {
      try {
        await navigator.clipboard.writeText(myDeckCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      } catch {
        // Ignore clipboard errors
      }
    };

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(fullShareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // Ignore clipboard errors
      }
    };

    const handleMergeCode = () => {
      setImportError('');
      const decoded = decodePartnerDeckCode(partnerCodeInput);
      if (!decoded) {
        setImportError(
          'Could not read that sync code. Make sure you copied the full code.'
        );
        return;
      }
      onImportExternalPlayerResponses(decoded.playerName, decoded.responses);
      setPartnerImportedName(decoded.playerName);
      setPartnerCodeInput('');
    };

    const handleStartNextPerson = () => {
      const nameToUse =
        nextPlayerName.trim() || `Person ${session.players.length + 1}`;
      setNextPlayerName('');
      setShowAddPlayerInput(false);
      onAddAnotherPlayerOnSamePhone(nameToUse);
    };

    const allNamesLabel = session.players
      .map((p, idx) => p.name.trim() || (idx === 0 ? 'You' : `Person ${idx + 1}`))
      .join(' · ');

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '80dvh',
          padding: '14px 0 32px'
        }}
      >
        <div
          className="paper-card"
          style={{
            padding: '28px 22px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--surface-blush)',
              border: '1.5px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}
          >
            <Sparkles size={28} />
          </div>

          <span
            className="stamp-badge"
            style={{
              background: 'var(--accent-rose-soft)',
              color: 'var(--accent-rose-deep)'
            }}
          >
            {session.players.length === 1
              ? `${playerName}’s Deck Is Ready`
              : `${session.players.length} Decks Sealed on This Phone`}
          </span>

          <h2
            className="font-display"
            style={{
              margin: 0,
              fontSize: '1.8rem',
              lineHeight: 1.15,
              color: 'var(--ink-primary)'
            }}
          >
            Ready for the{' '}
            <span style={{ color: 'var(--accent-rose)', fontStyle: 'italic' }}>
              table reveal!
            </span>
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: '0.92rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.5,
              maxWidth: 360
            }}
          >
            {session.players.length === 1
              ? 'If everyone at the table is playing on their own phone, slide your phones out and take turns swiping through your cards one by one!'
              : `Locked in on this phone: ${allNamesLabel}. Ready to reveal everyone’s cards together, or pass the phone to one more person?`}
          </p>

          {/* Primary Action: Open Reveal Deck Immediately */}
          <button
            type="button"
            onClick={onProceedToReveal}
            className="btn-primary-brass"
            style={{ width: '100%', marginTop: 4 }}
          >
            <Sparkles size={18} />
            <span>Slide Phone Out &amp; Swipe Through →</span>
          </button>

          {/* Secondary Action: Someone Else Sharing This Phone? */}
          <div
            style={{
              width: '100%',
              background: 'var(--surface-subtle)',
              borderRadius: 18,
              padding: 14,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              textAlign: 'left'
            }}
          >
            {!showAddPlayerInput ? (
              <button
                type="button"
                onClick={() => setShowAddPlayerInput(true)}
                className="btn-paper-pill"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '11px 14px',
                  fontSize: '0.84rem'
                }}
              >
                <UserPlus size={15} color="var(--accent-berry)" />
                <span>
                  Sharing this phone? Pass to Person #{session.players.length + 1}
                </span>
              </button>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <label
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-berry)'
                  }}
                >
                  Next Person’s Name (Person #{session.players.length + 1})
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="text"
                    value={nextPlayerName}
                    onChange={(e) => setNextPlayerName(e.target.value)}
                    placeholder={`e.g., Jordan, Taylor...`}
                    className="paper-input"
                    style={{ flex: 1, fontSize: '0.9rem', padding: '10px 14px' }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleStartNextPerson}
                    className="btn-paper-pill"
                    style={{
                      background: 'var(--accent-berry)',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '10px 16px',
                      flexShrink: 0
                    }}
                  >
                    Start Turn →
                  </button>
                </div>
              </div>
            )}

            {session.players.length > 1 && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  paddingTop: 2
                }}
              >
                <Users size={13} color="var(--ink-muted)" />
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--ink-secondary)',
                    fontWeight: 600
                  }}
                >
                  On this phone ({session.players.length}): {allNamesLabel}
                </span>
              </div>
            )}
          </div>

          {/* Optional Table QR / Link / Deck Sync Tools */}
          <div style={{ width: '100%' }}>
            <button
              type="button"
              onClick={() => setShowTableQrTools((prev) => !prev)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--ink-muted)',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '4px 8px'
              }}
            >
              <QrCode size={13} />
              <span>
                {showTableQrTools
                  ? 'Hide QR & Table Sync Tools'
                  : 'Invite table via QR link or merge another phone'}
              </span>
              {showTableQrTools ? (
                <ChevronUp size={13} />
              ) : (
                <ChevronDown size={13} />
              )}
            </button>

            {showTableQrTools && (
              <div
                style={{
                  marginTop: 10,
                  background: 'var(--surface-subtle)',
                  borderRadius: 18,
                  padding: 14,
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 12,
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    background: '#FFFFFF',
                    padding: 10,
                    borderRadius: 14,
                    boxShadow: 'var(--shadow-pill)'
                  }}
                >
                  <QRCodeSVG
                    value={fullShareUrl.slice(0, 1800)}
                    size={124}
                    bgColor="#FFFFFF"
                    fgColor="#1E161A"
                  />
                </div>
                <span
                  style={{
                    fontSize: '0.76rem',
                    color: 'var(--ink-secondary)',
                    textAlign: 'center'
                  }}
                >
                  Anyone at the table can scan to open this exact card pack on their own phone.
                </span>

                <div style={{ display: 'flex', gap: 8, width: '100%' }}>
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="btn-paper-pill"
                    style={{ flex: 1, fontSize: '0.76rem' }}
                  >
                    {copiedLink ? <Check size={13} /> : <Send size={13} />}
                    <span>{copiedLink ? 'Link Copied!' : 'Copy Pack Link'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="btn-paper-pill"
                    style={{ flex: 1, fontSize: '0.76rem' }}
                  >
                    {copiedCode ? <Check size={13} /> : <Copy size={13} />}
                    <span>{copiedCode ? 'Code Copied!' : 'Copy My Deck Code'}</span>
                  </button>
                </div>

                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 6,
                    paddingTop: 6,
                    borderTop: '1px solid var(--border-subtle)'
                  }}
                >
                  <label
                    style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      color: 'var(--ink-secondary)'
                    }}
                  >
                    Optional — Paste someone’s Deck Code to combine on this phone:
                  </label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <input
                      type="text"
                      value={partnerCodeInput}
                      onChange={(e) => setPartnerCodeInput(e.target.value)}
                      placeholder="Paste deck code..."
                      className="paper-input"
                      style={{ flex: 1, fontSize: '0.82rem', padding: '8px 12px' }}
                    />
                    <button
                      type="button"
                      onClick={handleMergeCode}
                      className="btn-paper-pill"
                      style={{
                        background: 'var(--ink-primary)',
                        color: '#FFFFFF',
                        flexShrink: 0
                      }}
                    >
                      Add
                    </button>
                  </div>
                  {importError && (
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--accent-rose-deep)',
                        fontWeight: 600
                      }}
                    >
                      {importError}
                    </span>
                  )}
                  {partnerImportedName && (
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--accent-sage)',
                        fontWeight: 700
                      }}
                    >
                      ✓ Added {partnerImportedName}’s deck to this phone!
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 2. Standard Card Creation Sprint
  const currentCardId: CardId =
    session.activeCardIds[cardIndex] || 'napkin-sketch';
  const cardMeta = CARDS_VAULT[currentCardId];
  const totalCards = session.activeCardIds.length;
  const isLastCard = cardIndex === totalCards - 1;

  const renderCardBody = () => {
    const resp = playerObj.responses;
    switch (currentCardId) {
      case 'napkin-sketch':
        return (
          <Card01NapkinSketch
            mode="create"
            data={resp['napkin-sketch']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'napkin-sketch': val
              }))
            }
          />
        );
      case 'camera-roll':
        return (
          <Card02CameraRoll
            mode="create"
            data={resp['camera-roll']}
            playerName={playerName}
            onPauseTimer={setTimerPaused}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'camera-roll': val
              }))
            }
          />
        );
      case 'drop-pin':
        return (
          <Card03DropPin
            mode="create"
            data={resp['drop-pin']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'drop-pin': val
              }))
            }
          />
        );
      case 'memories-daydream':
        return (
          <Card04MemoriesDaydream
            mode="create"
            data={resp['memories-daydream']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'memories-daydream': val
              }))
            }
          />
        );
      case 'gut-read':
        return (
          <Card05GutRead
            mode="create"
            data={resp['gut-read']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'gut-read': val
              }))
            }
          />
        );
      case 'soundtrack':
        return (
          <Card06Soundtrack
            mode="create"
            data={resp.soundtrack}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                soundtrack: val
              }))
            }
          />
        );
      case 'emoji-pitch':
        return (
          <Card07EmojiPitch
            mode="create"
            data={resp['emoji-pitch']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'emoji-pitch': val
              }))
            }
          />
        );
      case 'brain-pie':
        return (
          <Card08BrainPie
            mode="create"
            data={resp['brain-pie']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'brain-pie': val
              }))
            }
          />
        );
      case 'spicy-hill':
        return (
          <Card09SpicyHill
            mode="create"
            data={resp['spicy-hill']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'spicy-hill': val
              }))
            }
          />
        );
      case 'two-brains':
        return (
          <Card10TwoBrains
            mode="create"
            sharedPrompt={session.sharedTwoBrainsPrompt}
            onChangeSharedPrompt={onChangeSharedTwoBrainsPrompt}
            data={resp['two-brains']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'two-brains': val
              }))
            }
          />
        );
      case 'dealers-choice':
        return (
          <Card11DealersChoice
            mode="create"
            data={resp['dealers-choice']}
            playerName={playerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayerIndex, (prev) => ({
                ...prev,
                'dealers-choice': val
              }))
            }
          />
        );
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        paddingBottom: 24,
        paddingTop: 4
      }}
    >
      {/* Top Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8
        }}
      >
        <button
          type="button"
          onClick={onExitToLobby}
          className="btn-ghost-candle"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <ArrowLeft size={14} />
          <span>Lobby</span>
        </button>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 14px',
            borderRadius: 999,
            background: badgeStyle.bg,
            border: `1px solid ${badgeStyle.border}`
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: badgeStyle.dot
            }}
          />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--ink-primary)'
            }}
          >
            {playerName === 'You' ? 'Your Turn' : `${playerName}’s Turn`}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              color: 'var(--ink-muted)',
              fontWeight: 600
            }}
          >
            · {cardIndex + 1}/{totalCards}
          </span>
        </div>
      </div>

      {/* Main Ivory Editorial Card */}
      <div className="paper-card" style={{ padding: '20px 18px' }}>
        <TimerBar
          totalSeconds={cardMeta.timerSeconds}
          cardKey={`player-${activePlayerIndex}-${currentCardId}`}
          isPaused={timerPaused}
          badgeText={cardMeta.badge}
          accentColor={cardMeta.accentColor}
        />

        <div style={{ marginBottom: 14 }}>
          <h2
            className="font-display"
            style={{
              margin: '0 0 4px 0',
              fontSize: '1.35rem',
              lineHeight: 1.18,
              color: 'var(--ink-primary)'
            }}
          >
            {cardMeta.title}
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.84rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.42
            }}
          >
            {cardMeta.creationInstruction}
          </p>
        </div>

        {/* Dynamic Card Content */}
        {renderCardBody()}
      </div>

      {/* Bottom Navigation Controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        {cardIndex > 0 && (
          <button
            type="button"
            onClick={onPrevCard}
            className="btn-ghost-candle"
            style={{ padding: '14px 18px' }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
        )}

        <button
          type="button"
          onClick={onNextCard}
          className="btn-primary-brass"
          style={{ flex: 1 }}
        >
          <span>
            {isLastCard ? 'Finish My Cards →' : 'Lock In & Next Card'}
          </span>
          {isLastCard ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};
