import { PlayerResponses, TableSessionState } from '../types/app';
import {
  CAMERA_ROLL_PROMPTS,
  DEALERS_CHOICE_PROMPTS,
  GUT_READ_STEMS,
  NAPKIN_IDEA_PROMPTS,
  SOUNDTRACK_FALLBACK_TRACKS,
  SPICY_HILL_STARTERS
} from '../data/cardsVault';

const DEFAULT_PIN_SPOTS = [
  { lat: 38.7223, lng: -9.1393, label: 'Lisbon, Portugal' },
  { lat: 35.0116, lng: 135.7681, label: 'Kyoto, Japan' },
  { lat: 17.0732, lng: -96.7266, label: 'Oaxaca, Mexico' },
  { lat: 45.4408, lng: 12.3155, label: 'Venice, Italy' }
];

const DEFAULT_EMOJI_TRIADS: [string, string, string][] = [
  ['✈️', '🧳', '🍜'],
  ['🏕️', '🌧️', '🍷'],
  ['🎤', '🚕', '🌅'],
  ['🐕', '🏖️', '🍦']
];

export function createDefaultPlayerResponses(seedIndex = 0): PlayerResponses {
  const fallbackTrack =
    SOUNDTRACK_FALLBACK_TRACKS[seedIndex % SOUNDTRACK_FALLBACK_TRACKS.length];
  const pinSpot = DEFAULT_PIN_SPOTS[seedIndex % DEFAULT_PIN_SPOTS.length];
  const stemIdx = seedIndex % GUT_READ_STEMS.length;

  return {
    'napkin-sketch': {
      imageDataUrl: '',
      caption: '',
      promptUsed: NAPKIN_IDEA_PROMPTS[seedIndex % NAPKIN_IDEA_PROMPTS.length]
    },
    'camera-roll': {
      photoDataUrl: '',
      caption: '',
      promptUsed: CAMERA_ROLL_PROMPTS[seedIndex % CAMERA_ROLL_PROMPTS.length]
    },
    'drop-pin': {
      lat: pinSpot.lat,
      lng: pinSpot.lng,
      zoom: 5,
      label: pinSpot.label,
      promptVibe: 'Happiest memory on Earth'
    },
    'memories-daydream': {
      items: [
        seedIndex % 2 === 0
          ? 'Got locked inside a museum after closing'
          : 'Road-tripped down the coast with no hotel booked',
        seedIndex % 2 === 0
          ? 'Cooked dinner for 12 people during a power outage'
          : 'Accidentally joined a wedding parade in Oaxaca',
        seedIndex % 2 === 0
          ? 'Rent a tiny stone house in Italy for a month'
          : 'Learn to sail across the Greek islands'
      ],
      daydreamIndex: 2
    },
    'gut-read': {
      targetPerson: '',
      stemIndex: stemIdx,
      prediction: GUT_READ_STEMS[stemIdx].chips[0],
      accuracyStamp: null
    },
    soundtrack: {
      trackName: fallbackTrack.trackName,
      artistName: fallbackTrack.artistName,
      artworkUrl: fallbackTrack.artworkUrl,
      previewUrl: fallbackTrack.previewUrl,
      moodTag: fallbackTrack.moodTag,
      whyNote: ''
    },
    'emoji-pitch': {
      emojis: [...DEFAULT_EMOJI_TRIADS[seedIndex % DEFAULT_EMOJI_TRIADS.length]] as [
        string,
        string,
        string
      ],
      storyTitle: ''
    },
    'brain-pie': {
      slices: [
        {
          id: 's1',
          label: 'Songs stuck in my head',
          percent: 35,
          color: '#E05A47'
        },
        {
          id: 's2',
          label: 'Planning my next trip',
          percent: 30,
          color: '#D4953A'
        },
        {
          id: 's3',
          label: 'Thinking about food',
          percent: 20,
          color: '#2F7A5E'
        },
        {
          id: 's4',
          label: 'Side projects & big ideas',
          percent: 15,
          color: '#6E2E53'
        }
      ]
    },
    'spicy-hill': {
      opinion: SPICY_HILL_STARTERS[seedIndex % SPICY_HILL_STARTERS.length],
      spiceLevel: 3,
      partnerReaction: null
    },
    'two-brains': {
      promptIndex: 0,
      sketchDataUrl: '',
      caption: ''
    },
    'dealers-choice': {
      selectedPromptId:
        DEALERS_CHOICE_PROMPTS[seedIndex % DEALERS_CHOICE_PROMPTS.length].id,
      QuickNote: ''
    }
  };
}

export function encodePartnerDeckCode(
  playerName: string,
  responses: PlayerResponses
): string {
  try {
    const slim: PlayerResponses = {
      ...responses,
      'napkin-sketch': {
        ...responses['napkin-sketch'],
        imageDataUrl: ''
      },
      'camera-roll': {
        ...responses['camera-roll'],
        photoDataUrl: ''
      },
      'two-brains': {
        ...responses['two-brains'],
        sketchDataUrl: ''
      }
    };
    const payload = JSON.stringify({ n: playerName, r: slim });
    return btoa(encodeURIComponent(payload));
  } catch {
    return '';
  }
}

export function decodePartnerDeckCode(
  code: string
): { playerName: string; responses: PlayerResponses } | null {
  try {
    const clean = code.trim();
    if (!clean) return null;
    const jsonStr = decodeURIComponent(atob(clean));
    const parsed = JSON.parse(jsonStr);
    if (!parsed || !parsed.r) return null;
    return {
      playerName: parsed.n || 'Guest',
      responses: {
        ...createDefaultPlayerResponses(1),
        ...parsed.r
      }
    };
  } catch {
    return null;
  }
}

export function buildShareableUrlWithSession(session: TableSessionState): string {
  try {
    const url = new URL(window.location.href);
    url.searchParams.set('pack', session.packId);
    url.searchParams.set('cards', session.activeCardIds.join(','));
    if (session.players[0]?.name) {
      url.searchParams.set('host', session.players[0].name);
    }
    return url.toString();
  } catch {
    return window.location.href;
  }
}
