import {state, stateHistory} from './game-state.ts';
import {getElement, querySelector, querySelectorAll} from './dom.ts';
import {ABILITY_NAMES} from './constants.ts';

declare const lucide: {createIcons: () => void};

export function render(): void {
	renderPlayers();
	renderControls();
	renderLog();
}

export function renderPlayers(): void {
	const playersContainer = getElement('players-container');
	playersContainer.innerHTML = '';

	state.players.forEach((player) => {
		const card = document.createElement('div');
		card.classList.add('player-card');
		card.dataset['playerId'] = player.id.toString();
		if (!player.isAlive) card.classList.add('dead');
		if (player.id === state.currentPlayerIndex && player.isAlive) card.classList.add('active');

		if (state.actionInProgress) {
			const {type, sourceId, targets} = state.actionInProgress;
			const isSelf = player.id === sourceId;
			const isAlreadyTargeted = targets.includes(player.id);

			let isSelectable = false;
			if (type === 'attack' || type === 'spitball' || type === 'rampage') {
				isSelectable = !isSelf && player.isAlive;
			} else if (type === 'strike') {
				isSelectable = !isSelf && player.isAlive && !isAlreadyTargeted;
			} else if (type === 'mischief') {
				isSelectable = !isSelf && player.isAlive;
			}

			if (isSelectable) {
				card.classList.add('selectable');
			}
		}

		const hpPercentage = Math.min((player.hp / player.maxHp) * 100, 100);
		let hpColor;
		if (player.hp > player.maxHp) {
			hpColor = '#3498DB';
		} else if (hpPercentage > 60) {
			hpColor = 'var(--hp-full)';
		} else if (hpPercentage > 30) {
			hpColor = 'var(--hp-medium)';
		} else {
			hpColor = 'var(--hp-low)';
		}

		let statusIconsHTML = '';
		if (player.status.isShielded)
			statusIconsHTML += `<div class="status-icon" title="Shielded">🛡️<span class="tooltip">Blocking next damage</span></div>`;
		if (player.status.isSleeping)
			statusIconsHTML += `<div class="status-icon" title="Sleeping">💤<span class="tooltip">Skipping next turn</span></div>`;
		if (player.oneTimeActions.hasHealed)
			statusIconsHTML += `<div class="status-icon" title="Heal Used">💚<span class="tooltip">Heal has been used</span></div>`;
		if (player.oneTimeActions.hasShielded)
			statusIconsHTML += `<div class="status-icon" title="Shield Used">🛡️<span class="tooltip">Shield has been used</span></div>`;
		if (player.abilityCooldown > 0)
			statusIconsHTML += `<div class="status-icon" title="Ability on Cooldown">⏳<span class="tooltip">Ability on cooldown (${player.abilityCooldown} turn/s)</span></div>`;
		if (player.abilityDisabled)
			statusIconsHTML += `<div class="status-icon" title="Ability Disabled">🚫<span class="tooltip">Ability permanently disabled</span></div>`;
		if (
			player.oneTimeActions.hasUsedAbility &&
			(player.animal === 'Gorilla' || player.animal === 'Monkey')
		)
			statusIconsHTML += `<div class="status-icon" title="Ability Used">✓<span class="tooltip">One-time ability has been used</span></div>`;

		card.innerHTML = `
			<div class="player-info">
				<span class="player-name">${player.animal}</span>
				<span class="animal-name">${player.name}</span>
			</div>
			<div class="hp-bar-container">
				<div class="hp-bar" style="width: ${hpPercentage}%; background-color: ${hpColor};"></div>
			</div>
			<div>HP: ${player.hp} / ${player.maxHp}</div>
			<div class="status-icons">${statusIconsHTML}</div>
		`;
		playersContainer.appendChild(card);
	});
}

