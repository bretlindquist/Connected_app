import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Eye, Sparkles } from 'lucide-react';
import { PlayerState, TwoBrainsData } from '../../types/app';
import { TWO_BRAINS_SHARED_PROMPTS } from '../../data/cardsVault';

interface Card10Props {
  mode: 'create' | 'reveal';
  sharedPrompt: string;
  onChangeSharedPrompt?: (prompt: string) => void;
  data: TwoBrainsData;
  allPlayers?: PlayerState[];
  playerName: string;
  partnerName?: string;
  onChange: (updated: TwoBrainsData) => void;
}

const COLORS = ['#1E161A', '#E05A47', '#3B5BDB', '#2F7A5E'];
const BRAIN_TINTS = [
  { accent: 'var(--accent-rose)', tint: 'var(--surface-blush)' },
  { accent: 'var(--accent-berry)', tint: 'var(--surface-berry-tint)' },
  { accent: 'var(--accent-sage)', tint: 'rgba(46, 109, 90, 0.08)' },
  { accent: 'var(--accent-cobalt)', tint: 'rgba(59, 91, 153, 0.08)' }
];

export const Card10TwoBrains: React.FC<Card10Props> = ({
  mode,
  sharedPrompt,
  onChangeSharedPrompt,
  data,
  allPlayers,
  playerName,
  onChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState(COLORS[0]);
  const [drawing, setDrawing] = useState(false);
  const [unfolded, setUnfolded] = useState(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (mode !== 'create') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (data.sketchDataUrl) {
      const img = new Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = data.sketchDataUrl;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const getPt = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!;
    const r = c.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * c.width) / r.width,
      y: ((e.clientY - r.top) * c.height) / r.height
    };
  };

  const handleDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getPt(e);
    setDrawing(true);
    lastPt.current = pt;
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handleMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing || !lastPt.current) return;
    e.preventDefault();
    const pt = getPt(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 7;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPt.current.x, lastPt.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    lastPt.current = pt;
  };

  const handleUp = () => {
    if (!drawing) return;
    setDrawing(false);
    lastPt.current = null;
    if (canvasRef.current) {
      onChange({
        ...data,
        sketchDataUrl: canvasRef.current.toDataURL('image/png')
      });
    }
  };

  const handleClear = () => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, c.width, c.height);
    onChange({ ...data, sketchDataUrl: '' });
  };

  const currentPromptIdx = Math.max(
    0,
    TWO_BRAINS_SHARED_PROMPTS.indexOf(sharedPrompt)
  );

  const handleCyclePrompt = () => {
    const nextIdx = (currentPromptIdx + 1) % TWO_BRAINS_SHARED_PROMPTS.length;
    const nextPrompt = TWO_BRAINS_SHARED_PROMPTS[nextIdx];
    onChangeSharedPrompt?.(nextPrompt);
    onChange({ ...data, promptIndex: nextIdx });
  };

  if (mode === 'reveal') {
    const multiPlayers =
      allPlayers && allPlayers.length > 1 ? allPlayers : null;

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div
          style={{
            background: 'var(--surface-subtle)',
            padding: '10px 14px',
            borderRadius: 16,
            fontSize: '0.84rem',
            fontWeight: 700,
            color: 'var(--accent-cobalt)',
            textAlign: 'center'
          }}
        >
          Prompt #{currentPromptIdx + 1}: “{sharedPrompt}”
        </div>

        {multiPlayers ? (
          !unfolded ? (
            <button
              type="button"
              onClick={() => setUnfolded(true)}
              className="btn-primary-brass"
              style={{ width: '100%', padding: '20px' }}
            >
              <Eye size={18} />
              <span>
                Tap to Unfold All {multiPlayers.length} Brains Side-by-Side!
              </span>
            </button>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10
              }}
            >
              {multiPlayers.map((p, idx) => {
                const name = p.name.trim() || `Person ${idx + 1}`;
                const item = p.responses['two-brains'];
                const style = BRAIN_TINTS[idx % BRAIN_TINTS.length];
                return (
                  <div
                    key={p.id || idx}
                    style={{
                      background: style.tint,
                      borderRadius: 18,
                      padding: 10,
                      border: '1px solid var(--border-hairline)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 8
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: style.accent
                      }}
                    >
                      {name}’s Brain
                    </div>

                    <div
                      style={{
                        aspectRatio: '1 / 1',
                        background: '#FAF6F0',
                        borderRadius: 12,
                        border: '1px solid var(--border-subtle)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {item.sketchDataUrl ? (
                        <img
                          src={item.sketchDataUrl}
                          alt={`${name} brain`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain'
                          }}
                        />
                      ) : (
                        <span
                          style={{
                            fontSize: '0.73rem',
                            color: 'var(--ink-muted)',
                            textAlign: 'center',
                            padding: 8
                          }}
                        >
                          (Verbal take!)
                        </span>
                      )}
                    </div>

                    <div
                      className="font-hand"
                      style={{
                        fontSize: '1.15rem',
                        color: 'var(--ink-primary)',
                        lineHeight: 1.2
                      }}
                    >
                      “{item.caption || 'Here is how my brain sees it'}”
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Single Phone Owner Reveal: Full card + instruction to place phones side-by-side at the table */
          <div
            style={{
              background: 'var(--surface-blush)',
              borderRadius: 20,
              padding: 14,
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '0.76rem',
                fontWeight: 700,
                color: 'var(--accent-rose-deep)'
              }}
            >
              Place phones side-by-side in the center of the table to compare!
            </div>

            <div
              style={{
                aspectRatio: '4 / 3',
                background: '#FAF6F0',
                borderRadius: 14,
                border: '1px solid var(--border-subtle)',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {data.sketchDataUrl ? (
                <img
                  src={data.sketchDataUrl}
                  alt={`${playerName} brain`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              ) : (
                <span
                  style={{
                    fontSize: '0.84rem',
                    color: 'var(--ink-muted)',
                    padding: 12
                  }}
                >
                  ({playerName === 'You' ? 'You' : playerName} kept it verbal —
                  describe your version live!)
                </span>
              )}
            </div>

            <div
              className="font-hand"
              style={{
                fontSize: '1.35rem',
                color: 'var(--ink-primary)',
                lineHeight: 1.2
              }}
            >
              “{data.caption || 'Here is how my brain sees it'}”
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'rgba(59, 91, 219, 0.08)',
          padding: '10px 14px',
          borderRadius: 16,
          border: '1px solid rgba(59, 91, 219, 0.2)'
        }}
      >
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 700,
            color: 'var(--accent-cobalt)'
          }}
        >
          👯 Prompt #{currentPromptIdx + 1}: “{sharedPrompt}”
        </div>
        <button
          type="button"
          onClick={handleCyclePrompt}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 10px',
            borderRadius: 999,
            border: '1px solid rgba(59, 91, 219, 0.25)',
            background: '#FFFFFF',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            color: 'var(--accent-cobalt)'
          }}
        >
          <Sparkles size={11} />
          <span>Prompt #{((currentPromptIdx + 1) % TWO_BRAINS_SHARED_PROMPTS.length) + 1}</span>
        </button>
      </div>

      {/* Mini Sketch Pad */}
      <div
        style={{
          aspectRatio: '4 / 3',
          width: '100%',
          background: '#FAF6F0',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1.5px solid var(--border-subtle)',
          boxShadow: 'inset 0 2px 8px rgba(30,22,26,0.04)'
        }}
      >
        <canvas
          ref={canvasRef}
          width={480}
          height={360}
          className="gesture-locked-surface"
          onPointerDown={handleDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--surface-subtle)',
          padding: '7px 12px',
          borderRadius: 999
        }}
      >
        <div style={{ display: 'flex', gap: 8 }}>
          {COLORS.map((hex) => (
            <button
              key={hex}
              type="button"
              onClick={() => setColor(hex)}
              style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: hex,
                border:
                  color === hex ? '2.5px solid #FFFFFF' : '2px solid transparent',
                boxShadow: color === hex ? `0 0 0 2px ${hex}` : 'none',
                cursor: 'pointer'
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleClear}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
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
          <Trash2 size={13} />
          <span>Clear</span>
        </button>
      </div>

      <input
        type="text"
        className="paper-input"
        value={data.caption}
        onChange={(e) => onChange({ ...data, caption: e.target.value })}
        placeholder="One-line caption for your take..."
        maxLength={65}
      />
    </div>
  );
};
