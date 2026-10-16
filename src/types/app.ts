export type CardId =
  | 'napkin-sketch'
  | 'camera-roll'
  | 'drop-pin'
  | 'memories-daydream'
  | 'gut-read'
  | 'soundtrack'
  | 'emoji-pitch'
  | 'brain-pie'
  | 'spicy-hill'
  | 'two-brains'
  | 'dealers-choice';

export type ExperiencePackId =
  | 'pack-1-napkin'
  | 'pack-2-spark'
  | 'pack-3-classic'
  | 'pack-4-full'
  | 'pack-5-mix';

export type PackId = ExperiencePackId;

export interface NapkinSketchData {
  imageDataUrl: string;
  caption: string;
  promptUsed: string;
}

export interface CameraRollData {
  photoDataUrl: string;
  caption: string;
  promptUsed: string;
}

export interface DropPinData {
  lat: number;
  lng: number;
  zoom: number;
  label: string;
  promptVibe: string;
}

export interface MemoriesDaydreamData {
  items: [string, string, string];
  daydreamIndex: 0 | 1 | 2;
}

export interface GutReadData {
  targetPerson?: string;
  stemIndex: number;
  prediction: string;
  accuracyStamp: 'scary-accurate' | 'painfully-close' | 'totally-wrong' | null;
}

export interface SoundtrackData {
  trackName: string;
  artistName: string;
  artworkUrl: string;
  previewUrl: string;
  moodTag: string;
  whyNote: string;
}

export interface EmojiPitchData {
  emojis: [string, string, string];
  storyTitle: string;
}

export interface BrainSlice {
  id: string;
  label: string;
  percent: number;
  color: string;
}

export interface BrainPieData {
  slices: BrainSlice[];
}

export interface SpicyHillData {
  opinion: string;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  partnerReaction: 'agree' | 'fight-me' | 'divided' | null;
}

export interface TwoBrainsData {
  promptIndex?: number;
  sketchDataUrl: string;
  caption: string;
}

export interface DealersChoiceData {
  selectedPromptId: string;
  QuickNote: string;
}

export interface PlayerResponses {
  'napkin-sketch': NapkinSketchData;
  'camera-roll': CameraRollData;
  'drop-pin': DropPinData;
  'memories-daydream': MemoriesDaydreamData;
  'gut-read': GutReadData;
  soundtrack: SoundtrackData;
  'emoji-pitch': EmojiPitchData;
  'brain-pie': BrainPieData;
  'spicy-hill': SpicyHillData;
  'two-brains': TwoBrainsData;
  'dealers-choice': DealersChoiceData;
}

export interface PlayerState {
  id: string;
  name: string;
  responses: PlayerResponses;
}

export interface TableSessionState {
  createdAt: number;
  packId: ExperiencePackId;
  activeCardIds: CardId[];
  sharedTwoBrainsPrompt: string;
  players: PlayerState[];
}

export interface CardVaultMeta {
  id: CardId;
  number: number;
  title: string;
  shortTitle: string;
  subtitle: string;
  timerSeconds: number;
  badge: string;
  iconName: string;
  accentColor: string;
  creationInstruction: string;
  revealInstruction: string;
}

export interface ExperiencePackMeta {
  id: ExperiencePackId;
  optionNumber: number;
  title: string;
  subtitle: string;
  cardCountLabel: string;
  sprintTimeLabel: string;
  convoTimeLabel: string;
  description: string;
  defaultCardIds: CardId[];
  featured?: boolean;
  isCustomMix?: boolean;
}
