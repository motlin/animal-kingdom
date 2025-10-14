import {useState, useCallback, useEffect} from 'react';
import {Header} from './components/Header/Header';
import {SetupScreen} from './screens/SetupScreen/SetupScreen';
import {GameScreen} from './screens/GameScreen/GameScreen';
import {ThemeToggle} from './components/ThemeToggle/ThemeToggle';
import {MuteToggle} from './components/MuteToggle/MuteToggle';
import type {PlayerConfiguration} from './screens/SetupScreen/StandardSetup';
import type {GameMode, AnimalType} from './types';
import {useGameState} from './hooks/useGameState';
import {useGameActions} from './hooks/useGameActions';
import {useGameFlow} from './hooks/useGameFlow';
import {useStorage} from './hooks/useStorage';
import {useSound} from './hooks/useSound';

type Screen = 'setup' | 'game';

function App() {
	const [screen, setScreen] = useState<Screen>('setup');
	const [mode, setMode] = useState<GameMode>('standard');
	const [playerCount, setPlayerCount] = useState(2);
	const [players, setPlayers] = useState<PlayerConfiguration[]>(
		Array.from({length: 10}, (_, i) => ({
			name: `Player ${i + 1}`,
			animalType: 'Coyote' as AnimalType,
			playerType: 'human' as const,
		})),
	);
	const [selectedAnimal, setSelectedAnimal] = useState<AnimalType | null>(null);
	const [opponentAnimal, setOpponentAnimal] = useState<AnimalType | null>(null);
	const [confettiVisible, setConfettiVisible] = useState(false);
	const [, forceUpdate] = useState({});

	const storage = useStorage();
	const gameState = useGameState();
	const gameActions = useGameActions();

	useEffect(() => {
		gameState.setUnlockedAnimals(storage.unlockedAnimals);
	}, [storage.unlockedAnimals, gameState]);

	useEffect(() => {
		document.body.classList.toggle('dark-mode', storage.theme === 'dark');
	}, [storage.theme]);

	const triggerRender = useCallback(() => {
		forceUpdate({});
	}, []);

	const showConfetti = useCallback(() => {
		setConfettiVisible(true);
		setTimeout(() => setConfettiVisible(false), 3000);
	}, []);

	const gameFlow = useGameFlow(gameState, gameActions, {
		onRender: triggerRender,
		onShowConfetti: showConfetti,
		onEndGame: triggerRender,
	});

	const sound = useSound();

	useEffect(() => {
		sound.setIsMuted(storage.isMuted);
	}, [storage.isMuted, sound]);

	useEffect(() => {
		if (gameState.unlockedAnimals.size > 0) {
			const nextLocked = gameState.getNextLockedAnimal();
			if (nextLocked) {
				setOpponentAnimal(nextLocked);
			}
		}
	}, [gameState]);

	const handleModeChange = useCallback(
		(newMode: GameMode) => {
			setMode(newMode);
			if (newMode === 'challenger') {
				setSelectedAnimal(null);
				const nextLocked = gameState.getNextLockedAnimal();
				if (nextLocked) {
					setOpponentAnimal(nextLocked);
				}
			}
		},
		[gameState],
	);

	const handlePlayerCountChange = useCallback((count: number) => {
		setPlayerCount(count);
	}, []);

	const handlePlayerChange = useCallback((index: number, player: PlayerConfiguration) => {
		setPlayers((current) => {
			const updated = [...current];
			updated[index] = player;
			return updated;
		});
	}, []);

	const handleAnimalSelect = useCallback((animal: AnimalType) => {
		setSelectedAnimal(animal);
	}, []);

	const canStartGame = useCallback(() => {
		if (mode === 'standard') {
			return playerCount >= 2;
		} else {
			return selectedAnimal !== null && opponentAnimal !== null;
		}
	}, [mode, playerCount, selectedAnimal, opponentAnimal]);

	const handleStartGame = useCallback(() => {
		if (mode === 'standard') {
			const gamePlayers = players
				.slice(0, playerCount)
				.map((player, index) =>
					gameState.createPlayer(index, player.name, player.animalType, player.playerType === 'computer'),
				);
			gameState.initializeState(gamePlayers, 'standard');
		} else {
			if (!selectedAnimal || !opponentAnimal) return;

			const humanPlayer = gameState.createPlayer(0, 'You', selectedAnimal, false);
			const computerPlayer = gameState.createPlayer(1, 'Challenger', opponentAnimal, true);
			gameState.initializeState([humanPlayer, computerPlayer], 'challenger');
		}

		setScreen('game');
		setTimeout(() => {
			gameFlow.startTurn();
		}, 100);
	}, [mode, players, playerCount, selectedAnimal, opponentAnimal, gameState, gameFlow]);

	const handlePlayAgain = useCallback(() => {
		setScreen('setup');
		setConfettiVisible(false);
	}, []);

	const handleAttack = useCallback(() => {
		const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
		if (!currentPlayer) return;

		gameFlow.initiateTargetSelection('attack', currentPlayer.id, 1, 'Select a target to attack.');
		triggerRender();
	}, [gameState, gameFlow, triggerRender]);

	const handleUseAbility = useCallback(() => {
		const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
		if (!currentPlayer) return;

		gameFlow.handleAbility(currentPlayer);
		triggerRender();
	}, [gameState, gameFlow, triggerRender]);

	const handleHeal = useCallback(() => {
		const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
		if (!currentPlayer) return;

		gameActions.handleHeal(currentPlayer, gameState.logMessage);
		gameFlow.endTurn();
		triggerRender();
	}, [gameState, gameActions, gameFlow, triggerRender]);

	const handleShield = useCallback(() => {
		const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
		if (!currentPlayer) return;

		gameActions.handleShield(currentPlayer, gameState.logMessage);
		gameFlow.endTurn();
		triggerRender();
	}, [gameState, gameActions, gameFlow, triggerRender]);

	const handleDoNothing = useCallback(() => {
		const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
		if (!currentPlayer) return;

		sound.playSound('nothing');
		gameState.logMessage(`${currentPlayer.name} (${currentPlayer.animal}) does nothing.`, 1);
		gameFlow.endTurn();
		triggerRender();
	}, [gameState, gameFlow, sound, triggerRender]);

	const handleUndo = useCallback(() => {
		gameFlow.handleUndo();
		triggerRender();
	}, [gameFlow, triggerRender]);

	const handlePlayerClick = useCallback(
		(playerId: number) => {
			if (gameState.state.actionInProgress) {
				gameFlow.executeTargetedAction(playerId);
				triggerRender();
			}
		},
		[gameState, gameFlow, triggerRender],
	);

	const handleCopyToClipboard = useCallback(() => {
		const logText = gameState.state.log
			.map((entry) => {
				const indentation = '  '.repeat(entry.indent);
				return `${indentation}${entry.message}`;
			})
			.join('\n');

		navigator.clipboard.writeText(logText);
	}, [gameState]);

	const handleSaveLog = useCallback(() => {
		const logText = gameState.state.log
			.map((entry) => {
				const indentation = '  '.repeat(entry.indent);
				return `${indentation}${entry.message}`;
			})
			.join('\n');

		const blob = new Blob([logText], {type: 'text/plain'});
		const url = URL.createObjectURL(blob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'game-log.txt';
		link.click();
		URL.revokeObjectURL(url);
	}, [gameState]);

	const handleThemeToggle = useCallback(() => {
		storage.setTheme(storage.theme === 'light' ? 'dark' : 'light');
	}, [storage]);

	const handleMuteToggle = useCallback(() => {
		const newMutedState = !storage.isMuted;
		storage.setIsMuted(newMutedState);
		sound.setIsMuted(newMutedState);
	}, [storage, sound]);

	if (screen === 'setup') {
		return (
			<div className="app">
				<ThemeToggle
					theme={storage.theme}
					onToggle={handleThemeToggle}
				/>
				<MuteToggle
					isMuted={storage.isMuted}
					onToggle={handleMuteToggle}
				/>
				<Header isGameActive={false} />
				<SetupScreen
					mode={mode}
					unlockedAnimals={gameState.unlockedAnimals as Set<AnimalType>}
					playerCount={playerCount}
					players={players}
					selectedAnimal={selectedAnimal}
					opponentAnimal={opponentAnimal}
					onModeChange={handleModeChange}
					onPlayerCountChange={handlePlayerCountChange}
					onPlayerChange={handlePlayerChange}
					onAnimalSelect={handleAnimalSelect}
					onStartGame={handleStartGame}
					canStartGame={canStartGame()}
				/>
			</div>
		);
	}

	const currentPlayer = gameState.state.players[gameState.state.currentPlayerIndex];
	const turnIndicator = gameState.state.actionInProgress
		? gameState.state.actionInProgress.prompt
		: currentPlayer
			? `${currentPlayer.name}'s Turn`
			: '';

	const canAttack = Boolean(
		!gameState.state.turnSkipped && !gameState.state.actionInProgress && currentPlayer && !currentPlayer.isComputer,
	);

	const canUseAbility = Boolean(
		!gameState.state.turnSkipped &&
			!gameState.state.actionInProgress &&
			currentPlayer &&
			!currentPlayer.isComputer &&
			!currentPlayer.abilityDisabled &&
			currentPlayer.abilityCooldown === 0 &&
			!currentPlayer.oneTimeActions.hasUsedAbility,
	);

	const canHeal = Boolean(
		!gameState.state.turnSkipped &&
			!gameState.state.actionInProgress &&
			currentPlayer &&
			!currentPlayer.isComputer &&
			!currentPlayer.oneTimeActions.hasHealed,
	);

	const canShield = Boolean(
		!gameState.state.turnSkipped &&
			!gameState.state.actionInProgress &&
			currentPlayer &&
			!currentPlayer.isComputer &&
			!currentPlayer.oneTimeActions.hasShielded,
	);

	const canDoNothing = Boolean(
		!gameState.state.turnSkipped && !gameState.state.actionInProgress && currentPlayer && !currentPlayer.isComputer,
	);

	const canUndo = Boolean(gameState.stateHistory.length > 0 && currentPlayer && !currentPlayer.isComputer);

	const healsRemaining = currentPlayer && !currentPlayer.oneTimeActions.hasHealed ? 1 : 0;
	const shieldsRemaining = currentPlayer && !currentPlayer.oneTimeActions.hasShielded ? 1 : 0;

	const selectablePlayerIds = gameState.state.actionInProgress
		? gameState.state.players
				.filter((p) => p.isAlive && p.id !== gameState.state.actionInProgress?.sourceId)
				.map((p) => p.id)
		: [];

	return (
		<div className="app">
			<ThemeToggle
				theme={storage.theme}
				onToggle={handleThemeToggle}
			/>
			<MuteToggle
				isMuted={storage.isMuted}
				onToggle={handleMuteToggle}
			/>
			<Header isGameActive={true} />
			<GameScreen
				players={gameState.state.players}
				currentPlayerIndex={gameState.state.currentPlayerIndex}
				turnIndicator={turnIndicator}
				currentAnimal={currentPlayer?.animal || 'Coyote'}
				canAttack={canAttack}
				canUseAbility={canUseAbility}
				canHeal={canHeal}
				canShield={canShield}
				canDoNothing={canDoNothing}
				canUndo={canUndo}
				healsRemaining={healsRemaining}
				shieldsRemaining={shieldsRemaining}
				logEntries={gameState.state.log}
				isGameOver={gameState.state.gameState === 'gameOver'}
				winnerAnnouncement={
					gameState.state.log.length > 0 ? gameState.state.log[gameState.state.log.length - 1]!.message : ''
				}
				selectablePlayerIds={selectablePlayerIds}
				onPlayerClick={handlePlayerClick}
				onAttack={handleAttack}
				onUseAbility={handleUseAbility}
				onHeal={handleHeal}
				onShield={handleShield}
				onDoNothing={handleDoNothing}
				onUndo={handleUndo}
				onCopyToClipboard={handleCopyToClipboard}
				onSaveLog={handleSaveLog}
				onPlayAgain={handlePlayAgain}
				onViewLog={handleCopyToClipboard}
				onCopyLog={handleCopyToClipboard}
				onSaveGameLog={handleSaveLog}
			/>
			{confettiVisible && (
				<div
					style={{
						position: 'fixed',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						pointerEvents: 'none',
						zIndex: 9999,
					}}
				>
					🎉
				</div>
			)}
		</div>
	);
}

export default App;
