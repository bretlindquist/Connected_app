import React, { useEffect, useRef, useState } from 'react';
import { Trash2, Eye } from 'lucide-react';
import { TwoBrainsData } from '../../types/app';

interface Card10Props {
  mode: 'create' | 'reveal';
  sharedPrompt: string;
  data: TwoBrainsData;
  partnerData?: TwoBrainsData;
  playerName: string;
  partnerName: string;
  onChange: (updated: TwoBrainsData) => void;
}

const COLORS = ['#1E161A', '#E05A47', '#3B5BDB', '#2F7A5E'];

export const Card10TwoBrains: React.FC<Card10Props> = ({
  mode,
  sharedPrompt,
  data,
  partnerData,
  playerName,
  partnerName,
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

  if (mode === 'reveal') {
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
          Shared Prompt: “{sharedPrompt}”
        </div>

        {!unfolded ? (
          <button
            type="button"
            onClick={() => setUnfolded(true)}
            className="btn-primary-brass"
            style={{ width: '100%', padding: '20px' }}
          >
            <Eye size={18} />
            <span>
              Tap to Unfold {playerName} &amp; {partnerName} Side-by-Side!
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
            {[
              {
                name: playerName,
                item: data,
                accent: 'var(--accent-rose)',
                tint: 'var(--surface-blush)'
              },
              {
                name: partnerName,
                item: partnerData || { sketchDataUrl: '', caption: '' },
                accent: 'var(--accent-berry)',
                tint: 'var(--surface-berry-tint)'
              }
            ].map((brain, idx) => (
              <div
                key={idx}
                style={{
                  background: brain.tint,
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
                    color: brain.accent
                  }}
                >
                  {brain.name}’s Brain
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
                  {brain.item.sketchDataUrl ? (
                    <img
                      src={brain.item.sketchDataUrl}
                      alt={`${brain.name} brain`}
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
                  “{brain.item.caption || 'Here is how my brain sees it'}”
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div
        style={{
          background: 'rgba(59, 91, 219, 0.08)',
          padding: '10px 14px',
          borderRadius: 16,
          border: '1px solid rgba(59, 91, 219, 0.2)',
          fontSize: '0.84rem',
          fontWeight: 700,
          color: 'var(--accent-cobalt)'
        }}
      >
        👯 Shared Prompt: “{sharedPrompt}”
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
