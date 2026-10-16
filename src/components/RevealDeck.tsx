import React, { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  Award,
  Repeat,
  MessageCircleHeart
} from 'lucide-react';
import { CardId, PlayerId, PlayerResponses, TableSessionState } from '../types/app';
import { CARDS_VAULT } from '../data/cardsVault';

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

interface RevealDeckProps {
  session: TableSessionState;
  onUpdatePlayerResponses: (
    player: PlayerId,
    updater: (prev: PlayerResponses) => PlayerResponses
  ) => void;
  onOpenVaultDrawer: () => void;
  onFinishToKeepsake: () => void;
  onBackToLobby: () => void;
}

interface RevealSlideItem {
  cardId: CardId;
  owner: PlayerId | 'both';
  stepLabel: string;
}

export const RevealDeck: React.FC<RevealDeckProps> = ({
  session,
  onUpdatePlayerResponses,
  onOpenVaultDrawer,
  onFinishToKeepsake,
  onBackToLobby
}) => {
  const playerAName = session.playerA.name.trim() || 'Person 1';
  const playerBName = session.playerB.name.trim() || 'Person 2';

  const slides: RevealSlideItem[] = [];
  session.activeCardIds.forEach((cardId, idx) => {
    if (cardId === 'two-brains') {
      slides.push({
        cardId,
        owner: 'both',
        stepLabel: `Round ${idx + 1} · Side-by-Side`
      });
    } else {
      slides.push({
        cardId,
        owner: 'playerA',
        stepLabel: `Round ${idx + 1} · ${playerAName}`
      });
      slides.push({
        cardId,
        owner: 'playerB',
        stepLabel: `Round ${idx + 1} · ${playerBName}`
      });
    }
  });

  const [slideIndex, setSlideIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const currentSlide = slides[slideIndex] || slides[0];
  const cardMeta = CARDS_VAULT[currentSlide.cardId];
  const isLastSlide = slideIndex === slides.length - 1;

  const handleNext = () => {
    if (isLastSlide) {
      onFinishToKeepsake();
    } else {
      setSlideIndex((prev) => Math.min(slides.length - 1, prev + 1));
    }
  };

  const handlePrev = () => {
    setSlideIndex((prev) => Math.max(0, prev - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.leaflet-container') || target.closest('input')) {
      return;
    }
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    setTouchStartX(null);
    if (Math.abs(deltaX) > 65) {
      if (deltaX < 0 && slideIndex < slides.length - 1) {
        setSlideIndex((s) => s + 1);
      } else if (deltaX > 0 && slideIndex > 0) {
        setSlideIndex((s) => s - 1);
      }
    }
  };

  const renderSlideArtifact = () => {
    const owner: PlayerId =
      currentSlide.owner === 'playerB' ? 'playerB' : 'playerA';
    const ownerObj = owner === 'playerA' ? session.playerA : session.playerB;
    const ownerName = owner === 'playerA' ? playerAName : playerBName;
    const listenerName = owner === 'playerA' ? playerBName : playerAName;
    const resp = ownerObj.responses;

    switch (currentSlide.cardId) {
      case 'napkin-sketch':
        return (
          <Card01NapkinSketch
            mode="reveal"
            data={resp['napkin-sketch']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'napkin-sketch': val
              }))
            }
          />
        );
      case 'camera-roll':
        return (
          <Card02CameraRoll
            mode="reveal"
            data={resp['camera-roll']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'camera-roll': val
              }))
            }
          />
        );
      case 'drop-pin':
        return (
          <Card03DropPin
            mode="reveal"
            data={resp['drop-pin']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'drop-pin': val
              }))
            }
          />
        );
      case 'memories-daydream':
        return (
          <Card04MemoriesDaydream
            mode="reveal"
            data={resp['memories-daydream']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'memories-daydream': val
              }))
            }
          />
        );
      case 'gut-read':
        return (
          <Card05GutRead
            mode="reveal"
            data={resp['gut-read']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'gut-read': val
              }))
            }
          />
        );
      case 'soundtrack':
        return (
          <Card06Soundtrack
            mode="reveal"
            data={resp.soundtrack}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                soundtrack: val
              }))
            }
          />
        );
      case 'emoji-pitch':
        return (
          <Card07EmojiPitch
            mode="reveal"
            data={resp['emoji-pitch']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'emoji-pitch': val
              }))
            }
          />
        );
      case 'brain-pie':
        return (
          <Card08BrainPie
            mode="reveal"
            data={resp['brain-pie']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'brain-pie': val
              }))
            }
          />
        );
      case 'spicy-hill':
        return (
          <Card09SpicyHill
            mode="reveal"
            data={resp['spicy-hill']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
                ...prev,
                'spicy-hill': val
              }))
            }
          />
        );
      case 'two-brains':
        return (
          <Card10TwoBrains
            mode="reveal"
            sharedPrompt={session.sharedTwoBrainsPrompt}
            data={session.playerA.responses['two-brains']}
            partnerData={session.playerB.responses['two-brains']}
            playerName={playerAName}
            partnerName={playerBName}
            onChange={(val) =>
              onUpdatePlayerResponses('playerA', (prev) => ({
                ...prev,
                'two-brains': val
              }))
            }
          />
        );
      case 'dealers-choice':
        return (
          <Card11DealersChoice
            mode="reveal"
            data={resp['dealers-choice']}
            playerName={ownerName}
            partnerName={listenerName}
            onChange={(val) =>
              onUpdatePlayerResponses(owner, (prev) => ({
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
      {/* Top Bar */}
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
          onClick={onBackToLobby}
          className="btn-ghost-candle"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <ArrowLeft size={14} />
          <span>Lobby</span>
        </button>

        <span
          style={{
            fontSize: '0.76rem',
            fontWeight: 700,
            color: 'var(--ink-secondary)'
          }}
        >
          Reveal {slideIndex + 1} of {slides.length}
        </span>

        <button
          type="button"
          onClick={onOpenVaultDrawer}
          className="btn-ghost-candle"
          style={{ padding: '6px 12px', fontSize: '0.78rem' }}
        >
          <Layers size={14} color="var(--accent-rose)" />
          <span>+ Card</span>
        </button>
      </div>

      {/* Delicate Floating Speaker Turn Pill */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderRadius: 999,
          background:
            currentSlide.owner === 'both'
              ? '#FFFFFF'
              : currentSlide.owner === 'playerA'
              ? 'var(--surface-blush)'
              : 'var(--surface-berry-tint)',
          border:
            currentSlide.owner === 'both'
              ? '1px solid var(--border-subtle)'
              : currentSlide.owner === 'playerA'
              ? '1px solid rgba(224, 90, 71, 0.25)'
              : '1px solid rgba(110, 46, 83, 0.25)',
          boxShadow: 'var(--shadow-pill)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: '50%',
              background:
                currentSlide.owner === 'both'
                  ? 'var(--accent-cobalt)'
                  : currentSlide.owner === 'playerA'
                  ? 'var(--accent-rose)'
                  : 'var(--accent-berry)'
            }}
          />
          <span
            style={{
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--ink-primary)'
            }}
          >
            {currentSlide.owner === 'both'
              ? `${playerAName} & ${playerBName} · Side-by-Side`
              : currentSlide.owner === 'playerA'
              ? `${playerAName}’s Story`
              : `${playerBName}’s Story`}
          </span>
        </div>

        {/* Quick Toggle Between Person 1 and Person 2 for Same Card */}
        {currentSlide.owner !== 'both' && (
          <button
            type="button"
            onClick={() => {
              const partnerSlideIdx = slides.findIndex(
                (s) =>
                  s.cardId === currentSlide.cardId &&
                  s.owner !== currentSlide.owner
              );
              if (partnerSlideIdx !== -1) setSlideIndex(partnerSlideIdx);
            }}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              color: 'var(--ink-primary)',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: '0.73rem',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              cursor: 'pointer'
            }}
          >
            <Repeat size={11} color="var(--accent-rose)" />
            <span>
              See{' '}
              {currentSlide.owner === 'playerA' ? playerBName : playerAName}’s
            </span>
          </button>
        )}
      </div>

      {/* Main Ivory Artifact Card Stage */}
      <div
        className="paper-card"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          padding: '20px 18px',
          transition: 'all 0.2s ease'
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 8
          }}
        >
          <span
            className="stamp-badge"
            style={{
              background: `${cardMeta.accentColor}15`,
              color: cardMeta.accentColor
            }}
          >
            {cardMeta.badge}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 600,
              color: 'var(--ink-muted)'
            }}
          >
            {currentSlide.stepLabel}
          </span>
        </div>

        <h2
          className="font-display"
          style={{
            margin: '0 0 12px 0',
            fontSize: '1.35rem',
            lineHeight: 1.2,
            color: 'var(--ink-primary)'
          }}
        >
          {cardMeta.title}
        </h2>

        {/* Soft Blush Conversation Prompt Pill */}
        <div
          style={{
            background: 'var(--surface-blush)',
            borderRadius: 16,
            padding: '10px 13px',
            marginBottom: 16,
            fontSize: '0.82rem',
            color: 'var(--ink-primary)',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            border: '1px solid rgba(224, 90, 71, 0.16)'
          }}
        >
          <MessageCircleHeart
            size={16}
            color="var(--accent-rose)"
            style={{ flexShrink: 0 }}
          />
          <span style={{ lineHeight: 1.4 }}>{cardMeta.revealInstruction}</span>
        </div>

        {/* Dynamic Card Reveal */}
        {renderSlideArtifact()}
      </div>

      {/* Slide Progress Dots */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 6,
          padding: '4px 0'
        }}
      >
        {slides.map((s, idx) => (
          <button
            key={`${s.cardId}-${s.owner}-${idx}`}
            type="button"
            onClick={() => setSlideIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            style={{
              width: idx === slideIndex ? 22 : 7,
              height: 7,
              borderRadius: 999,
              border: 'none',
              background:
                idx === slideIndex
                  ? 'var(--accent-rose)'
                  : 'rgba(30, 22, 26, 0.16)',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              padding: 0
            }}
          />
        ))}
      </div>

      {/* Bottom Swipe / Next Controls */}
      <div style={{ display: 'flex', gap: 10 }}>
        <button
          type="button"
          onClick={handlePrev}
          disabled={slideIndex === 0}
          className="btn-ghost-candle"
          style={{
            padding: '14px 18px',
            opacity: slideIndex === 0 ? 0.4 : 1,
            cursor: slideIndex === 0 ? 'default' : 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Prev</span>
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="btn-primary-brass"
          style={{ flex: 1 }}
        >
          {isLastSlide ? (
            <>
              <Award size={18} />
              <span>View Souvenir Postcard</span>
            </>
          ) : (
            <>
              <span>Next Reveal</span>
              <ArrowRight size={18} />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
