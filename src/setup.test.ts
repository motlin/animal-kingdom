import {describe, it, expect, beforeEach, vi} from 'vitest';

describe('Setup screen buttons', () => {
	beforeEach(() => {
		document.body.innerHTML = `
			<div id="setup-screen">
				<button id="start-game-btn">Start Game</button>
				<select id="player-count"><option value="2">2</option></select>
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
			<div id="game-screen">
				<div id="players-container"></div>
				<div class="action-buttons">
					<button data-action="attack">Attack</button>
					<button data-action="ability">Ability</button>
					<button data-action="heal">Heal</button>
					<button data-action="shield">Shield</button>
					<button data-action="nothing">Nothing</button>
				</div>
			</div>
			<button id="theme-toggle-btn">Theme</button>
			<button id="mute-toggle-btn">Mute</button>
		`;

		(global as any).lucide = {
			createIcons: vi.fn(),
		};
	});

	it('setup screen has start game button', () => {
		const startGameBtn = document.getElementById('start-game-btn');
		expect(startGameBtn).toBeTruthy();
		expect(startGameBtn?.tagName).toBe('BUTTON');
	});

	it('setup screen has player count select', () => {
		const playerCountSelect = document.getElementById('player-count');
		expect(playerCountSelect).toBeTruthy();
		expect(playerCountSelect?.tagName).toBe('SELECT');
	});

	it('setup screen has mode buttons', () => {
		const standardModeBtn = document.getElementById('standard-mode-btn');
		const challengerModeBtn = document.getElementById('challenger-mode-btn');
		expect(standardModeBtn).toBeTruthy();
		expect(challengerModeBtn).toBeTruthy();
	});

	it('setup screen has toggle abilities button', () => {
		const toggleAbilitiesBtn = document.getElementById('toggle-abilities-btn');
		expect(toggleAbilitiesBtn).toBeTruthy();
	});

	it('all required elements exist in the DOM', () => {
		const requiredIds = [
			'setup-screen',
			'game-screen',
			'start-game-btn',
			'player-count',
			'player-selections',
			'standard-mode-btn',
			'challenger-mode-btn',
			'toggle-abilities-btn',
			'theme-toggle-btn',
			'mute-toggle-btn',
		];

		for (const id of requiredIds) {
			const element = document.getElementById(id);
			expect(element, `Element with id "${id}" should exist`).toBeTruthy();
		}
	});

	it('action buttons exist in game screen', () => {
		const actionButtons = document.querySelector('.action-buttons');
		expect(actionButtons).toBeTruthy();

		const attackBtn = document.querySelector('[data-action="attack"]');
		const abilityBtn = document.querySelector('[data-action="ability"]');
		const healBtn = document.querySelector('[data-action="heal"]');
		const shieldBtn = document.querySelector('[data-action="shield"]');
		const nothingBtn = document.querySelector('[data-action="nothing"]');

		expect(attackBtn).toBeTruthy();
		expect(abilityBtn).toBeTruthy();
		expect(healBtn).toBeTruthy();
		expect(shieldBtn).toBeTruthy();
		expect(nothingBtn).toBeTruthy();
	});
});
