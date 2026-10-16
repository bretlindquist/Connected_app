import React, { useRef, useState } from 'react';
import { Camera, Sparkles, Eye, ImagePlus } from 'lucide-react';
import { CameraRollData } from '../../types/app';
import { CAMERA_ROLL_PROMPTS } from '../../data/cardsVault';

interface Card02Props {
  mode: 'create' | 'reveal';
  data: CameraRollData;
  playerName: string;
  partnerName: string;
  onPauseTimer?: (paused: boolean) => void;
  onChange: (updated: CameraRollData) => void;
}

const DEMO_FALLBACK_PHOTOS = [
  {
    label: '3 AM Convenience Store Side-Quest',
    caption: 'Nobody remembers why we needed 4 bags of ice',
    url: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=700&q=80'
  },
  {
    label: 'Missed the Train by 90 Seconds',
    caption: 'Turned into the best detour of the trip',
    url: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=700&q=80'
  },
  {
    label: 'Accidental Gourmet Masterpiece',
    caption: 'Cooked with zero recipe and a lot of confidence',
    url: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80'
  }
];

export const Card02CameraRoll: React.FC<Card02Props> = ({
  mode,
  data,
  playerName,
  onPauseTimer,
  onChange
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [unblurred, setUnblurred] = useState(false);

  const handleOpenPicker = () => {
    onPauseTimer?.(true);
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onPauseTimer?.(false);
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 640;
        let w = img.width;
        let h = img.height;
        if (w > h && w > maxDim) {
          h = Math.round((h * maxDim) / w);
          w = maxDim;
        } else if (h > maxDim) {
          w = Math.round((w * maxDim) / h);
          h = maxDim;
        }
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, w, h);
        const compressed = canvas.toDataURL('image/jpeg', 0.8);
        onChange({ ...data, photoDataUrl: compressed });
      };
      img.src = ev.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCyclePrompt = () => {
    const idx = CAMERA_ROLL_PROMPTS.indexOf(data.promptUsed);
    const next = CAMERA_ROLL_PROMPTS[(idx + 1) % CAMERA_ROLL_PROMPTS.length];
    onChange({ ...data, promptUsed: next });
  };

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Satin White Polaroid Frame */}
        <div
          onClick={() => setUnblurred((prev) => !prev)}
          style={{
            background: '#FFFFFF',
            padding: '14px 14px 22px 14px',
            borderRadius: 20,
            boxShadow: '0 14px 32px rgba(30, 22, 26, 0.1)',
            border: '1px solid var(--border-subtle)',
            cursor: 'pointer',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              width: '100%',
              borderRadius: 12,
              overflow: 'hidden',
              background: '#1E161A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {data.photoDataUrl ? (
              <>
                <img
                  src={data.photoDataUrl}
                  alt="Camera roll moment"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: unblurred ? 'none' : 'blur(18px) scale(1.08)',
                    transition: 'filter 0.45s ease'
                  }}
                />
                {!unblurred && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(30, 22, 26, 0.32)',
                      color: '#FFFFFF',
                      padding: 16
                    }}
                  >
                    <Eye size={28} />
                    <span
                      style={{
                        marginTop: 6,
                        fontWeight: 700,
                        fontSize: '0.86rem'
                      }}
                    >
                      Tap Polaroid to Unblur Photo
                    </span>
                  </div>
                )}
              </>
            ) : (
              <span
                style={{
                  color: '#FFFFFF',
                  opacity: 0.75,
                  fontSize: '0.85rem',
                  padding: 16
                }}
              >
                No photo uploaded — {playerName}, describe the photo live!
              </span>
            )}
          </div>

          <div
            className="font-hand"
            style={{
              fontSize: '1.45rem',
              color: 'var(--ink-primary)',
              marginTop: 14
            }}
          >
            “{data.caption || 'There is a story behind this one...'}”
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Prompt Selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
          background: 'var(--surface-blush)',
          padding: '10px 14px',
          borderRadius: 16,
          border: '1px solid rgba(224, 90, 71, 0.18)'
        }}
      >
        <span
          style={{
            fontSize: '0.8rem',
            fontWeight: 600,
            color: 'var(--ink-primary)'
          }}
        >
          📸 {data.promptUsed}
        </span>
        <button
          type="button"
          onClick={handleCyclePrompt}
          style={{
            padding: '5px 11px',
            borderRadius: 999,
            border: '1px solid rgba(224, 90, 71, 0.25)',
            background: '#FFFFFF',
            fontSize: '0.73rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            color: 'var(--accent-rose-deep)'
          }}
        >
          <Sparkles size={12} />
          <span>Swap Prompt</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Satin White Polaroid Uploader */}
      <div
        onClick={handleOpenPicker}
        style={{
          background: '#FFFFFF',
          padding: '14px 14px 18px 14px',
          borderRadius: 20,
          border: '1.5px dashed rgba(224, 90, 71, 0.35)',
          boxShadow: 'var(--shadow-pill)',
          textAlign: 'center',
          cursor: 'pointer'
        }}
      >
        {data.photoDataUrl ? (
          <div
            style={{
              position: 'relative',
              aspectRatio: '4 / 3',
              borderRadius: 12,
              overflow: 'hidden'
            }}
          >
            <img
              src={data.photoDataUrl}
              alt="Selected"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: 8,
                right: 8,
                background: 'rgba(30, 22, 26, 0.78)',
                color: '#FFFFFF',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '5px 11px',
                borderRadius: 999
              }}
            >
              Tap to change photo
            </span>
          </div>
        ) : (
          <div
            style={{
              aspectRatio: '16 / 10',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              background: 'var(--bg-canvas)',
              borderRadius: 14,
              color: 'var(--ink-primary)'
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'var(--accent-rose-soft)',
                color: 'var(--accent-rose)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Camera size={22} />
            </div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
              Tap to Pick From Camera Roll
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
              Timer pauses while you browse your photos
            </div>
          </div>
        )}
      </div>

      {/* Quick Story Starters */}
      <div>
        <div
          style={{
            fontSize: '0.73rem',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            marginBottom: 6
          }}
        >
          Or tap a sample Polaroid if your camera roll is shy:
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {DEMO_FALLBACK_PHOTOS.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  photoDataUrl: item.url,
                  caption: item.caption
                })
              }
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                padding: '6px 11px',
                borderRadius: 999,
                border: '1px solid var(--border-subtle)',
                background: 'var(--surface-subtle)',
                fontSize: '0.73rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: 'var(--ink-primary)'
              }}
            >
              <ImagePlus size={12} color="var(--accent-rose)" />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Teaser Hint Input */}
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
          One-line teaser caption on the Polaroid border:
        </label>
        <input
          type="text"
          className="paper-input"
          value={data.caption}
          onChange={(e) => onChange({ ...data, caption: e.target.value })}
          placeholder="e.g., 5 seconds before disaster..."
          maxLength={65}
        />
      </div>
    </div>
  );
};
