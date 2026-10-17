import React, { useRef, useState } from 'react';
import {
  Download,
  RotateCcw,
  Layers,
  Sparkles,
  Share2,
  Check,
  Heart
} from 'lucide-react';
import { TableSessionState } from '../types/app';
import { CARDS_VAULT } from '../data/cardsVault';
import { buildShareableUrlWithSession } from '../utils/shareCodec';

interface KeepsakeViewProps {
  session: TableSessionState;
  onBackToReveal: () => void;
  onOpenVaultDrawer: () => void;
  onStartNewSession: () => void;
}

const ACCENT_PALETTE = [
  'var(--accent-rose)',
  'var(--accent-berry)',
  'var(--accent-sage)',
  'var(--accent-cobalt)'
];

export const KeepsakeView: React.FC<KeepsakeViewProps> = ({
  session,
  onBackToReveal,
  onOpenVaultDrawer,
  onStartNewSession
}) => {
  const [downloading, setDownloading] = useState(false);
  const [sharedLinkCopied, setSharedLinkCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const players = session.players;
  const isSinglePlayer = players.length === 1;
  const ownerName = players[0]?.name?.trim() || 'My';

  const headerTitle = isSinglePlayer
    ? ownerName === 'My'
      ? 'My Table Deck'
      : `${ownerName}’s Table Deck`
    : players
        .map((p, idx) => p.name.trim() || `Person ${idx + 1}`)
        .join(' · ');

  const dateStr = new Date(session.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDownloadPostcard = async () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1350;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Soft warm silk background
      ctx.fillStyle = '#FAF6F0';
      ctx.fillRect(0, 0, 1080, 1350);

      // Pure white inner card
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(48, 48, 984, 1254);

      // Subtle rose border
      ctx.strokeStyle = '#E05A47';
      ctx.lineWidth = 3;
      ctx.strokeRect(68, 68, 944, 1214);

      // Header text
      ctx.fillStyle = '#E05A47';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`CONNECTED · AROUND THE TABLE  •  ${dateStr.toUpperCase()}`, 108, 135);

      ctx.fillStyle = '#1E161A';
      ctx.font = 'bold 50px "Fraunces", Georgia, serif';
      ctx.fillText(headerTitle.slice(0, 34), 108, 205);

      const loadImg = (src: string): Promise<HTMLImageElement | null> =>
        new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      if (isSinglePlayer) {
        const sketch = players[0].responses['napkin-sketch'];
        const img = await loadImg(sketch.imageDataUrl);
        ctx.fillStyle = '#FAF6F0';
        ctx.fillRect(310, 245, 460, 460);
        if (img) ctx.drawImage(img, 322, 257, 436, 436);
        ctx.fillStyle = '#1E161A';
        ctx.font = 'bold 28px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(
          `"${sketch.caption || '60s Napkin Sketch'}"`,
          108,
          750
        );
      } else {
        const firstTwo = players.slice(0, 2);
        const imgs = await Promise.all(
          firstTwo.map((p) => loadImg(p.responses['napkin-sketch'].imageDataUrl))
        );

        firstTwo.forEach((p, idx) => {
          const x = idx === 0 ? 108 : 555;
          const pName = p.name.trim() || `Person ${idx + 1}`;
          const sketch = p.responses['napkin-sketch'];
          ctx.fillStyle = '#FAF6F0';
          ctx.fillRect(x, 250, 415, 415);
          if (imgs[idx]) ctx.drawImage(imgs[idx]!, x + 10, 260, 395, 395);
          ctx.fillStyle = '#1E161A';
          ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
          ctx.fillText(
            `${pName}: "${(sketch.caption || '60s Sketch').slice(0, 24)}"`,
            x,
            705
          );
        });
      }

      // Highlights section
      ctx.fillStyle = '#E05A47';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('TABLE HIGHLIGHTS', 108, 810);

      let y = 860;
      const p0 = players[0].responses;
      session.activeCardIds.slice(0, 5).forEach((cId, i) => {
        const meta = CARDS_VAULT[cId];
        ctx.fillStyle = '#1E161A';
        ctx.font = 'bold 28px "Fraunces", Georgia, serif';
        ctx.fillText(`${i + 1}. ${meta.title}`, 108, y);
        y += 40;

        let detail = '';
        if (cId === 'drop-pin') {
          detail = `📍 ${p0['drop-pin'].label}`;
        } else if (cId === 'spicy-hill') {
          detail = `"${p0['spicy-hill'].opinion.slice(0, 52)}..."`;
        } else if (cId === 'emoji-pitch') {
          detail = `${p0['emoji-pitch'].emojis.join('')} — ${p0['emoji-pitch'].storyTitle}`;
        } else if (cId === 'soundtrack') {
          detail = `🎵 ${p0.soundtrack.trackName} — ${p0.soundtrack.artistName}`;
        } else {
          detail = meta.shortTitle;
        }

        ctx.fillStyle = '#5E5258';
        ctx.font = '24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(detail.slice(0, 68), 108, y);
        y += 54;
      });

      ctx.fillStyle = '#94878D';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('connected-app-seven.vercel.app', 108, 1235);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `connected-table-postcard.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleShareLink = async () => {
    const shareUrl = buildShareableUrlWithSession(session);
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Connected — ${headerTitle}`,
          text: 'Play this connection card pack at the table!',
          url: shareUrl
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setSharedLinkCopied(true);
      setTimeout(() => setSharedLinkCopied(false), 2500);
    } catch {
      // Ignore
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        paddingBottom: 36,
        paddingTop: 6
      }}
    >
      {/* Editorial Postcard Artifact */}
      <div
        className="paper-card"
        style={{
          padding: '24px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 18
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-hairline)',
            paddingBottom: 14
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
              <Heart size={11} fill="currentColor" /> Table Souvenir Postcard
            </span>
            <h1
              className="font-display"
              style={{
                margin: 0,
                fontSize: '1.6rem',
                lineHeight: 1.15,
                color: 'var(--ink-primary)'
              }}
            >
              {headerTitle}
            </h1>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--ink-muted)'
              }}
            >
              {dateStr}
            </div>
            <div
              style={{
                fontSize: '0.78rem',
                color: 'var(--accent-rose)',
                fontWeight: 700
              }}
            >
              {session.activeCardIds.length}{' '}
              {session.activeCardIds.length === 1 ? 'Card' : 'Cards'} Shared
            </div>
          </div>
        </div>

        {/* Polaroid Napkin Sketch(es) — Centered Hero if 1 player on phone, Grid if multiple */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isSinglePlayer ? '1fr' : '1fr 1fr',
            gap: 12
          }}
        >
          {players.map((p, idx) => {
            const pName =
              p.name.trim() || (idx === 0 ? 'Your' : `Person ${idx + 1}`);
            const sketch = p.responses['napkin-sketch'];
            const accent = ACCENT_PALETTE[idx % ACCENT_PALETTE.length];

            return (
              <div
                key={p.id || idx}
                style={{
                  background: 'var(--bg-canvas)',
                  borderRadius: 18,
                  padding: isSinglePlayer ? 14 : 10,
                  border: '1px solid var(--border-hairline)',
                  boxShadow: 'var(--shadow-pill)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 6,
                  maxWidth: isSinglePlayer ? 320 : 'none',
                  margin: isSinglePlayer ? '0 auto' : 0,
                  width: '100%'
                }}
              >
                <div
                  style={{
                    aspectRatio: '1 / 1',
                    background: '#FFFFFF',
                    borderRadius: 12,
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-hairline)'
                  }}
                >
                  {sketch.imageDataUrl ? (
                    <img
                      src={sketch.imageDataUrl}
                      alt={`${pName} sketch`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain'
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '0.74rem',
                        color: 'var(--ink-muted)'
                      }}
                    >
                      No sketch
                    </span>
                  )}
                </div>
                <div
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: accent
                  }}
                >
                  {pName === 'Your' ? 'Your 60s Napkin Sketch' : `${pName}’s Sketch`}
                </div>
                <div
                  className="font-hand"
                  style={{
                    fontSize: isSinglePlayer ? '1.25rem' : '1.05rem',
                    lineHeight: 1.15,
                    color: 'var(--ink-primary)'
                  }}
                >
                  “{sketch.caption || 'My 60s creation'}”
                </div>
              </div>
            );
          })}
        </div>

        {/* Clean Editorial Story Highlights List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--ink-muted)',
              marginBottom: 4
            }}
          >
            Cards Played at the Table
          </div>

          {session.activeCardIds.map((cardId, idx) => {
            const meta = CARDS_VAULT[cardId];
            return (
              <div
                key={`${cardId}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 4px',
                  borderBottom:
                    idx < session.activeCardIds.length - 1
                      ? '1px solid var(--border-hairline)'
                      : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      background: meta.accentColor
                    }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>
                    {meta.title}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    color: 'var(--ink-muted)'
                  }}
                >
                  {meta.badge}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {/* Action Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button
          type="button"
          onClick={handleDownloadPostcard}
          disabled={downloading}
          className="btn-primary-brass"
          style={{ width: '100%' }}
        >
          <Download size={18} />
          <span>
            {downloading
              ? 'Creating Souvenir Postcard...'
              : 'Save Souvenir Postcard (PNG)'}
          </span>
        </button>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={handleShareLink}
            className="btn-ghost-candle"
            style={{ flex: 1 }}
          >
            {sharedLinkCopied ? (
              <Check size={16} color="var(--accent-sage)" />
            ) : (
              <Share2 size={16} color="var(--accent-rose)" />
            )}
            <span>{sharedLinkCopied ? 'Link Copied!' : 'Share Pack Link'}</span>
          </button>

          <button
            type="button"
            onClick={onOpenVaultDrawer}
            className="btn-ghost-candle"
            style={{ flex: 1 }}
          >
            <Layers size={16} color="var(--accent-rose)" />
            <span>Play Another Card</span>
          </button>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            onClick={onBackToReveal}
            className="btn-ghost-candle"
            style={{ flex: 1 }}
          >
            <Sparkles size={15} />
            <span>Revisit Reveal Deck</span>
          </button>

          <button
            type="button"
            onClick={onStartNewSession}
            className="btn-ghost-candle"
            style={{ flex: 1 }}
          >
            <RotateCcw size={15} />
            <span>Start Fresh Table</span>
          </button>
        </div>
      </div>
    </div>
  );
};
