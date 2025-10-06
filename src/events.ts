import {state} from './game-state.ts';
import {getElement, querySelector} from './dom.ts';
import {
	showKeyboardShortcuts,
	hideKeyboardShortcuts,
	showFullscreenLog,
	hideFullscreenLog,
	saveGameLog,
	copyGameLog,
	updateThemeToggle,
	updateMuteToggle,
} from './ui.ts';
import {handleAbility, handleUndo, endTurn, initiateTargetSelection, executeTargetedAction} from './game-flow.ts';
import {handleHeal, handleShield} from './actions.ts';
import {playSound, setMuted, isSoundMuted} from './sound.ts';
import {loadTheme, saveTheme, saveMutePreference} from './storage.ts';
import {updatePlayerSelections, toggleAbilities, switchMode, startGame} from './setup.ts';

export function setupEventListeners(): void {
	const playerCountSelect = getElement('player-count');
	const startGameBtn = getElement('start-game-btn');
	const playAgainBtn = getElement('play-again-btn');
	const saveLogBtn = getElement('save-log-btn');
	const saveLogGameOverBtn = getElement('save-log-game-over-btn');
	const copyLogBtn = getElement('copy-log-btn');
	const copyLogGameOverBtn = getElement('copy-log-game-over-btn');
	const closeShortcutsBtn = getElement('close-shortcuts-btn');
	const themeToggleBtn = getElement('theme-toggle-btn');
	const muteToggleBtn = getElement('mute-toggle-btn');
	const viewLogBtn = getElement('view-log-btn');
	const closeFullscreenLogBtn = getElement('close-fullscreen-log-btn');
	const copyLogFullscreenBtn = getElement('copy-log-fullscreen-btn');
	const saveLogFullscreenBtn = getElement('save-log-fullscreen-btn');
	const toggleAbilitiesBtn = getElement('toggle-abilities-btn');
	const undoBtn = getElement('undo-btn');
	const standardModeBtn = getElement('standard-mode-btn');
	const challengerModeBtn = getElement('challenger-mode-btn');
	const actionButtonsContainer = querySelector('.action-buttons');
	const playersContainer = getElement('players-container');

	playerCountSelect.addEventListener('change', updatePlayerSelections);
	startGameBtn.addEventListener('click', startGame);
	playAgainBtn.addEventListener('click', () => location.reload());
	saveLogBtn.addEventListener('click', saveGameLog);
	saveLogGameOverBtn.addEventListener('click', saveGameLog);
	copyLogBtn.addEventListener('click', copyGameLog);
	copyLogGameOverBtn.addEventListener('click', copyGameLog);
	closeShortcutsBtn.addEventListener('click', hideKeyboardShortcuts);
	themeToggleBtn.addEventListener('click', toggleTheme);
	muteToggleBtn.addEventListener('click', toggleMute);
	viewLogBtn.addEventListener('click', showFullscreenLog);
	closeFullscreenLogBtn.addEventListener('click', hideFullscreenLog);
	copyLogFullscreenBtn.addEventListener('click', copyGameLog);
	saveLogFullscreenBtn.addEventListener('click', saveGameLog);
	toggleAbilitiesBtn.addEventListener('click', toggleAbilities);
	undoBtn.addEventListener('click', handleUndo);
	standardModeBtn.addEventListener('click', () => switchMode('standard'));
	challengerModeBtn.addEventListener('click', () => switchMode('challenger'));
	document.addEventListener('keydown', handleKeyPress);

	actionButtonsContainer.addEventListener('click', (e) => {
		const button = (e.target as HTMLElement).closest('.action-btn') as HTMLButtonElement | null;
		if (!button || button.disabled) return;

		const currentPlayer = state.players[state.currentPlayerIndex];
		if (!currentPlayer) return;

		if (state.gameState !== 'playing' || state.actionInProgress || state.turnSkipped || currentPlayer.isComputer)
			return;

		const action = button.dataset['action'];
		const source = currentPlayer;

		switch (action) {
			case 'attack':
				initiateTargetSelection('attack', source.id, 1, `Select a target to attack.`);
				break;
			case 'ability':
				handleAbility(source);
				break;
			case 'heal':
				handleHeal(source);
				endTurn();
				break;
			case 'shield':
				handleShield(source);
				endTurn();
				break;
			case 'nothing':
				playSound('nothing');
				endTurn();
				break;
		}
	});

	playersContainer.addEventListener('click', (e) => {
		const currentPlayer = state.players[state.currentPlayerIndex];
		if (!state.actionInProgress || state.turnSkipped || (currentPlayer && currentPlayer.isComputer)) return;

		const card = (e.target as HTMLElement).closest('.player-card.selectable') as HTMLDivElement | null;
		if (!card) return;

		const targetId = parseInt(card.dataset['playerId'] || '0', 10);
		executeTargetedAction(targetId);
	});
}

