import { CardId, CardVaultMeta, ExperiencePackMeta } from '../types/app';

export const CARDS_VAULT: Record<CardId, CardVaultMeta> = {
  'napkin-sketch': {
    id: 'napkin-sketch',
    number: 1,
    title: 'The 60-Second Napkin Sketch',
    shortTitle: 'Napkin Sketch',
    subtitle: 'Draw something you want to show the table—a memory, a place, your week, or a ridiculous scene.',
    timerSeconds: 60,
    badge: '60s Finger Sketch',
    iconName: 'PenTool',
    accentColor: '#E05A47',
    creationInstruction: 'Use your finger! The worse the drawing, the funnier the story.',
    revealInstruction: 'Slide your phone out to the table: have everyone guess what is happening before you tell the story.'
  },
  'camera-roll': {
    id: 'camera-roll',
    number: 2,
    title: "Show, Don't Tell",
    shortTitle: 'Camera Roll',
    subtitle: 'Grab a real photo from your camera roll that makes zero sense without a 30-second backstory.',
    timerSeconds: 45,
    badge: '45s Photo Story',
    iconName: 'Camera',
    accentColor: '#D4953A',
    creationInstruction: 'Pick a photo from your library (timer pauses while picking) & add a teaser hint.',
    revealInstruction: 'Tap the Polaroid to unblur and share the real moment behind the shot.'
  },
  'drop-pin': {
    id: 'drop-pin',
    number: 3,
    title: 'Drop a Pin ("Take Me Somewhere")',
    shortTitle: 'Drop a Pin',
    subtitle: 'Spin the map and drop a single pin anywhere on Earth that holds a story for you.',
    timerSeconds: 30,
    badge: '30s World Pin',
    iconName: 'MapPin',
    accentColor: '#2F7A5E',
    creationInstruction: 'Pan the map or jump to a city, drop your pin in the center, and name the memory.',
    revealInstruction: 'Tap "Fly Us In" to swoop into Satellite view and walk everyone around that spot.'
  },
  'memories-daydream': {
    id: 'memories-daydream',
    number: 4,
    title: 'Two Memories & A Daydream',
    shortTitle: '2 Memories & Daydream',
    subtitle: 'Two real micro-stories from your past, and one secret wish you want to do next.',
    timerSeconds: 60,
    badge: '60s Story Trio',
    iconName: 'Sparkles',
    accentColor: '#6E2E53',
    creationInstruction: 'Write 3 short headlines and mark which ONE is the unlived Daydream.',
    revealInstruction: 'Read all three out loud—have the table vote & tap the one they think is the Daydream!'
  },
  'gut-read': {
    id: 'gut-read',
    number: 5,
    title: 'The Playful Gut-Read',
    shortTitle: 'Playful Gut-Read',
    subtitle: 'Make a harmless, playful first-impression guess about someone sitting at the table.',
    timerSeconds: 45,
    badge: '45s First Impression',
    iconName: 'Eye',
    accentColor: '#3B5BDB',
    creationInstruction: 'Pick who at the table this read is for, choose a prompt stem, and lock in your gut instinct.',
    revealInstruction: 'They stamp your guess: Scary Accurate, Painfully Close, or Way Off!'
  },
  'soundtrack': {
    id: 'soundtrack',
    number: 6,
    title: 'The 30-Second Soundtrack',
    shortTitle: '30s Soundtrack',
    subtitle: 'Queue one song that matches your week, your current mood, or a great memory.',
    timerSeconds: 45,
    badge: '45s Vinyl Spin',
    iconName: 'Disc3',
    accentColor: '#6E2E53',
    creationInstruction: 'Search any real song (or tap a mood starter) and jot why you picked it.',
    revealInstruction: 'Spin the 45rpm record to play a real 25-second chorus snippet right on the table.'
  },
  'emoji-pitch': {
    id: 'emoji-pitch',
    number: 7,
    title: 'The 3-Emoji Story Pitch',
    shortTitle: '3-Emoji Pitch',
    subtitle: 'Summarize a wild true story from your life—or your ideal weekend—in exactly 3 emojis.',
    timerSeconds: 30,
    badge: '30s Emoji Pitch',
    iconName: 'SmilePlus',
    accentColor: '#D4953A',
    creationInstruction: 'Pick 3 emojis and hide the real story headline on the back of the coaster.',
    revealInstruction: 'Let the table guess the plot from the 3 emojis, then flip the coaster to reveal the title!'
  },
  'brain-pie': {
    id: 'brain-pie',
    number: 8,
    title: 'The Pie Chart of My Brain',
    shortTitle: 'Brain Pie Chart',
    subtitle: 'Slice up what has actually been taking up space in your head this week.',
    timerSeconds: 45,
    badge: '45s Brain Slicer',
    iconName: 'PieChart',
    accentColor: '#E05A47',
    creationInstruction: 'Adjust the slices and label what is really occupying your brain lately.',
    revealInstruction: 'Tap each slice on the wheel to unpack what your week actually feels like.'
  },
  'spicy-hill': {
    id: 'spicy-hill',
    number: 9,
    title: 'The Spicy Hill Slider',
    shortTitle: 'Spicy Hill',
    subtitle: 'One completely harmless unpopular opinion you will gladly defend to the table.',
    timerSeconds: 30,
    badge: '30s Hot Take',
    iconName: 'Flame',
    accentColor: '#E05A47',
    creationInstruction: 'Write your harmless hot take and drag the chili meter to set your heat level.',
    revealInstruction: 'Have the table stamp AGREE, FIGHT ME, or TABLE DIVIDED on your ticket!'
  },
  'two-brains': {
    id: 'two-brains',
    number: 10,
    title: 'Same Prompt, Different Brains',
    shortTitle: 'Same Prompt Sketch',
    subtitle: 'Everyone gets the exact same playful prompt and reacts in their own way—compare phones on the table.',
    timerSeconds: 45,
    badge: '45s Shared Prompt',
    iconName: 'Split',
    accentColor: '#3B5BDB',
    creationInstruction: 'Pick the same Prompt # as the table and sketch your take without peeking!',
    revealInstruction: 'Put your phones side-by-side in the middle of the table to see how differently everyone thinks.'
  },
  'dealers-choice': {
    id: 'dealers-choice',
    number: 11,
    title: "Dealer's Choice (Joe Hudson Spin)",
    shortTitle: "Dealer's Choice",
    subtitle: 'Choose your own direction from 8 classic icebreakers spun to spark real stories.',
    timerSeconds: 45,
    badge: '45s Pick Your Path',
    iconName: 'Compass',
    accentColor: '#2F7A5E',
    creationInstruction: 'Pick the 1 question that calls to you and jot a short story cue.',
    revealInstruction: 'Even the question you chose tells a story—share what came up for you.'
  }
};

