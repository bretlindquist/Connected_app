import React, { useEffect, useRef, useState } from 'react';
import { Undo2, Trash2, Sparkles, Eye } from 'lucide-react';
import { NapkinSketchData } from '../../types/app';
import { NAPKIN_IDEA_PROMPTS } from '../../data/cardsVault';

interface Card01Props {
  mode: 'create' | 'reveal';
  data: NapkinSketchData;
  playerName: string;
  partnerName?: string;
  onChange: (updated: NapkinSketchData) => void;
}

const FINGER_PAINTS = [
  { name: 'Espresso', hex: '#1E161A' },
  { name: 'Rose', hex: '#E05A47' },
  { name: 'Berry', hex: '#6E2E53' },
  { name: 'Sage', hex: '#2F7A5E' },
  { name: 'Cobalt', hex: '#3B5BDB' }
];

const BRUSH_SIZES = [
  { label: 'Fine', radius: 4 },
  { label: 'Med', radius: 8 },
  { label: 'Bold', radius: 14 }
];

export const Card01NapkinSketch: React.FC<Card01Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [color, setColor] = useState(FINGER_PAINTS[0].hex);
  const [brushSize, setBrushSize] = useState(8);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [captionRevealed, setCaptionRevealed] = useState(false);
  const lastPt = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (mode !== 'create') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (data.imageDataUrl) {
      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#FAF6F0';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = data.imageDataUrl;
    } else {
      ctx.fillStyle = '#FAF6F0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Subtle linen dot pattern
      ctx.fillStyle = 'rgba(30, 22, 26, 0.06)';
      for (let x = 24; x < canvas.width; x += 28) {
        for (let y = 24; y < canvas.height; y += 28) {
          ctx.beginPath();
          ctx.arc(x, y, 1.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      const blankUrl = canvas.toDataURL('image/png');
      setHistory([blankUrl]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const getCoords = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    const pt = getCoords(e);
    setIsDrawing(true);
    lastPt.current = pt;

    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPt.current) return;
    e.preventDefault();
    const pt = getCoords(e);
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(lastPt.current.x, lastPt.current.y);
      ctx.lineTo(pt.x, pt.y);
      ctx.stroke();
    }
    lastPt.current = pt;
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    lastPt.current = null;
    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      setHistory((prev) => [...prev.slice(-10), dataUrl]);
      onChange({
        ...data,
        imageDataUrl: dataUrl
      });
    }
  };

  const handleUndo = () => {
    if (history.length <= 1) {
      handleClear();
      return;
    }
    const nextHist = history.slice(0, -1);
    const prevUrl = nextHist[nextHist.length - 1];
    setHistory(nextHist);
    const canvas = canvasRef.current;
    if (canvas && prevUrl) {
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
        ctx?.drawImage(img, 0, 0);
        onChange({ ...data, imageDataUrl: prevUrl });
      };
      img.src = prevUrl;
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#FAF6F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(30, 22, 26, 0.06)';
    for (let x = 24; x < canvas.width; x += 28) {
      for (let y = 24; y < canvas.height; y += 28) {
        ctx.beginPath();
        ctx.arc(x, y, 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const blankUrl = canvas.toDataURL('image/png');
    setHistory([blankUrl]);
    onChange({ ...data, imageDataUrl: '' });
  };

  const handleRandomPrompt = () => {
    const currentIdx = NAPKIN_IDEA_PROMPTS.indexOf(data.promptUsed);
    const nextIdx = (currentIdx + 1) % NAPKIN_IDEA_PROMPTS.length;
    onChange({ ...data, promptUsed: NAPKIN_IDEA_PROMPTS[nextIdx] });
  };

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            background: '#FAF6F0',
            borderRadius: 22,
            padding: 14,
            border: '1px solid var(--border-hairline)',
            boxShadow: 'inset 0 2px 8px rgba(30, 22, 26, 0.04)',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-rose)',
              marginBottom: 8
            }}
          >
            Prompt: “{data.promptUsed}”
          </div>

          <div
            style={{
              aspectRatio: '1 / 1',
              width: '100%',
              background: '#FAF6F0',
              borderRadius: 16,
              overflow: 'hidden',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {data.imageDataUrl ? (
              <img
                src={data.imageDataUrl}
                alt={`${playerName}'s napkin sketch`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <span style={{ color: 'var(--ink-muted)', fontSize: '0.88rem' }}>
                ({playerName} left a blank napkin — tell the story live!)
              </span>
            )}
          </div>

          <div style={{ marginTop: 14 }}>
            {!captionRevealed ? (
              <button
                type="button"
                onClick={() => setCaptionRevealed(true)}
                className="btn-paper-pill"
                style={{
                  width: '100%',
                  background: '#FFFFFF',
                  border: '1.5px solid var(--border-accent)',
                  color: 'var(--accent-rose-deep)'
                }}
              >
                <Eye size={15} />
                <span>
                  Have the table guess first · Tap to reveal title
                </span>
              </button>
            ) : (
              <div
                style={{
                  padding: '12px 16px',
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid var(--border-hairline)',
                  boxShadow: 'var(--shadow-pill)'
                }}
              >
                <div
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: 'var(--ink-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em'
                  }}
                >
                  {playerName}’s Official Title
                </div>
                <div
                  className="font-hand"
                  style={{
                    fontSize: '1.45rem',
                    color: 'var(--ink-primary)',
                    marginTop: 2
                  }}
                >
                  “{data.caption || 'Untitled Masterpiece'}”
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Idea Prompt Pill Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'var(--surface-blush)',
          padding: '9px 14px',
          borderRadius: 16,
          border: '1px solid rgba(224, 90, 71, 0.18)'
        }}
      >
        <div
          style={{
            fontSize: '0.82rem',
            fontWeight: 600,
            color: 'var(--ink-primary)'
          }}
        >
          💡 {data.promptUsed}
        </div>
        <button
          type="button"
          onClick={handleRandomPrompt}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            padding: '5px 11px',
            borderRadius: 999,
            border: '1px solid rgba(224, 90, 71, 0.25)',
            background: '#FFFFFF',
            fontSize: '0.73rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            color: 'var(--accent-rose-deep)'
          }}
        >
          <Sparkles size={12} />
          <span>New Idea</span>
        </button>
      </div>

      {/* Tactile Cocktail Napkin Drawing Surface */}
      <div
        style={{
          position: 'relative',
          aspectRatio: '1 / 1',
          width: '100%',
          borderRadius: 22,
          overflow: 'hidden',
          border: '1.5px solid rgba(30, 22, 26, 0.12)',
          boxShadow: 'inset 0 2px 10px rgba(30, 22, 26, 0.05)',
          background: '#FAF6F0'
        }}
      >
        <canvas
          ref={canvasRef}
          width={520}
          height={520}
          className="gesture-locked-surface"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            cursor: 'crosshair'
          }}
        />
      </div>

      {/* Floating Pill Paint Swatches & Brush Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          flexWrap: 'wrap',
          background: 'var(--surface-subtle)',
          padding: '8px 12px',
          borderRadius: 999
        }}
      >
        {/* 5 Ink Swatches */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {FINGER_PAINTS.map((p) => (
            <button
              key={p.hex}
              type="button"
              onClick={() => setColor(p.hex)}
              aria-label={p.name}
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: p.hex,
                border:
                  color === p.hex
                    ? '2.5px solid #FFFFFF'
                    : '2px solid transparent',
                boxShadow:
                  color === p.hex
                    ? `0 0 0 2px ${p.hex}`
                    : '0 1px 3px rgba(0,0,0,0.15)',
                cursor: 'pointer',
                transform: color === p.hex ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
            />
          ))}
        </div>

        {/* Brush Sizes */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            background: '#FFFFFF',
            padding: 3,
            borderRadius: 999
          }}
        >
          {BRUSH_SIZES.map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => setBrushSize(b.radius)}
              style={{
                padding: '4px 9px',
                borderRadius: 999,
                border: 'none',
                background:
                  brushSize === b.radius ? 'var(--ink-primary)' : 'transparent',
                color:
                  brushSize === b.radius ? '#FFFFFF' : 'var(--ink-secondary)',
                fontSize: '0.7rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {b.label}
            </button>
          ))}
        </div>

        {/* Undo & Clear */}
        <div style={{ display: 'flex', gap: 5 }}>
          <button
            type="button"
            onClick={handleUndo}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--ink-primary)'
            }}
            title="Undo stroke"
          >
            <Undo2 size={14} />
          </button>
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--ink-primary)'
            }}
            title="Clear napkin"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Secret Caption Input */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.75rem',
            fontWeight: 700,
            color: 'var(--ink-secondary)',
            marginBottom: 4
          }}
        >
          Give your drawing a secret title (revealed after they guess):
        </label>
        <input
          type="text"
          className="paper-input"
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="e.g., Getting lost in Lisbon at 2 AM..."
          maxLength={60}
        />
      </div>
    </div>
  );
};