export function renderControls(): void {
	const currentPlayer = state.players[state.currentPlayerIndex];
	if (!currentPlayer) return;

	const turnIndicator = getElement('turn-indicator');
	turnIndicator.textContent = state.actionInProgress
		? state.actionInProgress.prompt
		: `It's ${currentPlayer.name}'s (${currentPlayer.animal}) turn!`;

	const isGameEnding = state.gameState === 'gameEnding';

	const abilityButton = querySelector<HTMLButtonElement>('[data-action="ability"]');
	abilityButton.innerHTML = `<i data-lucide="sparkles"></i><span>Use A<u>b</u>ility: ${ABILITY_NAMES[currentPlayer.animal]}</span>`;
	abilityButton.disabled = isGameEnding || currentPlayer.abilityCooldown > 0 || currentPlayer.abilityDisabled;
	lucide.createIcons();

	querySelector<HTMLButtonElement>('[data-action="heal"]').disabled = isGameEnding || currentPlayer.oneTimeActions.hasHealed;
	querySelector<HTMLButtonElement>('[data-action="shield"]').disabled = isGameEnding || currentPlayer.oneTimeActions.hasShielded;
	querySelector<HTMLButtonElement>('[data-action="attack"]').disabled = isGameEnding;
	querySelector<HTMLButtonElement>('[data-action="nothing"]').disabled = isGameEnding;

	if (currentPlayer.animal === 'Tiger') {
		const livingOpponents = state.players.filter(
			(p) => p.isAlive && p.id !== currentPlayer.id,
		).length;
		if (livingOpponents < 2) {
			abilityButton.disabled = true;
		}
	}

	if (currentPlayer.animal === 'Gorilla' || currentPlayer.animal === 'Monkey') {
		if (currentPlayer.oneTimeActions.hasUsedAbility) {
			abilityButton.disabled = true;
		}
	}

	querySelectorAll<HTMLButtonElement>('.action-buttons button').forEach((btn) => {
		if (state.actionInProgress) {
			btn.style.display = 'none';
		} else {
			btn.style.display = 'inline-flex';
		}
	});

	const undoBtn = getElement<HTMLButtonElement>('undo-btn');
	undoBtn.disabled = stateHistory.length === 0 || !!state.actionInProgress || currentPlayer.isComputer || isGameEnding;
}

export function renderLog(): void {
	const gameLog = getElement('game-log');
	gameLog.innerHTML = state.log
		.map((entry, index) => {
			let prefix = '';
			if (entry.indent > 0) {
				const nextEntry = state.log[index + 1];
				const hasNextSibling = nextEntry && nextEntry.indent === entry.indent;
				const hasChildren = nextEntry && nextEntry.indent > entry.indent;

				if (entry.indent === 1) {
					if (hasChildren) {
						prefix = hasNextSibling ? '├─┐ ' : '└─┐ ';
					} else {
						prefix = hasNextSibling ? '├── ' : '└── ';
					}
				} else if (entry.indent === 2) {
					const connector = hasNextSibling ? '├─┐ ' : '└─┐ ';
					if (hasChildren) {
						prefix = '  ' + connector;
					} else {
						prefix = '  ' + (hasNextSibling ? '├── ' : '└── ');
					}
				} else if (entry.indent === 3) {
					const connector = hasNextSibling ? '├── ' : '└── ';
					prefix = '    ' + connector;
				}
			}
			return `<div class="log-entry">${prefix}${entry.message}</div>`;
		})
		.join('');
	gameLog.scrollTop = gameLog.scrollHeight;
}

export function getLogText(): string {
	return state.log
		.map((entry, index) => {
			if (entry.indent === 0) {
				return entry.message;
			}

			const nextEntry = state.log[index + 1];
			const hasNextSibling = nextEntry && nextEntry.indent === entry.indent;
			const hasChildren = nextEntry && nextEntry.indent > entry.indent;

			let prefix = '';
			if (entry.indent === 1) {
				if (hasChildren) {
					prefix = hasNextSibling ? '├─┐ ' : '└─┐ ';
				} else {
					prefix = hasNextSibling ? '├── ' : '└── ';
				}
			} else if (entry.indent === 2) {
				const connector = hasNextSibling ? '├─┐ ' : '└─┐ ';
				if (hasChildren) {
					prefix = '  ' + connector;
				} else {
					prefix = '  ' + (hasNextSibling ? '├── ' : '└── ');
				}
			} else if (entry.indent === 3) {
				const connector = hasNextSibling ? '├── ' : '└── ';
				prefix = '    ' + connector;
			}

			return prefix + entry.message;
		})
		.join('\n');
}