export const ALL_CARD_IDS: CardId[] = [
  'napkin-sketch',
  'camera-roll',
  'drop-pin',
  'memories-daydream',
  'gut-read',
  'soundtrack',
  'emoji-pitch',
  'brain-pie',
  'spicy-hill',
  'two-brains',
  'dealers-choice'
];

export const EXPERIENCE_PACKS: ExperiencePackMeta[] = [
  {
    id: 'pack-1-napkin',
    optionNumber: 1,
    title: 'The Cocktail Napkin',
    subtitle: 'Just the signature 60-second finger sketch & story.',
    cardCountLabel: '1 Card',
    sprintTimeLabel: '60s create',
    convoTimeLabel: '5–10m talk',
    description: 'Zero commitment, instant laugh. Draw something in 60 seconds with your finger, slide your phone out to the table, and tell the story.',
    defaultCardIds: ['napkin-sketch']
  },
  {
    id: 'pack-2-spark',
    optionNumber: 2,
    title: 'The Quick Spark',
    subtitle: 'Draw → Guess → Choose. Fast, punchy coffee, date, or group warm-up.',
    cardCountLabel: '3 Cards',
    sprintTimeLabel: '~2m create',
    convoTimeLabel: '15–25m talk',
    description: 'Moves from a disarming finger-sketch to a 3-emoji story guessing game and lands on a personal Dealer’s Choice prompt.',
    defaultCardIds: ['napkin-sketch', 'emoji-pitch', 'dealers-choice']
  },
  {
    id: 'pack-3-classic',
    optionNumber: 3,
    title: 'The Table Classic',
    subtitle: 'Laughter, a place you love, playful debate, and a shared prompt finale.',
    cardCountLabel: '4 Cards',
    sprintTimeLabel: '~3m create',
    convoTimeLabel: '30–45m talk',
    description: 'Our signature 4-card arc for dates, friends, or a whole table: 60s Napkin Sketch, Drop a Pin anywhere on Earth, Spicy Hill Slider, and Same Prompt Different Brains.',
    defaultCardIds: ['napkin-sketch', 'drop-pin', 'spicy-hill', 'two-brains'],
    featured: true
  },
  {
    id: 'pack-4-full',
    optionNumber: 4,
    title: 'The Full Table',
    subtitle: 'Carries a whole evening—from terrible drawings to camera roll stories & dreams.',
    cardCountLabel: '5 Cards',
    sprintTimeLabel: '~4m create',
    convoTimeLabel: '45–90m talk',
    description: 'The complete 5-course ritual: Napkin Sketch, Camera Roll Scavenger, Brain Pie Chart, Two Memories & A Daydream, and Playful Gut-Read.',
    defaultCardIds: ['napkin-sketch', 'camera-roll', 'brain-pie', 'memories-daydream', 'gut-read']
  },
  {
    id: 'pack-5-mix',
    optionNumber: 5,
    title: 'Table Mix / Surprise Us',
    subtitle: 'Keep the shared experience while dealing a custom or random lineup from all 11 cards.',
    cardCountLabel: 'Custom / Shuffle',
    sprintTimeLabel: 'You choose',
    convoTimeLabel: 'Replayable',
    description: 'Card #1 is locked to the Napkin Sketch—then roll the dice for 3 surprise cards or tap any cards from the 11-card vault for the table.',
    defaultCardIds: ['napkin-sketch', 'soundtrack', 'brain-pie', 'dealers-choice'],
    isCustomMix: true
  }
];

