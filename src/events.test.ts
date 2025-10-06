import {describe, it, expect, beforeEach, vi} from 'vitest';
import {setupEventListeners, initializeTheme} from './events.ts';
import {setUnlockedAnimals} from './game-state.ts';

describe('Event listeners', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div id="setup-screen">
				<select id="player-count"><option value="2">2</option></select>
				<button id="start-game-btn">Start</button>
				<button id="standard-mode-btn">Standard</button>
				<button id="challenger-mode-btn">Challenger</button>
				<button id="toggle-abilities-btn">Toggle</button>
				<div id="player-selections"></div>
				<div id="standard-setup"></div>
				<div id="challenger-setup"></div>
				<div id="unlocked-animals-grid"></div>
				<div id="challenger-opponent-display"></div>
				<div class="abilities-list"></div>
				<div class="animal-abilities-section"></div>
			</div>
			<div id="game-screen" style="display: none;">
				<div id="players-container"></div>
				<div class="action-buttons">
					<button data-action="attack">Attack</button>
					<button data-action="ability">Ability</button>
					<button data-action="heal">Heal</button>
					<button data-action="shield">Shield</button>
					<button data-action="nothing">Nothing</button>
				</div>
				<button id="undo-btn">Undo</button>
				<div id="game-log"></div>
			</div>
			<button id="play-again-btn">Play Again</button>
			<button id="save-log-btn">Save</button>
			<button id="save-log-game-over-btn">Save</button>
			<button id="copy-log-btn">Copy</button>
			<button id="copy-log-game-over-btn">Copy</button>
			<button id="close-shortcuts-btn">Close</button>
			<button id="theme-toggle-btn">Theme</button>
			<button id="mute-toggle-btn">Mute</button>
			<button id="view-log-btn">View</button>
			<button id="close-fullscreen-log-btn">Close</button>
			<button id="copy-log-fullscreen-btn">Copy</button>
			<button id="save-log-fullscreen-btn">Save</button>
			<div id="keyboard-shortcuts-modal" style="display: none;"></div>
			<div id="fullscreen-log-modal" style="display: none;">
				<div id="fullscreen-log-content"></div>
			</div>
		`;

		setUnlockedAnimals(new Set(['Coyote']));

		(global as any).lucide = {
			createIcons: vi.fn(),
		};
	});

	it('sets up event listeners without errors', () => {
		expect(() => setupEventListeners()).not.toThrow();
	});

	it('player count select triggers update', () => {
		setupEventListeners();
		const playerCountSelect = document.getElementById('player-count') as HTMLSelectElement;
		const event = new Event('change');
		expect(() => playerCountSelect.dispatchEvent(event)).not.toThrow();
	});

	it('theme toggle button exists and is clickable', () => {
		setupEventListeners();
		const themeToggleBtn = document.getElementById('theme-toggle-btn');
		expect(themeToggleBtn).toBeTruthy();
		const event = new MouseEvent('click');
		expect(() => themeToggleBtn!.dispatchEvent(event)).not.toThrow();
	});

	it('mute toggle button exists and is clickable', () => {
		setupEventListeners();
		const muteToggleBtn = document.getElementById('mute-toggle-btn');
		expect(muteToggleBtn).toBeTruthy();
		const event = new MouseEvent('click');
		expect(() => muteToggleBtn!.dispatchEvent(event)).not.toThrow();
	});
});

describe('Theme initialization', () => {
	beforeEach(() => {
		document.body.innerHTML = '<button id="theme-toggle-btn"></button>';
		document.body.classList.remove('dark-mode');
		localStorage.clear();

		(global as any).lucide = {
			createIcons: vi.fn(),
		};
	});

	it('initializes light theme by default', () => {
		initializeTheme();
		expect(document.body.classList.contains('dark-mode')).toBe(false);
	});

	it('initializes dark theme from storage', () => {
		localStorage.setItem('animalKingdomTheme', 'dark');
		initializeTheme();
		expect(document.body.classList.contains('dark-mode')).toBe(true);
	});
});
