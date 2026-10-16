import React, { useEffect, useRef, useState } from 'react';
import { Search, Play, Pause, Disc3, Music } from 'lucide-react';
import { SoundtrackData } from '../../types/app';
import { SOUNDTRACK_FALLBACK_TRACKS } from '../../data/cardsVault';

interface Card06Props {
  mode: 'create' | 'reveal';
  data: SoundtrackData;
  playerName: string;
  partnerName: string;
  onChange: (updated: SoundtrackData) => void;
}

interface ItunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  artworkUrl100: string;
  previewUrl: string;
}

const MOOD_TAGS = [
  'Instant Good Mood',
  'Main Character Energy',
  'Late Night Drive',
  'Sunday Morning Coffee',
  'High School Nostalgia'
];

export const Card06Soundtrack: React.FC<Card06Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ItunesTrack[]>([]);
  const [searching, setSearching] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&entity=song&limit=5`
      );
      const json = await res.json();
      setResults(json.results || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  };

  const togglePlayPreview = (previewUrl: string) => {
    if (!previewUrl) return;
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      return;
    }
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(previewUrl);
    audioRef.current = audio;
    audio.onended = () => setIsPlaying(false);
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  };

  const handleSelectTrack = (t: ItunesTrack) => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    onChange({
      ...data,
      trackName: t.trackName,
      artistName: t.artistName,
      artworkUrl: t.artworkUrl100.replace('100x100bb', '600x600bb'),
      previewUrl: t.previewUrl
    });
    setResults([]);
  };

  if (mode === 'reveal') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Tactile 45rpm Vinyl Sleeve */}
        <div
          style={{
            background: '#1E161A',
            color: '#FAF6F0',
            borderRadius: 24,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 14,
            boxShadow: '0 16px 36px rgba(30, 22, 26, 0.2)'
          }}
        >
          <span
            className="stamp-badge"
            style={{
              background: 'rgba(224, 90, 71, 0.2)',
              color: '#FF9E8E'
            }}
          >
            {data.moodTag || 'Table Soundtrack'}
          </span>

          {/* Spinning Record */}
          <div
            onClick={() => togglePlayPreview(data.previewUrl)}
            style={{
              position: 'relative',
              width: 176,
              height: 176,
              borderRadius: '50%',
              background:
                'radial-gradient(circle, #2a2125 0%, #120e10 60%, #261e21 62%, #0d0a0c 100%)',
              border: '4px solid #35292E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 30px rgba(0,0,0,0.45)',
              cursor: data.previewUrl ? 'pointer' : 'default',
              animation: isPlaying ? 'spin 4s linear infinite' : 'none'
            }}
          >
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            {data.artworkUrl ? (
              <img
                src={data.artworkUrl}
                alt={data.trackName}
                style={{
                  width: 78,
                  height: 78,
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #E05A47'
                }}
              />
            ) : (
              <Disc3 size={48} color="#E05A47" />
            )}
            <div
              style={{
                position: 'absolute',
                width: 14,
                height: 14,
                borderRadius: '50%',
                background: '#1E161A',
                border: '2px solid #FAF6F0'
              }}
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <h3
              className="font-display"
              style={{ margin: 0, fontSize: '1.35rem', color: '#FAF6F0' }}
            >
              {data.trackName}
            </h3>
            <div
              style={{
                fontSize: '0.88rem',
                color: '#D5C5A8',
                marginTop: 2
              }}
            >
              {data.artistName}
            </div>
          </div>

          {data.previewUrl ? (
            <button
              type="button"
              onClick={() => togglePlayPreview(data.previewUrl)}
              className="btn-primary-brass"
              style={{ padding: '10px 22px', fontSize: '0.86rem' }}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              <span>
                {isPlaying ? 'Pause 45rpm Spin' : 'Play 25s Chorus Snippet'}
              </span>
            </button>
          ) : (
            <div style={{ fontSize: '0.76rem', color: '#B9AC9E' }}>
              (Hum the chorus or pull it up on your phone!)
            </div>
          )}

          {data.whyNote && (
            <div
              className="font-hand"
              style={{
                fontSize: '1.3rem',
                color: '#FAF6F0',
                textAlign: 'center',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                paddingTop: 10,
                width: '100%'
              }}
            >
              “{data.whyNote}” — {playerName}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Selected Track Preview Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: 12,
          borderRadius: 18,
          background: '#1E161A',
          color: '#FAF6F0'
        }}
      >
        {data.artworkUrl ? (
          <img
            src={data.artworkUrl}
            alt={data.trackName}
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              objectFit: 'cover'
            }}
          />
        ) : (
          <div
            style={{
              width: 54,
              height: 54,
              borderRadius: 12,
              background: '#35292E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Music size={24} color="#E05A47" />
          </div>
        )}

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#FF9E8E',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}
          >
            Queued on Turntable
          </div>
          <div
            style={{
              fontWeight: 700,
              fontSize: '0.96rem',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {data.trackName}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#D5C5A8' }}>
            {data.artistName}
          </div>
        </div>

        {data.previewUrl && (
          <button
            type="button"
            onClick={() => togglePlayPreview(data.previewUrl)}
            style={{
              width: 38,
              height: 38,
              borderRadius: '50%',
              border: 'none',
              background: 'var(--accent-rose)',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
        )}
      </div>

      {/* Live iTunes Song Search */}
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          className="paper-input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Search any song or artist..."
          style={{ flex: 1 }}
        />
        <button
          type="button"
          onClick={() => handleSearch()}
          className="btn-paper-pill"
          style={{
            background: 'var(--ink-primary)',
            color: '#FFFFFF',
            padding: '0 16px',
            flexShrink: 0
          }}
        >
          <Search size={15} />
          <span>{searching ? '...' : 'Find'}</span>
        </button>
      </div>

      {/* Search Results */}
      {results.length > 0 && (
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: 16,
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-pill)',
            overflow: 'hidden'
          }}
        >
          {results.map((t) => (
            <button
              key={t.trackId}
              type="button"
              onClick={() => handleSelectTrack(t)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 12px',
                border: 'none',
                borderBottom: '1px solid var(--border-hairline)',
                background: 'transparent',
                textAlign: 'left',
                cursor: 'pointer'
              }}
            >
              <img
                src={t.artworkUrl100}
                alt=""
                style={{ width: 38, height: 38, borderRadius: 8 }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--ink-primary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {t.trackName}
                </div>
                <div
                  style={{
                    fontSize: '0.73rem',
                    color: 'var(--ink-secondary)'
                  }}
                >
                  {t.artistName}
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: 'var(--accent-rose)'
                }}
              >
                Pick
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Quick Fallback Curated Tracks */}
      <div>
        <div
          style={{
            fontSize: '0.73rem',
            fontWeight: 600,
            color: 'var(--ink-muted)',
            marginBottom: 6
          }}
        >
          Or tap a classic starter record:
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {SOUNDTRACK_FALLBACK_TRACKS.map((fb) => (
            <button
              key={fb.trackName}
              type="button"
              onClick={() =>
                onChange({
                  ...data,
                  trackName: fb.trackName,
                  artistName: fb.artistName,
                  artworkUrl: fb.artworkUrl,
                  moodTag: fb.moodTag
                })
              }
              style={{
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
              🎵 {fb.trackName} — {fb.artistName}
            </button>
          ))}
        </div>
      </div>

      {/* Mood Tag Chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {MOOD_TAGS.map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => onChange({ ...data, moodTag: m })}
            style={{
              padding: '5px 11px',
              borderRadius: 999,
              border:
                data.moodTag === m
                  ? '1.5px solid var(--accent-berry)'
                  : '1px solid var(--border-hairline)',
              background:
                data.moodTag === m
                  ? 'var(--surface-berry-tint)'
                  : 'var(--surface-subtle)',
              color:
                data.moodTag === m
                  ? 'var(--accent-berry)'
                  : 'var(--ink-secondary)',
              fontSize: '0.72rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {m}
          </button>
        ))}
      </div>

      <input
        type="text"
        className="paper-input"
        value={data.whyNote}
        onChange={(e) => onChange({ ...data, whyNote: e.target.value })}
        placeholder="Why this song? (e.g., Roadtrip across Utah at sunset)..."
        maxLength={70}
      />
    </div>
  );
};
