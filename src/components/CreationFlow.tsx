import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  EyeOff,
  Sparkles,
  Copy,
  Check,
  QrCode,
  Send
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { CardId, PlayerId, PlayerResponses, TableSessionState } from '../types/app';
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
  activePlayer: PlayerId;
  cardIndex: number;
  isHandoffScreen: boolean;
  isTwoPhoneSyncScreen: boolean;
  onUpdatePlayerResponses: (
    player: PlayerId,
    updater: (prev: PlayerResponses) => PlayerResponses
  ) => void;
  onNextCard: () => void;
  onPrevCard: () => void;
  onConfirmHandoffToB: () => void;
  onImportPartnerResponses: (
    partnerName: string,
    responses: PlayerResponses
  ) => void;
  onProceedToReveal: () => void;
  onExitToLobby: () => void;
}

export const CreationFlow: React.FC<CreationFlowProps> = ({
  session,
  activePlayer,
  cardIndex,
  isHandoffScreen,
  isTwoPhoneSyncScreen,
  onUpdatePlayerResponses,
  onNextCard,
  onPrevCard,
  onConfirmHandoffToB,
  onImportPartnerResponses,
  onProceedToReveal,
  onExitToLobby
}) => {
  const [timerPaused, setTimerPaused] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [importError, setImportError] = useState('');
  const [partnerImported, setPartnerImported] = useState(false);

  const playerObj =
    activePlayer === 'playerA' ? session.playerA : session.playerB;
  const partnerObj =
    activePlayer === 'playerA' ? session.playerB : session.playerA;
  const playerName =
    playerObj.name.trim() ||
    (activePlayer === 'playerA' ? 'Person 1' : 'Person 2');
  const partnerName =
    partnerObj.name.trim() ||
    (activePlayer === 'playerA' ? 'Person 2' : 'Person 1');

  // 1. Privacy Handoff Screen (Single-Phone Pass-Across Mode)
  if (isHandoffScreen) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          minHeight: '82dvh',
          padding: '16px 0'
        }}
      >
        <div
          className="paper-card"
          style={{
            padding: '34px 24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: '50%',
              background: 'var(--surface-blush)',
              border: '1.5px solid var(--border-accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-rose)'
            }}
          >
            <EyeOff size={30} />
          </div>

          <span
            className="stamp-badge"
            style={{
              background: 'var(--accent-rose-soft)',
              color: 'var(--accent-rose-deep)'
            }}
          >
            {session.playerA.name || 'Person 1'}’s Cards Are Sealed
          </span>

          <h2
            className="font-display"
            style={{
              margin: 0,
              fontSize: '1.85rem',
              lineHeight: 1.15,
              color: 'var(--ink-primary)'
            }}
          >
            Slide the phone across to{' '}
            <span style={{ color: 'var(--accent-berry)', fontStyle: 'italic' }}>
              {session.playerB.name || 'Person 2'}
            </span>
          </h2>

          <p
            style={{
              margin: 0,
              fontSize: '0.94rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.55,
              maxWidth: 340
            }}
          >
            {session.playerA.name || 'Person 1'}’s sketches and stories are tucked inside the envelope. Now{' '}
            <strong>{session.playerB.name || 'Person 2'}</strong> gets the same{' '}
            {session.activeCardIds.length}{' '}
            {session.activeCardIds.length === 1 ? 'card' : 'cards'} before you reveal everything together!
          </p>

          <button
            type="button"
            onClick={onConfirmHandoffToB}
            className="btn-primary-brass"
            style={{ width: '100%', marginTop: 8 }}
          >
            <Sparkles size={18} />
            <span>
              I’m {session.playerB.name || 'Person 2'} — Deal My Cards
            </span>
          </button>

          <button
            type="button"
            onClick={onProceedToReveal}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--ink-muted)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              padding: '6px 10px'
            }}
          >
            Skip {session.playerB.name || 'Person 2'}’s sprint &amp; reveal right now →
          </button>
        </div>
      </div>
    );
  }

  // 2. Two-Phone Sync Screen
  if (isTwoPhoneSyncScreen) {
    const myDeckCode = encodePartnerDeckCode(
      session.playerA.name || 'Person 1',
      session.playerA.responses
    );
    const fullShareUrl = buildShareableUrlWithSession(session);

    const handleCopyCode = async () => {
      try {
        await navigator.clipboard.writeText(myDeckCode);
        setCopiedCode(true);
        setTimeout(() => setCopiedCode(false), 2500);
      } catch {
        // Fallback ignored
      }
    };

    const handleCopyLink = async () => {
      try {
        await navigator.clipboard.writeText(fullShareUrl);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      } catch {
        // Fallback ignored
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
      onImportPartnerResponses(decoded.playerName, decoded.responses);
      setPartnerImported(true);
    };

    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          padding: '10px 0 36px'
        }}
      >
        <div
          className="paper-card"
          style={{
            padding: '22px 18px',
            display: 'flex',
            flexDirection: 'column',
            gap: 16
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              className="stamp-badge"
              style={{
                background: 'var(--accent-rose-soft)',
                color: 'var(--accent-rose-deep)'
              }}
            >
              <QrCode size={12} /> Two-Phone Table Sync
            </span>
          </div>

          <h2
            className="font-display"
            style={{ margin: 0, fontSize: '1.5rem', lineHeight: 1.2 }}
          >
            Bring Both Decks to One Table
          </h2>
          <p
            style={{
              margin: 0,
              fontSize: '0.86rem',
              color: 'var(--ink-secondary)',
              lineHeight: 1.48
            }}
          >
            Send your deck link to {partnerName}, or paste their sync code below so you can slide one phone into the center and swipe through both decks together.
          </p>

          {/* QR Code & Link Share */}
          <div
            style={{
              background: 'var(--surface-subtle)',
              borderRadius: 20,
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12
            }}
          >
            <div
              style={{
                background: '#FFFFFF',
                padding: 12,
                borderRadius: 16,
                boxShadow: 'var(--shadow-pill)'
              }}
            >
              <QRCodeSVG
                value={fullShareUrl.slice(0, 1800)}
                size={140}
                bgColor="#FFFFFF"
                fgColor="#1E161A"
              />
            </div>

            <div style={{ display: 'flex', gap: 8, width: '100%' }}>
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-paper-pill"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                {copiedLink ? <Check size={14} /> : <Send size={14} />}
                <span>{copiedLink ? 'Link Copied!' : 'Copy Table Link'}</span>
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="btn-paper-pill"
                style={{ flex: 1, fontSize: '0.78rem' }}
              >
                {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedCode ? 'Code Copied!' : 'Copy My Deck Code'}</span>
              </button>
            </div>
          </div>

          {/* Paste Partner Code */}
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 18,
              padding: 14,
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              gap: 8
            }}
          >
            <label
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--ink-secondary)'
              }}
            >
              Have {partnerName}’s Deck Code? Paste to Merge:
            </label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={partnerCodeInput}
                onChange={(e) => setPartnerCodeInput(e.target.value)}
                placeholder="Paste partner sync code..."
                className="paper-input"
                style={{ flex: 1, fontSize: '0.84rem', padding: '9px 12px' }}
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
                Merge
              </button>
            </div>
            {importError && (
              <span
                style={{
                  fontSize: '0.76rem',
                  color: 'var(--accent-rose-deep)',
                  fontWeight: 600
                }}
              >
                {importError}
              </span>
            )}
            {partnerImported && (
              <span
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--accent-sage)',
                  fontWeight: 700
                }}
              >
                ✓ Partner deck merged! Ready to slide &amp; swipe together.
              </span>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 8,
              marginTop: 4
            }}
          >
            <button
              type="button"
              onClick={onProceedToReveal}
              className="btn-primary-brass"
              style={{ width: '100%' }}
            >
              <Sparkles size={17} />
              <span>Open Shared Reveal Deck →</span>
            </button>

            <button
              type="button"
              onClick={onConfirmHandoffToB}
              className="btn-paper-pill"
              style={{ width: '100%' }}
            >
              Or pass THIS phone to {partnerName} instead
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Standard Card Creation Sprint
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onPauseTimer={setTimerPaused}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            data={resp['two-brains']}
            playerName={playerName}
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            partnerName={partnerName}
            onChange={(val) =>
              onUpdatePlayerResponses(activePlayer, (prev) => ({
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
            background:
              activePlayer === 'playerA'
                ? 'var(--surface-blush)'
                : 'var(--surface-berry-tint)',
            border:
              activePlayer === 'playerA'
                ? '1px solid rgba(224, 90, 71, 0.25)'
                : '1px solid rgba(110, 46, 83, 0.22)'
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background:
                activePlayer === 'playerA'
                  ? 'var(--accent-rose)'
                  : 'var(--accent-berry)'
            }}
          />
          <span
            style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--ink-primary)'
            }}
          >
            {playerName}’s Turn
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
          cardKey={`${activePlayer}-${currentCardId}`}
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
            {isLastCard
              ? activePlayer === 'playerA'
                ? 'Seal My Cards'
                : 'Slide Phone to Center & Reveal!'
              : 'Lock In & Next Card'}
          </span>
          {isLastCard ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
        </button>
      </div>
    </div>
  );
};
