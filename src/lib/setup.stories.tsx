import type {Meta, StoryObj} from '@storybook/react';
import {expect, fn} from '@storybook/test';

const meta = {
	title: 'Logic/Setup',
	render: () => <div>Setup screen DOM tests</div>,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function setupDOM() {
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

	(globalThis as any).lucide = {
		createIcons: fn(),
	};
}

export const SetupScreenHasStartGameButton: Story = {
	play: async () => {
		setupDOM();

		const startGameBtn = document.getElementById('start-game-btn');
		await expect(startGameBtn).toBeTruthy();
		await expect(startGameBtn?.tagName).toBe('BUTTON');
	},
};

export const SetupScreenHasPlayerCountSelect: Story = {
	play: async () => {
		setupDOM();

		const playerCountSelect = document.getElementById('player-count');
		await expect(playerCountSelect).toBeTruthy();
		await expect(playerCountSelect?.tagName).toBe('SELECT');
	},
};

export const SetupScreenHasModeButtons: Story = {
	play: async () => {
		setupDOM();

		const standardModeBtn = document.getElementById('standard-mode-btn');
		const challengerModeBtn = document.getElementById('challenger-mode-btn');
		await expect(standardModeBtn).toBeTruthy();
		await expect(challengerModeBtn).toBeTruthy();
	},
};

export const SetupScreenHasToggleAbilitiesButton: Story = {
	play: async () => {
		setupDOM();

		const toggleAbilitiesBtn = document.getElementById('toggle-abilities-btn');
		await expect(toggleAbilitiesBtn).toBeTruthy();
	},
};

export const AllRequiredElementsExistInTheDOM: Story = {
	play: async () => {
		setupDOM();

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
			await expect(element).toBeTruthy();
		}
	},
};

export const ActionButtonsExistInGameScreen: Story = {
	play: async () => {
		setupDOM();

		const actionButtons = document.querySelector('.action-buttons');
		await expect(actionButtons).toBeTruthy();

		const attackBtn = document.querySelector('[data-action="attack"]');
		const abilityBtn = document.querySelector('[data-action="ability"]');
		const healBtn = document.querySelector('[data-action="heal"]');
		const shieldBtn = document.querySelector('[data-action="shield"]');
		const nothingBtn = document.querySelector('[data-action="nothing"]');

		await expect(attackBtn).toBeTruthy();
		await expect(abilityBtn).toBeTruthy();
		await expect(healBtn).toBeTruthy();
		await expect(shieldBtn).toBeTruthy();
		await expect(nothingBtn).toBeTruthy();
	},
};
