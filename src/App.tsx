import React, { useEffect, useState } from 'react';
import {
  CardId,
  ExperiencePackId,
  PlayerResponses,
  PlayerState,
  TableSessionState
} from './types/app';
import {
  ALL_CARD_IDS,
  EXPERIENCE_PACKS,
  TWO_BRAINS_SHARED_PROMPTS
} from './data/cardsVault';
import { createDefaultPlayerResponses } from './utils/shareCodec';
import { LobbyScreen } from './components/LobbyScreen';
import { TableMixModal } from './components/TableMixModal';
import { VaultDrawer } from './components/VaultDrawer';
import { CreationFlow } from './components/CreationFlow';
import { RevealDeck } from './components/RevealDeck';
import { KeepsakeView } from './components/KeepsakeView';

type ScreenPhase =
  | 'lobby'
  | 'create'
  | 'ready-to-share'
  | 'reveal'
  | 'keepsake';

const STORAGE_KEY = 'around_the_table_v3_session';

function createFreshSession(initialOwnerName = ''): TableSessionState {
  const defaultPack = EXPERIENCE_PACKS[2]; // 4-Card Table Classic
  return {
    createdAt: Date.now(),
    packId: defaultPack.id,
    activeCardIds: [...defaultPack.defaultCardIds],
    sharedTwoBrainsPrompt: TWO_BRAINS_SHARED_PROMPTS[0],
    players: [
      {
        id: 'player-1',
        name: initialOwnerName,
        responses: createDefaultPlayerResponses(0)
      }
    ]
  };
}

