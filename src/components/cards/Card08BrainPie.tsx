import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BrainPieData, BrainSlice } from '../../types/app';

interface Card08Props {
  mode: 'create' | 'reveal';
  data: BrainPieData;
  playerName: string;
  partnerName: string;
  onChange: (updated: BrainPieData) => void;
}

const SLICE_COLORS = ['#E05A47', '#D4953A', '#2F7A5E', '#6E2E53', '#3B5BDB'];

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180.0;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function describeSliceArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
) {
  const clampedEnd =
    endAngle - startAngle >= 360 ? startAngle + 359.9 : endAngle;
  const start = polarToCartesian(cx, cy, r, clampedEnd);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArcFlag = clampedEnd - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    cx,
    cy,
    'L',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    'Z'
  ].join(' ');
}

export const Card08BrainPie: React.FC<Card08Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const [selectedSliceId, setSelectedSliceId] = useState<string | null>(
    data.slices[0]?.id || null
  );

  const totalWeight =
    data.slices.reduce((acc, s) => acc + Math.max(5, s.percent), 0) || 100;

  const handleUpdateLabel = (id: string, label: string) => {
    const next = data.slices.map((s) => (s.id === id ? { ...s, label } : s));
    onChange({ slices: next });
  };

  const handleUpdateWeight = (id: string, newVal: number) => {
    const next = data.slices.map((s) =>
      s.id === id ? { ...s, percent: newVal } : s
    );
    const sum = next.reduce((acc, s) => acc + s.percent, 0) || 1;
    const normalized = next.map((s) => ({
      ...s,
      percent: Math.max(5, Math.round((s.percent / sum) * 100))
    }));
    onChange({ slices: normalized });
  };

  const handleAddSlice = () => {
    if (data.slices.length >= 5) return;
    const newSlice: BrainSlice = {
      id: `s-${Date.now()}`,
      label: 'Random rabbit hole',
      percent: 20,
      color: SLICE_COLORS[data.slices.length % SLICE_COLORS.length]
    };
    const next = [...data.slices, newSlice];
    const sum = next.reduce((acc, s) => acc + s.percent, 0);
    const normalized = next.map((s) => ({
      ...s,
      percent: Math.round((s.percent / sum) * 100)
    }));
    onChange({ slices: normalized });
  };

  const handleRemoveSlice = (id: string) => {
    if (data.slices.length <= 2) return;
    const next = data.slices.filter((s) => s.id !== id);
    const sum = next.reduce((acc, s) => acc + s.percent, 0) || 1;
    const normalized = next.map((s) => ({
      ...s,
      percent: Math.round((s.percent / sum) * 100)
    }));
    onChange({ slices: normalized });
  };

  let currentAngle = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Interactive SVG Pie Wheel */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          background: 'var(--bg-canvas)',
          borderRadius: 22,
          padding: 16,
          border: '1px solid var(--border-hairline)'
        }}
      >
        <svg
          width={210}
          height={210}
          viewBox="0 0 220 220"
          className="gesture-locked-surface"
        >
          {data.slices.map((slice) => {
            const sweep = (Math.max(5, slice.percent) / totalWeight) * 360;
            const path = describeSliceArc(
              110,
              110,
              96,
              currentAngle,
              currentAngle + sweep
            );
            currentAngle += sweep;
            const isSelected = selectedSliceId === slice.id;

            return (
              <path
                key={slice.id}
                d={path}
                fill={slice.color}
                stroke="#FFFFFF"
                strokeWidth={isSelected ? 4 : 2.5}
                onClick={() => setSelectedSliceId(slice.id)}
                style={{
                  cursor: 'pointer',
                  opacity: isSelected || mode === 'create' ? 1 : 0.88,
                  transition: 'opacity 0.2s ease'
                }}
              />
            );
          })}
          <circle
            cx={110}
            cy={110}
            r={30}
            fill="#FFFFFF"
            stroke="rgba(30,22,26,0.08)"
            strokeWidth={2}
          />
          <text
            x={110}
            y={114}
            textAnchor="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#1E161A"
          >
            {playerName.slice(0, 8)}
          </text>
        </svg>

        {/* Legend / Breakdown List */}
        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            marginTop: 10
          }}
        >
          {data.slices.map((s) => {
            const pct = Math.round(
              (Math.max(5, s.percent) / totalWeight) * 100
            );
            const active = selectedSliceId === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSliceId(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '9px 13px',
                  borderRadius: 14,
                  background: active ? '#FFFFFF' : 'var(--surface-subtle)',
                  border: active
                    ? `1.5px solid ${s.color}`
                    : '1px solid transparent',
                  boxShadow: active ? 'var(--shadow-pill)' : 'none',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      width: 11,
                      height: 11,
                      borderRadius: '50%',
                      background: s.color,
                      flexShrink: 0
                    }}
                  />
                  <span style={{ fontSize: '0.86rem', fontWeight: 600 }}>
                    {s.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: s.color
                  }}
                >
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Creation Controls */}
      {mode === 'create' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {data.slices.map((slice) => (
            <div
              key={slice.id}
              style={{
                background: 'var(--surface-subtle)',
                padding: 12,
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                gap: 6
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    background: slice.color,
                    flexShrink: 0
                  }}
                />
                <input
                  type="text"
                  value={slice.label}
                  onChange={(e) => handleUpdateLabel(slice.id, e.target.value)}
                  className="paper-input"
                  style={{ padding: '7px 10px', fontSize: '0.84rem', flex: 1 }}
                  maxLength={45}
                />
                {data.slices.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSlice(slice.id)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '50%',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      color: 'var(--ink-secondary)'
                    }}
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '0 4px'
                }}
              >
                <input
                  type="range"
                  min={5}
                  max={85}
                  value={slice.percent}
                  onChange={(e) =>
                    handleUpdateWeight(slice.id, Number(e.target.value))
                  }
                  style={{ flex: 1, accentColor: slice.color }}
                />
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    width: 36,
                    textAlign: 'right',
                    color: slice.color
                  }}
                >
                  {Math.round((slice.percent / totalWeight) * 100)}%
                </span>
              </div>
            </div>
          ))}

          {data.slices.length < 5 && (
            <button
              type="button"
              onClick={handleAddSlice}
              className="btn-paper-pill"
              style={{ alignSelf: 'flex-start', fontSize: '0.78rem' }}
            >
              <Plus size={14} />
              <span>Add Brain Slice ({data.slices.length}/5)</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