export const NAPKIN_IDEA_PROMPTS = [
  'Draw the highlight of your week so far',
  'Draw your absolute happy place',
  'Draw a funny childhood memory',
  'Draw your dream Saturday morning',
  'Draw an animal or pet you love (badly)',
  'Draw something weird that happened to you recently',
  'Draw a meal you could eat every week forever'
];

export const CAMERA_ROLL_PROMPTS = [
  'A photo from the last year that makes zero sense without a 30-second backstory',
  'A moment where you felt completely in your element',
  'The last photo you took purely because it made you smile',
  'A place you visited that you still think about'
];

export const GUT_READ_STEMS = [
  {
    stem: 'As a 10-year-old, I bet you were the kid who...',
    chips: [
      'Read under the covers with a flashlight',
      'Organized elaborate neighborhood games',
      'Took apart appliances to see how they worked',
      'Negotiated bedtime like a trial lawyer'
    ]
  },
  {
    stem: 'In a heist movie, your specific job on the crew is definitely...',
    chips: [
      'The Smooth Talker distracting security',
      'The Getaway Driver with a curated playlist',
      'The Mastermind with color-coded blueprints',
      'The Wildcard who improvises when plans break'
    ]
  },
  {
    stem: 'If you had a secret nerd obsession, I’d guess it’s...',
    chips: [
      'Specialty coffee or fermentation science',
      'Obscure movie trivia or lore',
      'Maps, architecture, or travel routes',
      'Niche music history or vinyl collecting'
    ]
  },
  {
    stem: 'Your ideal Sunday morning probably looks like...',
    chips: [
      'Slow coffee, pastry walk, and zero alarms',
      'Up early for a trail run or sunrise adventure',
      'Cooking a massive breakfast with music blasting',
      'Lost in a creative rabbit hole for four hours'
    ]
  },
  {
    stem: 'If you won a trophy tomorrow, it would be for...',
    chips: [
      'Making strangers feel instantly comfortable',
      'Finding the best hidden spot in any neighborhood',
      'Turning minor chaos into a great story',
      'Unreasonable loyalty to your favorite people'
    ]
  }
];