export const App: React.FC = () => {
  const [session, setSession] = useState<TableSessionState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          parsed &&
          Array.isArray(parsed.activeCardIds) &&
          Array.isArray(parsed.players) &&
          parsed.players.length > 0
        ) {
          return parsed;
        }
      }
    } catch {
      // Ignore corrupt localStorage
    }
    return createFreshSession();
  });

  const [phase, setPhase] = useState<ScreenPhase>('lobby');
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [cardIndex, setCardIndex] = useState(0);
  const [mixModalOpen, setMixModalOpen] = useState(false);
  const [vaultDrawerOpen, setVaultDrawerOpen] = useState(false);

  // Sync URL query parameters if opened from a shared Table Link
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardsParam = params.get('cards');
    const packParam = params.get('pack') as ExperiencePackId | null;

    if (cardsParam) {
      const validCards = cardsParam
        .split(',')
        .filter((c): c is CardId => ALL_CARD_IDS.includes(c as CardId));
      if (validCards.length > 0) {
        setSession((prev) => ({
          ...prev,
          packId: packParam || 'pack-5-mix',
          activeCardIds: validCards
        }));
      }
    }
  }, []);

  // Persist session to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore quota errors
    }
  }, [session]);

  const ownerPlayer = session.players[0] || {
    id: 'player-1',
    name: '',
    responses: createDefaultPlayerResponses(0)
  };

  const handleChangeOwnerName = (name: string) => {
    setSession((prev) => {
      const nextPlayers = [...prev.players];
      nextPlayers[0] = {
        ...nextPlayers[0],
        name
      };
      return {
        ...prev,
        players: nextPlayers
      };
    });
  };

  const handleSelectPack = (packId: ExperiencePackId) => {
    const found = EXPERIENCE_PACKS.find((p) => p.id === packId);
    if (!found) return;
    setSession((prev) => ({
      ...prev,
      packId,
      activeCardIds:
        packId === 'pack-5-mix'
          ? prev.activeCardIds
          : [...found.defaultCardIds]
    }));
  };

  const handleToggleCardInCustomMix = (cardId: CardId) => {
    if (cardId === 'napkin-sketch') return; // Card #1 locked to Napkin Sketch in custom pack
    setSession((prev) => {
      const exists = prev.activeCardIds.includes(cardId);
      const next = exists
        ? prev.activeCardIds.filter((c) => c !== cardId)
        : [...prev.activeCardIds, cardId];
      return {
        ...prev,
        packId: 'pack-5-mix',
        activeCardIds: next.length > 0 ? next : ['napkin-sketch']
      };
    });
  };

  const handleSurpriseShuffle = () => {
    const pool = ALL_CARD_IDS.filter((id) => id !== 'napkin-sketch');
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const picked: CardId[] = ['napkin-sketch', ...shuffled.slice(0, 3)];
    const randomShared =
      TWO_BRAINS_SHARED_PROMPTS[
        Math.floor(Math.random() * TWO_BRAINS_SHARED_PROMPTS.length)
      ];
    setSession((prev) => ({
      ...prev,
      packId: 'pack-5-mix',
      activeCardIds: picked,
      sharedTwoBrainsPrompt: randomShared
    }));
  };

  const handlePlaySingleCardNow = (cardId: CardId) => {
    setSession((prev) => ({
      ...prev,
      packId:
        cardId === 'napkin-sketch' ? 'pack-1-napkin' : 'pack-5-mix',
      activeCardIds: [cardId]
    }));
    setVaultDrawerOpen(false);
    setMixModalOpen(false);
    setActivePlayerIndex(0);
    setCardIndex(0);
    setPhase('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCardFromVault = (cardId: CardId) => {
    setSession((prev) => {
      const exists = prev.activeCardIds.includes(cardId);
      if (exists && prev.activeCardIds.length === 1) return prev;
      const next = exists
        ? prev.activeCardIds.filter((id) => id !== cardId)
        : [...prev.activeCardIds, cardId];
      return {
        ...prev,
        packId: 'pack-5-mix',
        activeCardIds: next
      };
    });
  };

  const handleStartSession = () => {
    setActivePlayerIndex(0);
    setCardIndex(0);
    setPhase('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdatePlayerResponses = (
    playerIndex: number,
    updater: (prev: PlayerResponses) => PlayerResponses
  ) => {
    setSession((prev) => {
      const nextPlayers = [...prev.players];
      const target = nextPlayers[playerIndex];
      if (!target) return prev;
      nextPlayers[playerIndex] = {
        ...target,
        responses: updater(target.responses)
      };
      return {
        ...prev,
        players: nextPlayers
      };
    });
  };

  const handleChangeSharedTwoBrainsPrompt = (prompt: string) => {
    setSession((prev) => ({
      ...prev,
      sharedTwoBrainsPrompt: prompt
    }));
  };

  const handleNextCard = () => {
    const total = session.activeCardIds.length;
    if (cardIndex < total - 1) {
      setCardIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Current player finished all cards in the deck
    setPhase('ready-to-share');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevCard = () => {
    setCardIndex((prev) => Math.max(0, prev - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddAnotherPlayerOnSamePhone = (newPlayerName: string) => {
    const nextIdx = session.players.length;
    const cleanName = newPlayerName.trim() || `Person ${nextIdx + 1}`;
    const newPlayer: PlayerState = {
      id: `player-${nextIdx + 1}-${Date.now()}`,
      name: cleanName,
      responses: createDefaultPlayerResponses(nextIdx)
    };
    setSession((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
    setActivePlayerIndex(nextIdx);
    setCardIndex(0);
    setPhase('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleImportExternalPlayerResponses = (
    importedName: string,
    responses: PlayerResponses
  ) => {
    const nextIdx = session.players.length;
    const cleanName = importedName.trim() || `Person ${nextIdx + 1}`;
    const newPlayer: PlayerState = {
      id: `player-${nextIdx + 1}-${Date.now()}`,
      name: cleanName,
      responses
    };
    setSession((prev) => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const handleStartNewSession = () => {
    const fresh = createFreshSession(ownerPlayer.name);
    setSession(fresh);
    setActivePlayerIndex(0);
    setCardIndex(0);
    setPhase('lobby');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <main className="app-shell">
      {phase === 'lobby' && (
        <LobbyScreen
          ownerName={ownerPlayer.name}
          onChangeOwnerName={handleChangeOwnerName}
          selectedPackId={session.packId}
          activeCardIds={session.activeCardIds}
          onSelectPack={handleSelectPack}
          onOpenMixModal={() => setMixModalOpen(true)}
          onOpenVaultDrawer={() => setVaultDrawerOpen(true)}
          onSurpriseShuffle={handleSurpriseShuffle}
          onStartSession={handleStartSession}
        />
      )}

      {(phase === 'create' || phase === 'ready-to-share') && (
        <CreationFlow
          session={session}
          activePlayerIndex={activePlayerIndex}
          cardIndex={cardIndex}
          isReadyToShareScreen={phase === 'ready-to-share'}
          onUpdatePlayerResponses={handleUpdatePlayerResponses}
          onChangeSharedTwoBrainsPrompt={handleChangeSharedTwoBrainsPrompt}
          onNextCard={handleNextCard}
          onPrevCard={handlePrevCard}
          onAddAnotherPlayerOnSamePhone={handleAddAnotherPlayerOnSamePhone}
          onImportExternalPlayerResponses={handleImportExternalPlayerResponses}
          onProceedToReveal={() => {
            setPhase('reveal');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onExitToLobby={() => setPhase('lobby')}
        />
      )}

      {phase === 'reveal' && (
        <RevealDeck
          session={session}
          onUpdatePlayerResponses={handleUpdatePlayerResponses}
          onAddAnotherPlayerFromReveal={() => {
            setPhase('ready-to-share');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onOpenVaultDrawer={() => setVaultDrawerOpen(true)}
          onFinishToKeepsake={() => {
            setPhase('keepsake');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToLobby={() => setPhase('lobby')}
        />
      )}

      {phase === 'keepsake' && (
        <KeepsakeView
          session={session}
          onBackToReveal={() => setPhase('reveal')}
          onOpenVaultDrawer={() => setVaultDrawerOpen(true)}
          onStartNewSession={handleStartNewSession}
        />
      )}

      <TableMixModal
        isOpen={mixModalOpen}
        selectedCards={session.activeCardIds}
        onToggleCard={handleToggleCardInCustomMix}
        onSurpriseDeal={handleSurpriseShuffle}
        onClose={() => setMixModalOpen(false)}
        onApplyAndStart={() => {
          setMixModalOpen(false);
          handleStartSession();
        }}
      />

      <VaultDrawer
        isOpen={vaultDrawerOpen}
        activeCardIds={session.activeCardIds}
        onClose={() => setVaultDrawerOpen(false)}
        onPlaySingleCardNow={handlePlaySingleCardNow}
        onToggleCardInDeck={handleToggleCardFromVault}
      />
    </main>
  );
};

export default App;
