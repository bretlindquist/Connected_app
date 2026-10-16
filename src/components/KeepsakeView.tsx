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

export const KeepsakeView: React.FC<KeepsakeViewProps> = ({
  session,
  onBackToReveal,
  onOpenVaultDrawer,
  onStartNewSession
}) => {
  const [downloading, setDownloading] = useState(false);
  const [sharedLinkCopied, setSharedLinkCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const playerAName = session.playerA.name.trim() || 'Person 1';
  const playerBName = session.playerB.name.trim() || 'Person 2';
  const dateStr = new Date(session.createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const sketchA = session.playerA.responses['napkin-sketch'];
  const sketchB = session.playerB.responses['napkin-sketch'];

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
      ctx.fillText(`TABLE FOR TWO  •  ${dateStr.toUpperCase()}`, 108, 135);

      ctx.fillStyle = '#1E161A';
      ctx.font = 'bold 54px "Fraunces", Georgia, serif';
      ctx.fillText(`${playerAName} & ${playerBName}`, 108, 205);

      // Draw both sketches side-by-side if present
      const loadImg = (src: string): Promise<HTMLImageElement | null> =>
        new Promise((resolve) => {
          if (!src) return resolve(null);
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = src;
        });

      const [imgA, imgB] = await Promise.all([
        loadImg(sketchA.imageDataUrl),
        loadImg(sketchB.imageDataUrl)
      ]);

      // Frame A
      ctx.fillStyle = '#FAF6F0';
      ctx.fillRect(108, 250, 415, 415);
      if (imgA) ctx.drawImage(imgA, 118, 260, 395, 395);
      ctx.fillStyle = '#1E161A';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${playerAName}: "${sketchA.caption || '60s Napkin Sketch'}"`,
        108,
        705
      );

      // Frame B
      ctx.fillStyle = '#FAF6F0';
      ctx.fillRect(555, 250, 415, 415);
      if (imgB) ctx.drawImage(imgB, 565, 260, 395, 395);
      ctx.fillStyle = '#1E161A';
      ctx.font = 'bold 26px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(
        `${playerBName}: "${sketchB.caption || '60s Napkin Sketch'}"`,
        555,
        705
      );

      // Highlights section
      ctx.fillStyle = '#E05A47';
      ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('OUR TABLE HIGHLIGHTS', 108, 790);

      let y = 845;
      session.activeCardIds.slice(0, 5).forEach((cId, i) => {
        const meta = CARDS_VAULT[cId];
        ctx.fillStyle = '#1E161A';
        ctx.font = 'bold 28px "Fraunces", Georgia, serif';
        ctx.fillText(`${i + 1}. ${meta.title}`, 108, y);
        y += 42;

        let detail = '';
        if (cId === 'drop-pin') {
          detail = `${playerAName}: ${session.playerA.responses['drop-pin'].label}  |  ${playerBName}: ${session.playerB.responses['drop-pin'].label}`;
        } else if (cId === 'spicy-hill') {
          detail = `"${session.playerA.responses['spicy-hill'].opinion.slice(0, 42)}..."`;
        } else if (cId === 'emoji-pitch') {
          detail = `${session.playerA.responses['emoji-pitch'].emojis.join('')}  &  ${session.playerB.responses['emoji-pitch'].emojis.join('')}`;
        } else if (cId === 'soundtrack') {
          detail = `🎵 ${session.playerA.responses.soundtrack.trackName}  •  🎵 ${session.playerB.responses.soundtrack.trackName}`;
        } else {
          detail = meta.shortTitle;
        }

        ctx.fillStyle = '#5E5258';
        ctx.font = '24px "Plus Jakarta Sans", sans-serif';
        ctx.fillText(detail.slice(0, 68), 108, y);
        y += 56;
      });

      ctx.fillStyle = '#94878D';
      ctx.font = 'bold 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('connected-app-seven.vercel.app', 108, 1235);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `table-for-two-${playerAName.toLowerCase()}-${playerBName.toLowerCase()}.png`;
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
          title: `Table for Two — ${playerAName} & ${playerBName}`,
          text: 'Check out our Table for Two sketches & stories!',
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
              <Heart size={11} fill="currentColor" /> Souvenir Postcard
            </span>
            <h1
              className="font-display"
              style={{
                margin: 0,
                fontSize: '1.65rem',
                lineHeight: 1.15,
                color: 'var(--ink-primary)'
              }}
            >
              {playerAName}{' '}
              <span
                style={{
                  fontStyle: 'italic',
                  color: 'var(--accent-rose)',
                  fontWeight: 500
                }}
              >
                &amp;
              </span>{' '}
              {playerBName}
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
              {session.activeCardIds.length} Cards Shared
            </div>
          </div>
        </div>

        {/* Side-by-Side Polaroid Napkin Sketches */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12
          }}
        >
          {[
            { name: playerAName, sketch: sketchA, accent: 'var(--accent-rose)' },
            { name: playerBName, sketch: sketchB, accent: 'var(--accent-berry)' }
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--bg-canvas)',
                borderRadius: 18,
                padding: 10,
                border: '1px solid var(--border-hairline)',
                boxShadow: 'var(--shadow-pill)',
                display: 'flex',
                flexDirection: 'column',
                gap: 6
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
                {item.sketch.imageDataUrl ? (
                  <img
                    src={item.sketch.imageDataUrl}
                    alt={`${item.name} sketch`}
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
                  color: item.accent
                }}
              >
                {item.name}’s Sketch
              </div>
              <div
                className="font-hand"
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.15,
                  color: 'var(--ink-primary)'
                }}
              >
                “{item.sketch.caption || 'My 60s creation'}”
              </div>
            </div>
          ))}
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
            Stories from the Table
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
            <span>{sharedLinkCopied ? 'Link Copied!' : 'Share Table Link'}</span>
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