function toggleTheme(): void {
	document.body.classList.toggle('dark-mode');
	const isDark = document.body.classList.contains('dark-mode');
	saveTheme(isDark ? 'dark' : 'light');
	updateThemeToggle(isDark);
}

function toggleMute(): void {
	const newMutedState = !isSoundMuted();
	setMuted(newMutedState);
	saveMutePreference(newMutedState);
	updateMuteToggle(newMutedState);
}

function handleKeyPress(event: KeyboardEvent): void {
	const key = event.key.toLowerCase();

	if (key === 'm') {
		toggleMute();
		event.preventDefault();
		return;
	}

	const currentPlayer = state.players[state.currentPlayerIndex];

	if (
		state.gameState !== 'playing' ||
		state.actionInProgress ||
		state.turnSkipped ||
		(currentPlayer && currentPlayer.isComputer)
	) {
		if (event.key === '?' || event.key === '/') {
			showKeyboardShortcuts();
			event.preventDefault();
		} else if (event.key === 'Escape') {
			hideKeyboardShortcuts();
			event.preventDefault();
		} else if (
			state.gameState === 'playing' &&
			((event.key.toLowerCase() === 'z' && (event.ctrlKey || event.metaKey)) || event.key.toLowerCase() === 'u')
		) {
			const undoBtn = getElement<HTMLButtonElement>('undo-btn');
			if (!undoBtn.disabled) {
				handleUndo();
			}
			event.preventDefault();
		}
		return;
	}

	if (key === '?') {
		showKeyboardShortcuts();
		event.preventDefault();
	} else if (key === 'escape') {
		hideKeyboardShortcuts();
		event.preventDefault();
	} else if ((key === 'z' && (event.ctrlKey || event.metaKey)) || key === 'u') {
		const undoBtn = getElement<HTMLButtonElement>('undo-btn');
		if (!undoBtn.disabled) {
			handleUndo();
		}
		event.preventDefault();
	} else if (key === 'a') {
		querySelector<HTMLButtonElement>('[data-action="attack"]').click();
		event.preventDefault();
	} else if (key === 'b') {
		const abilityBtn = querySelector<HTMLButtonElement>('[data-action="ability"]');
		if (!abilityBtn.disabled) {
			abilityBtn.click();
		}
		event.preventDefault();
	} else if (key === 'h') {
		const healBtn = querySelector<HTMLButtonElement>('[data-action="heal"]');
		if (!healBtn.disabled) {
			healBtn.click();
		}
		event.preventDefault();
	} else if (key === 's') {
		const shieldBtn = querySelector<HTMLButtonElement>('[data-action="shield"]');
		if (!shieldBtn.disabled) {
			shieldBtn.click();
		}
		event.preventDefault();
	} else if (key === 'n') {
		querySelector<HTMLButtonElement>('[data-action="nothing"]').click();
		event.preventDefault();
	}
}

export function initializeTheme(): void {
	const theme = loadTheme();
	if (theme === 'dark') {
		document.body.classList.add('dark-mode');
	}
	updateThemeToggle(theme === 'dark');
}
