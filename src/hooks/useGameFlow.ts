import {useCallback, useRef} from 'react';
import type {Player, ActionInProgress} from '../types.ts';
import type {UseGameStateReturn} from './useGameState.ts';
import type {UseGameActionsReturn} from './useGameActions.ts';
import {playSound} from '../sound.ts';

export interface UseGameFlowCallbacks {
	onRender?: () => void;
	onShowConfetti?: () => void;
	onEndGame?: (winner: Player | undefined, announcement: string) => void;
}

export interface UseGameFlowReturn {
	startTurn: () => void;
	endTurn: () => void;
	playComputerTurn: (player: Player) => void;
	handleUndo: () => void;
	initiateTargetSelection: (
		type: ActionInProgress['type'],
		sourceId: number,
		requiredTargets: number,
		prompt: string,
	) => void;
	handleAbility: (source: Player) => void;
	executeTargetedAction: (targetId: number) => void;
}

export function useGameFlow(
	gameState: UseGameStateReturn,
	gameActions: UseGameActionsReturn,
	callbacks: UseGameFlowCallbacks = {},
): UseGameFlowReturn {
	const gameStateRef = useRef(gameState);
	const gameActionsRef = useRef(gameActions);

	gameStateRef.current = gameState;
	gameActionsRef.current = gameActions;

	const {saveStateToHistory, restorePreviousState, logMessage, unlockAnimal, updateState} = gameState;
	const {handleAttack, handleHowl, handleSpitball, handleStrike, handleRampage, handleMischief} = gameActions;
	const {onRender, onShowConfetti, onEndGame} = callbacks;

	const startTurnRef = useRef<(() => void) | null>(null);
	const endTurnRef = useRef<(() => void) | null>(null);
	const playComputerTurnRef = useRef<((player: Player) => void) | null>(null);

	const endGame = useCallback(
		(winner: Player | undefined): void => {
			const state = gameStateRef.current.state;
			playSound('victory');
			const announcement = winner ? `${winner.name} the ${winner.animal} is the new ruler!` : "It's a draw!";
			const gameMode = state.gameMode;
			const opponent = state.players.find((p) => p.isComputer);

			updateState((newState) => {
				newState.gameState = 'gameOver';
				newState.log.push({message: announcement, indent: 0});

				if (gameMode === 'challenger' && winner && !winner.isComputer && opponent) {
					newState.log.push({message: `You unlocked the ${opponent.animal}!`, indent: 1});
				}
			});

			if (gameMode === 'challenger' && winner && !winner.isComputer && opponent) {
				unlockAnimal(opponent.animal);
			}

			if (onEndGame) {
				onEndGame(winner, announcement);
			}
		},
		[updateState, unlockAnimal, onEndGame],
	);

	const endTurn = useCallback((): void => {
		const state = gameStateRef.current.state;
		const currentPlayerIndex = state.currentPlayerIndex;
		const lastPlayer = state.players[currentPlayerIndex];
		const lastPlayerCooldown = lastPlayer?.abilityCooldown ?? 0;

		const alivePlayers = state.players.filter((p) => p.isAlive);
		if (alivePlayers.length <= 1) {
			updateState((newState) => {
				newState.gameState = 'gameEnding';
			});

			if (onRender) {
				onRender();
			}

			const winner = alivePlayers[0];
			const shouldShowConfetti = state.gameMode === 'standard' || (winner && !winner.isComputer);
			if (shouldShowConfetti && onShowConfetti) {
				onShowConfetti();
			}

			setTimeout(() => endGame(winner), 2000);
			return;
		}

		let nextIndex = (currentPlayerIndex + 1) % state.players.length;
		while (state.players[nextIndex] && !state.players[nextIndex]!.isAlive) {
			nextIndex = (nextIndex + 1) % state.players.length;
		}

		updateState((newState) => {
			if (lastPlayerCooldown > 0) {
				const player = newState.players[currentPlayerIndex];
				if (player) {
					player.abilityCooldown = lastPlayerCooldown - 1;
				}
			}
			newState.currentPlayerIndex = nextIndex;
			newState.turn++;
		});

		setTimeout(() => startTurnRef.current?.(), 0);
	}, [updateState, onRender, onShowConfetti, endGame]);

	const playComputerTurn = useCallback(
		(player: Player): void => {
			const state = gameStateRef.current.state;
			const aliveOpponents = state.players.filter((p) => p.isAlive && p.id !== player.id);
			if (aliveOpponents.length === 0) {
				endTurnRef.current?.();
				return;
			}

			const randomTarget = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
			if (randomTarget) {
				updateState((newState) => {
					const localLog = (message: string, indent = 0) => {
						newState.log.push({message, indent});
					};

					const source = newState.players.find((p) => p.id === player.id);
					const target = newState.players.find((p) => p.id === randomTarget.id);

					if (source && target) {
						handleAttack(source, target, localLog, unlockAnimal);
					}
				});
			}
			setTimeout(() => {
				endTurnRef.current?.();
			}, 1000);
		},
		[updateState, handleAttack, unlockAnimal],
	);

	const startTurn = useCallback((): void => {
		saveStateToHistory();

		const state = gameStateRef.current.state;
		const currentPlayerIndex = state.currentPlayerIndex;
		const currentPlayer = state.players[currentPlayerIndex];
		if (!currentPlayer) return;

		const wasShielded = currentPlayer.status.isShielded;
		const wasSleeping = currentPlayer.status.isSleeping;

		updateState((newState) => {
			const player = newState.players[currentPlayerIndex];
			if (!player) return;

			newState.turnSkipped = false;
			newState.log.push({message: `It's ${player.name}'s (${player.animal}) turn!`, indent: 0});

			if (wasShielded) {
				player.status.isShielded = false;
				newState.log.push({
					message: `${player.name}'s (${player.animal}) shield has worn off.`,
					indent: 1,
				});
			}

			if (wasSleeping) {
				player.status.isSleeping = false;
				newState.log.push({
					message: `${player.name} (${player.animal}) is asleep and skips their turn!`,
					indent: 1,
				});
				newState.actionInProgress = null;
				newState.turnSkipped = true;
			}
		});

		if (wasSleeping) {
			if (onRender) {
				onRender();
			}
			setTimeout(() => endTurnRef.current?.(), 1500);
			return;
		}

		if (onRender) {
			onRender();
		}

		if (currentPlayer.isComputer) {
			setTimeout(() => {
				playComputerTurnRef.current?.(currentPlayer);
			}, 1000);
		}
	}, [saveStateToHistory, updateState, onRender]);

	const handleUndo = useCallback((): void => {
		restorePreviousState();
		logMessage('⏪ Turn undone.');
		if (onRender) {
			onRender();
		}
	}, [restorePreviousState, logMessage, onRender]);

	const executeTargetedAction = useCallback(
		(targetId: number): void => {
			const state = gameStateRef.current.state;
			const actionInProgress = state.actionInProgress;
			if (!actionInProgress) return;

			const {type, sourceId, requiredTargets} = actionInProgress;
			const currentTargets = [...actionInProgress.targets];

			if (!currentTargets.includes(targetId)) {
				currentTargets.push(targetId);
			}

			if (currentTargets.length === requiredTargets) {
				updateState((newState) => {
					const action = newState.actionInProgress;
					if (!action) return;

					action.targets = currentTargets;

					const localLog = (message: string, indent = 0) => {
						newState.log.push({message, indent});
					};

					const source = newState.players[sourceId];
					const targetPlayers = currentTargets
						.map((id) => newState.players[id])
						.filter((p): p is Player => !!p);

					if (source) {
						if (type === 'attack') handleAttack(source, targetPlayers[0]!, localLog, unlockAnimal);
						if (type === 'spitball') handleSpitball(source, targetPlayers[0]!, localLog, unlockAnimal);
						if (type === 'strike')
							handleStrike(source, targetPlayers[0]!, targetPlayers[1]!, localLog, unlockAnimal);
						if (type === 'rampage') handleRampage(source, targetPlayers[0]!, localLog, unlockAnimal);
						if (type === 'mischief') handleMischief(source, targetPlayers[0]!, localLog);
					}

					newState.actionInProgress = null;
				});
				endTurn();
			} else {
				updateState((newState) => {
					if (newState.actionInProgress) {
						newState.actionInProgress.targets = currentTargets;
						newState.actionInProgress.prompt = `Select target 2 of ${requiredTargets}.`;
					}
				});
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
			updateState,
		],
	);

	const initiateTargetSelection = useCallback(
		(type: ActionInProgress['type'], sourceId: number, requiredTargets: number, prompt: string): void => {
			const state = gameStateRef.current.state;
			if (state.gameMode === 'challenger' && requiredTargets === 1) {
				const aliveOpponents = state.players.filter((p) => p.isAlive && p.id !== sourceId);
				if (aliveOpponents.length === 1) {
					const targetId = aliveOpponents[0]!.id;
					updateState((newState) => {
						newState.actionInProgress = {
							type,
							sourceId,
							requiredTargets,
							targets: [targetId],
							prompt,
						};

						const localLog = (message: string, indent = 0) => {
							newState.log.push({message, indent});
						};

						const source = newState.players[sourceId];
						const target = newState.players[targetId];

						if (source && target) {
							if (type === 'attack') handleAttack(source, target, localLog, unlockAnimal);
							if (type === 'spitball') handleSpitball(source, target, localLog, unlockAnimal);
							if (type === 'rampage') handleRampage(source, target, localLog, unlockAnimal);
							if (type === 'mischief') handleMischief(source, target, localLog);
						}

						newState.actionInProgress = null;
					});
					setTimeout(() => endTurnRef.current?.(), 0);
					return;
				}
			}

			updateState((newState) => {
				newState.actionInProgress = {
					type,
					sourceId,
					requiredTargets,
					targets: [],
					prompt,
				};
			});
			if (onRender) {
				onRender();
			}
		},
		[handleAttack, handleSpitball, handleRampage, handleMischief, unlockAnimal, onRender, updateState],
	);

	const handleAbility = useCallback(
		(source: Player): void => {
			switch (source.animal) {
				case 'Coyote':
					updateState((newState) => {
						const localLog = (message: string, indent = 0) => {
							newState.log.push({message, indent});
						};
						const coyote = newState.players.find((p) => p.id === source.id);
						if (coyote) {
							handleHowl(coyote, newState, localLog);
						}
					});
					if (onRender) {
						onRender();
					}
					setTimeout(() => endTurnRef.current?.(), 0);
					break;
				case 'Llama':
					initiateTargetSelection('spitball', source.id, 1, `Select a target for Spitball.`);
					break;
				case 'Tiger':
					initiateTargetSelection('strike', source.id, 2, `Select target 1 of 2 for Strike.`);
					break;
				case 'Gorilla':
					initiateTargetSelection('rampage', source.id, 1, `Select a target for Rampage.`);
					break;
				case 'Monkey':
					initiateTargetSelection('mischief', source.id, 1, `Select a target for Mischief.`);
					break;
			}
		},
		[updateState, handleHowl, onRender, initiateTargetSelection],
	);

	startTurnRef.current = startTurn;
	endTurnRef.current = endTurn;
	playComputerTurnRef.current = playComputerTurn;

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
