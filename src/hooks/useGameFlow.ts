import {useCallback} from 'react';
import type {Player, ActionInProgress, GameState} from '../types.ts';
import type {UseGameStateReturn} from './useGameState.ts';
import type {UseGameActionsReturn} from './useGameActions.ts';
import {playSound} from '../sound.ts';

export interface UseGameFlowCallbacks {
	onRender?: () => void;
	onShowConfetti?: () => void;
	onEndGame?: (winner: Player | undefined, announcement: string) => void;
}

export interface UseGameFlowReturn {
	startTurn: (state: GameState) => void;
	endTurn: (state: GameState) => void;
	playComputerTurn: (player: Player, state: GameState) => void;
	handleUndo: () => void;
	initiateTargetSelection: (
		state: GameState,
		type: ActionInProgress['type'],
		sourceId: number,
		requiredTargets: number,
		prompt: string,
	) => void;
	handleAbility: (source: Player, state: GameState) => void;
	executeTargetedAction: (state: GameState, targetId: number) => void;
}

export function useGameFlow(
	gameState: UseGameStateReturn,
	gameActions: UseGameActionsReturn,
	callbacks: UseGameFlowCallbacks = {},
): UseGameFlowReturn {
	const {saveStateToHistory, restorePreviousState, logMessage, unlockAnimal} = gameState;
	const {handleAttack, handleHowl, handleSpitball, handleStrike, handleRampage, handleMischief} = gameActions;
	const {onRender, onShowConfetti, onEndGame} = callbacks;

	const endGame = useCallback(
		(state: GameState, winner: Player | undefined): void => {
			state.gameState = 'gameOver';
			playSound('victory');
			const announcement = winner ? `${winner.name} the ${winner.animal} is the new ruler!` : "It's a draw!";
			logMessage(announcement);

			if (state.gameMode === 'challenger' && winner && !winner.isComputer) {
				const opponent = state.players.find((p) => p.isComputer);
				if (opponent) {
					unlockAnimal(opponent.animal);
					logMessage(`You unlocked the ${opponent.animal}!`, 1);
				}
			}

			if (onEndGame) {
				onEndGame(winner, announcement);
			}
		},
		[logMessage, unlockAnimal, onEndGame],
	);

	const endTurn = useCallback(
		(state: GameState): void => {
			const lastPlayer = state.players[state.currentPlayerIndex];
			if (lastPlayer && lastPlayer.abilityCooldown > 0) {
				lastPlayer.abilityCooldown--;
			}

			const alivePlayers = state.players.filter((p) => p.isAlive);
			if (alivePlayers.length <= 1) {
				state.gameState = 'gameEnding';
				if (onRender) {
					onRender();
				}

				const winner = alivePlayers[0];
				const shouldShowConfetti = state.gameMode === 'standard' || (winner && !winner.isComputer);
				if (shouldShowConfetti && onShowConfetti) {
					onShowConfetti();
				}

				setTimeout(() => endGame(state, winner), 2000);
				return;
			}

			let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
			while (state.players[nextIndex] && !state.players[nextIndex]!.isAlive) {
				nextIndex = (nextIndex + 1) % state.players.length;
			}
			state.currentPlayerIndex = nextIndex;
			state.turn++;

			startTurn(state);
		},
		[onRender, onShowConfetti, endGame],
	);

	const playComputerTurn = useCallback(
		(player: Player, state: GameState): void => {
			const aliveOpponents = state.players.filter((p) => p.isAlive && p.id !== player.id);
			if (aliveOpponents.length === 0) {
				endTurn(state);
				return;
			}

			const randomTarget = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
			if (randomTarget) {
				handleAttack(player, randomTarget, logMessage, unlockAnimal);
			}
			setTimeout(() => {
				endTurn(state);
			}, 1000);
		},
		[endTurn, handleAttack, logMessage, unlockAnimal],
	);

	const startTurn = useCallback(
		(state: GameState): void => {
			saveStateToHistory();

			const currentPlayer = state.players[state.currentPlayerIndex];
			if (!currentPlayer) return;

			state.turnSkipped = false;

			logMessage(`It's ${currentPlayer.name}'s (${currentPlayer.animal}) turn!`);

			if (currentPlayer.status.isShielded) {
				currentPlayer.status.isShielded = false;
				logMessage(`${currentPlayer.name}'s (${currentPlayer.animal}) shield has worn off.`, 1);
			}

			if (currentPlayer.status.isSleeping) {
				currentPlayer.status.isSleeping = false;
				logMessage(`${currentPlayer.name} (${currentPlayer.animal}) is asleep and skips their turn!`, 1);
				state.actionInProgress = null;
				state.turnSkipped = true;
				if (onRender) {
					onRender();
				}
				setTimeout(() => endTurn(state), 1500);
				return;
			}

			if (onRender) {
				onRender();
			}

			if (currentPlayer.isComputer) {
				setTimeout(() => {
					playComputerTurn(currentPlayer, state);
				}, 1000);
			}
		},
		[saveStateToHistory, logMessage, onRender, endTurn, playComputerTurn],
	);

	const handleUndo = useCallback((): void => {
		restorePreviousState();
		logMessage('⏪ Turn undone.');
		if (onRender) {
			onRender();
		}
	}, [restorePreviousState, logMessage, onRender]);

	const executeTargetedAction = useCallback(
		(state: GameState, targetId: number): void => {
			if (!state.actionInProgress) return;

			const {targets, type, sourceId, requiredTargets} = state.actionInProgress;

			if (!targets.includes(targetId)) {
				targets.push(targetId);
			}

			if (targets.length === requiredTargets) {
				const source = state.players[sourceId];
				const targetPlayers = targets.map((id) => state.players[id]).filter((p): p is Player => !!p);

				if (source) {
					if (type === 'attack') handleAttack(source, targetPlayers[0]!, logMessage, unlockAnimal);
					if (type === 'spitball') handleSpitball(source, targetPlayers[0]!, logMessage, unlockAnimal);
					if (type === 'strike')
						handleStrike(source, targetPlayers[0]!, targetPlayers[1]!, logMessage, unlockAnimal);
					if (type === 'rampage') handleRampage(source, targetPlayers[0]!, logMessage, unlockAnimal);
					if (type === 'mischief') handleMischief(source, targetPlayers[0]!, logMessage);
				}

				state.actionInProgress = null;
				endTurn(state);
			} else {
				state.actionInProgress.prompt = `Select target 2 of ${requiredTargets}.`;
				if (onRender) {
					onRender();
				}
			}
		},
		[
			handleAttack,
			handleSpitball,
			handleStrike,
			handleRampage,
			handleMischief,
			logMessage,
			unlockAnimal,
			endTurn,
			onRender,
		],
	);

	const initiateTargetSelection = useCallback(
		(
			state: GameState,
			type: ActionInProgress['type'],
			sourceId: number,
			requiredTargets: number,
			prompt: string,
		): void => {
			if (state.gameMode === 'challenger' && requiredTargets === 1) {
				const aliveOpponents = state.players.filter((p) => p.isAlive && p.id !== sourceId);
				if (aliveOpponents.length === 1) {
					state.actionInProgress = {
						type,
						sourceId,
						requiredTargets,
						targets: [],
						prompt,
					};
					executeTargetedAction(state, aliveOpponents[0]!.id);
					return;
				}
			}

			state.actionInProgress = {
				type,
				sourceId,
				requiredTargets,
				targets: [],
				prompt,
			};
			if (onRender) {
				onRender();
			}
		},
		[executeTargetedAction, onRender],
	);

	const handleAbility = useCallback(
		(source: Player, state: GameState): void => {
			switch (source.animal) {
				case 'Coyote':
					handleHowl(source, state, logMessage);
					if (onRender) {
						onRender();
					}
					setTimeout(() => endTurn(state), 0);
					break;
				case 'Llama':
					initiateTargetSelection(state, 'spitball', source.id, 1, `Select a target for Spitball.`);
					break;
				case 'Tiger':
					initiateTargetSelection(state, 'strike', source.id, 2, `Select target 1 of 2 for Strike.`);
					break;
				case 'Gorilla':
					initiateTargetSelection(state, 'rampage', source.id, 1, `Select a target for Rampage.`);
					break;
				case 'Monkey':
					initiateTargetSelection(state, 'mischief', source.id, 1, `Select a target for Mischief.`);
					break;
			}
		},
		[handleHowl, logMessage, onRender, initiateTargetSelection],
	);

	return {
		startTurn,
		endTurn,
		playComputerTurn,
		handleUndo,
		initiateTargetSelection,
		handleAbility,
		executeTargetedAction,
	};
}
