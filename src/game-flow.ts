import type {Player, ActionInProgress} from './types.ts';
import {state, saveStateToHistory, restorePreviousState, logMessage, unlockAnimal} from './game-state.ts';
import {render} from './render.ts';
import {playSound} from './sound.ts';
import {showConfetti} from './ui.ts';
import {handleAttack, handleSpitball, handleStrike, handleRampage, handleMischief, handleHowl} from './actions.ts';
import {getElement} from './dom.ts';

export function startTurn(): void {
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
		render();
		setTimeout(endTurn, 1500);
		return;
	}

	render();

	if (currentPlayer.isComputer) {
		setTimeout(() => {
			playComputerTurn(currentPlayer);
		}, 1000);
	}
}

export function playComputerTurn(player: Player): void {
	const aliveOpponents = state.players.filter((p) => p.isAlive && p.id !== player.id);
	if (aliveOpponents.length === 0) {
		endTurn();
		return;
	}

	const randomTarget = aliveOpponents[Math.floor(Math.random() * aliveOpponents.length)];
	if (randomTarget) {
		handleAttack(player, randomTarget);
	}
	setTimeout(() => {
		endTurn();
	}, 1000);
}

export function endTurn(): void {
	const lastPlayer = state.players[state.currentPlayerIndex];
	if (lastPlayer && lastPlayer.abilityCooldown > 0) {
		lastPlayer.abilityCooldown--;
	}

	const alivePlayers = state.players.filter((p) => p.isAlive);
	if (alivePlayers.length <= 1) {
		state.gameState = 'gameEnding';
		render();

		const winner = alivePlayers[0];
		const shouldShowConfetti = state.gameMode === 'standard' || (winner && !winner.isComputer);
		if (shouldShowConfetti) {
			showConfetti();
		}

		setTimeout(() => endGame(winner), 2000);
		return;
	}

	let nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
	while (state.players[nextIndex] && !state.players[nextIndex]!.isAlive) {
		nextIndex = (nextIndex + 1) % state.players.length;
	}
	state.currentPlayerIndex = nextIndex;
	state.turn++;

	startTurn();
}

export function endGame(winner: Player | undefined): void {
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

	getElement('winner-announcement').textContent = announcement;
	getElement('game-over-screen').style.display = 'flex';
}

export function handleUndo(): void {
	restorePreviousState();
	logMessage('⏪ Turn undone.');
	render();
}

export function initiateTargetSelection(
	type: ActionInProgress['type'],
	sourceId: number,
	requiredTargets: number,
	prompt: string,
): void {
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
			executeTargetedAction(aliveOpponents[0]!.id);
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
	render();
}

export function handleAbility(source: Player): void {
	switch (source.animal) {
		case 'Coyote':
			handleHowl(source);
			render();
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
}

export function executeTargetedAction(targetId: number): void {
	if (!state.actionInProgress) return;

	const {targets, type, sourceId, requiredTargets} = state.actionInProgress;

	if (!targets.includes(targetId)) {
		targets.push(targetId);
	}

	if (targets.length === requiredTargets) {
		const source = state.players[sourceId];
		const targetPlayers = targets.map((id) => state.players[id]).filter((p): p is Player => !!p);

		if (source) {
			if (type === 'attack') handleAttack(source, targetPlayers[0]!);
			if (type === 'spitball') handleSpitball(source, targetPlayers[0]!);
			if (type === 'strike') handleStrike(source, targetPlayers[0]!, targetPlayers[1]!);
			if (type === 'rampage') handleRampage(source, targetPlayers[0]!);
			if (type === 'mischief') handleMischief(source, targetPlayers[0]!);
		}

		state.actionInProgress = null;
		endTurn();
	} else {
		state.actionInProgress.prompt = `Select target 2 of ${requiredTargets}.`;
		render();
	}
}