export const TWO_BRAINS_SHARED_PROMPTS = [
  'Draw what a 10/10 Sunday looks like to you',
  'Draw your internal reaction when plans get canceled last minute',
  'Stranded on a desert island: draw the 3 things you are bringing',
  'Draw your current week as a weather forecast',
  'Draw your brain before coffee vs. after coffee'
];

export interface DealersChoicePromptOption {
  id: string;
  hookBadge: string;
  classicOrigin: string;
  question: string;
}

export const DEALERS_CHOICE_PROMPTS: DealersChoicePromptOption[] = [
  {
    id: 'advice-spin',
    hookBadge: '🧭 Best / Ignored Advice',
    classicOrigin: 'Spin on: "Best advice you ever got"',
    question: "The best advice I ever received—or the 'good advice' I’m happiest I ignored."
  },
  {
    id: 'cheat-code',
    hookBadge: '🗝️ Life Cheat-Code',
    classicOrigin: 'Spin on: "One thing everyone should know"',
    question: 'One life cheat-code I had to learn the hard way.'
  },
  {
    id: 'mind-change',
    hookBadge: '🔄 Total 180°',
    classicOrigin: 'Spin on: "What are your tastes?"',
    question: 'Something I used to judge or dislike that I now genuinely love.'
  },
  {
    id: 'happy-detour',
    hookBadge: '🛤️ Lucky Detour',
    classicOrigin: 'Spin on: "Biggest accomplishment"',
    question: "A 'failure' or wrong turn that turned out to be one of the best things that happened to me."
  },
  {
    id: 'flow-state',
    hookBadge: '⏳ Time Warp',
    classicOrigin: 'Spin on: "What do you do for fun?"',
    question: 'Something that makes me completely lose track of time.'
  },
  {
    id: 'instant-home',
    hookBadge: '🏠 User Manual',
    classicOrigin: 'Spin on: "How do you connect?"',
    question: 'The fastest way to make me feel at home (or how to tell when I’m genuinely excited).'
  },
  {
    id: 'plot-twist',
    hookBadge: '🕵️ First-Impression Plot Twist',
    classicOrigin: 'Spin on: "Fun fact about me"',
    question: 'Something true about me that almost nobody guesses on a first meeting.'
  },
  {
    id: 'tiny-luxury',
    hookBadge: '☕ $5 Obsession',
    classicOrigin: 'Spin on: "Simple pleasures"',
    question: 'A free or $5 pleasure in life that I take way too seriously.'
  }
];

export const SPICY_HILL_STARTERS = [
  'Breakfast food is 10x better at 10 PM than at 8 AM.',
  'Going to the movie theater alone is an elite human experience.',
  'Voice notes over 90 seconds should require a podcast license.',
  'Soup is not a real meal unless bread is doing 60% of the work.',
  'Window seat beats aisle seat on every flight under 6 hours.',
  'The best part of any party is the side conversation in the kitchen.'
];

export const SOUNDTRACK_FALLBACK_TRACKS = [
  {
    trackName: 'September',
    artistName: 'Earth, Wind & Fire',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music125/v4/6b/78/42/6b78428d-8e56-1635-4176-6f0b0047a744/886444606509.jpg/600x600bb.jpg',
    previewUrl: '',
    moodTag: 'Instant Good Mood'
  },
  {
    trackName: 'Dreams',
    artistName: 'Fleetwood Mac',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/4d/1b/1f/4d1b1f1d-0861-5832-3911-36515c36c077/081227970949.jpg/600x600bb.jpg',
    previewUrl: '',
    moodTag: 'Golden Hour Drive'
  },
  {
    trackName: 'Midnight City',
    artistName: 'M83',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/c2/21/0a/c2210a08-941a-034a-9454-1695c260454f/724596951255.jpg/600x600bb.jpg',
    previewUrl: '',
    moodTag: 'Main Character Energy'
  },
  {
    trackName: 'Put Your Records On',
    artistName: 'Corinne Bailey Rae',
    artworkUrl: 'https://is1-ssl.mzstatic.com/image/thumb/Music115/v4/a6/2a/51/a62a512d-5891-6989-55b3-75923632e10a/00094635561258.jpg/600x600bb.jpg',
    previewUrl: '',
    moodTag: 'Sunday Morning Coffee'
  }
];
