import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapPin, Compass, Globe, Sparkles } from 'lucide-react';
import { DropPinData } from '../../types/app';

interface Card03Props {
  mode: 'create' | 'reveal';
  data: DropPinData;
  playerName: string;
  partnerName: string;
  onChange: (updated: DropPinData) => void;
}

const QUICK_DESTINATIONS = [
  { name: 'Kyoto, Japan', lat: 35.0116, lng: 135.7681 },
  { name: 'Lisbon, Portugal', lat: 38.7223, lng: -9.1393 },
  { name: 'New York City', lat: 40.7306, lng: -73.9352 },
  { name: 'Big Sur, California', lat: 36.2704, lng: -121.8081 },
  { name: 'Mexico City', lat: 19.4326, lng: -99.1332 },
  { name: 'Reykjavik, Iceland', lat: 64.1466, lng: -21.9426 }
];

const VIBE_PROMPTS = [
  'Happiest memory on Earth',
  'Where I felt most alive',
  'Best meal of my life',
  'Take me here next year'
];

export const Card03DropPin: React.FC<Card03Props> = ({
  mode,
  data,
  playerName,
  onChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.CircleMarker | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [isSatellite, setIsSatellite] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const initialZoom = mode === 'reveal' ? Math.max(data.zoom, 5) : data.zoom;
    const map = L.map(mapContainerRef.current, {
      center: [data.lat, data.lng],
      zoom: initialZoom,
      zoomControl: true
    });

    const streetUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const layer = L.tileLayer(streetUrl, {
      maxZoom: 18,
      attribution: '© OpenStreetMap'
    }).addTo(map);
    tileLayerRef.current = layer;

    const marker = L.circleMarker([data.lat, data.lng], {
      radius: 10,
      fillColor: '#E05A47',
      color: '#FFFFFF',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.95
    }).addTo(map);
    markerRef.current = marker;

    if (mode === 'create') {
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        onChange({
          ...data,
          lat: Number(lat.toFixed(4)),
          lng: Number(lng.toFixed(4)),
          zoom: map.getZoom()
        });
      });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const handleJumpToCity = (city: {
    name: string;
    lat: number;
    lng: number;
  }) => {
    const map = mapInstanceRef.current;
    if (map && markerRef.current) {
      map.flyTo([city.lat, city.lng], 11, { duration: 1.2 });
      markerRef.current.setLatLng([city.lat, city.lng]);
    }
    onChange({
      ...data,
      lat: city.lat,
      lng: city.lng,
      zoom: 11,
      label: city.name
    });
  };

  const handleFlyInSatellite = () => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;
    const nextSat = !isSatellite;
    setIsSatellite(nextSat);
    const url = nextSat
      ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
      : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    tileLayerRef.current.setUrl(url);
    map.flyTo([data.lat, data.lng], nextSat ? 14 : 6, { duration: 1.5 });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Clean Boarding Pass Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 14px',
          background: 'var(--surface-subtle)',
          borderRadius: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={15} color="var(--accent-rose)" />
          <span
            style={{
              fontWeight: 700,
              fontSize: '0.84rem',
              color: 'var(--ink-primary)'
            }}
          >
            {data.label || 'Pinned Coordinates'}
          </span>
        </div>
        <span
          className="font-mono"
          style={{
            fontSize: '0.72rem',
            color: 'var(--ink-muted)'
          }}
        >
          {data.lat.toFixed(2)}°, {data.lng.toFixed(2)}°
        </span>
      </div>

      {/* Interactive Map Container */}
      <div
        style={{
          position: 'relative',
          height: 240,
          width: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-pill)'
        }}
      >
        <div
          ref={mapContainerRef}
          style={{ width: '100%', height: '100%' }}
        />

        {mode === 'reveal' && (
          <button
            type="button"
            onClick={handleFlyInSatellite}
            style={{
              position: 'absolute',
              bottom: 12,
              right: 12,
              zIndex: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              background: 'var(--accent-rose)',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontWeight: 700,
              boxShadow: '0 4px 14px rgba(224, 90, 71, 0.35)',
              cursor: 'pointer'
            }}
          >
            <Globe size={14} />
            <span>
              {isSatellite ? 'Switch to Street Map' : 'Fly Me In (Satellite)'}
            </span>
          </button>
        )}
      </div>

      {mode === 'create' ? (
        <>
          {/* Quick City Jump Chips */}
          <div>
            <div
              style={{
                fontSize: '0.73rem',
                fontWeight: 600,
                color: 'var(--ink-muted)',
                marginBottom: 6
              }}
            >
              Tap anywhere on the map to drop your pin, or quick-jump:
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {QUICK_DESTINATIONS.map((c) => (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => handleJumpToCity(c)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: 999,
                    border:
                      data.label === c.name
                        ? '1.5px solid var(--accent-sage)'
                        : '1px solid var(--border-subtle)',
                    background:
                      data.label === c.name
                        ? 'rgba(47, 122, 94, 0.1)'
                        : '#FFFFFF',
                    color:
                      data.label === c.name
                        ? 'var(--accent-sage)'
                        : 'var(--ink-primary)',
                    fontSize: '0.73rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* Memory Vibe Chip Selector */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {VIBE_PROMPTS.map((vp) => (
              <button
                key={vp}
                type="button"
                onClick={() => onChange({ ...data, promptVibe: vp })}
                style={{
                  padding: '5px 11px',
                  borderRadius: 999,
                  border:
                    data.promptVibe === vp
                      ? '1.5px solid var(--accent-rose)'
                      : '1px solid var(--border-hairline)',
                  background:
                    data.promptVibe === vp
                      ? 'var(--accent-rose-soft)'
                      : 'var(--surface-subtle)',
                  color:
                    data.promptVibe === vp
                      ? 'var(--accent-rose-deep)'
                      : 'var(--ink-secondary)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                <Sparkles
                  size={10}
                  style={{ marginRight: 4, display: 'inline' }}
                />
                {vp}
              </button>
            ))}
          </div>

          <input
            type="text"
            className="paper-input"
            value={data.label}
            onChange={(e) => onChange({ ...data, label: e.target.value })}
            placeholder="Name the spot or memory (e.g., Late-night tacos in Oaxaca)..."
            maxLength={65}
          />
        </>
      ) : (
        <div
          style={{
            background: 'var(--surface-subtle)',
            borderRadius: 18,
            padding: '14px 16px',
            border: '1px solid var(--border-hairline)'
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.74rem',
              fontWeight: 700,
              color: 'var(--accent-sage)',
              marginBottom: 4
            }}
          >
            <Compass size={14} />
            <span>{data.promptVibe}</span>
          </div>
          <div
            className="font-display"
            style={{
              fontSize: '1.15rem',
              fontWeight: 600,
              color: 'var(--ink-primary)'
            }}
          >
            “{data.label || `${playerName}'s secret spot`}”
          </div>
        </div>
      )}
    </div>
  );
};
