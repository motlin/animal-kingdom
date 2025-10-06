import type {AnimalType, GameMode, Player} from './types.ts';
import {ANIMAL_ROSTER, ANIMAL_EMOJIS} from './constants.ts';
import {unlockedAnimals, initializeState, logMessage, createPlayer} from './game-state.ts';
import {getElement, querySelector, querySelectorAll} from './dom.ts';
import {startTurn} from './game-flow.ts';

declare const lucide: {createIcons: () => void};

let currentMode: GameMode = 'standard';
let selectedChallengerAnimal: AnimalType | null = null;
let selectedOpponentAnimal: AnimalType | null = null;

export function updateAbilitiesList(): void {
	const abilitiesList = querySelector('.abilities-list');
	const abilitiesHTML = Object.keys(ANIMAL_ROSTER)
		.filter((animal) => unlockedAnimals.has(animal))
		.map((animal) => {
			const emoji = ANIMAL_EMOJIS[animal as AnimalType];
			const desc = ANIMAL_ROSTER[animal as AnimalType].abilityDesc;
			return `<div class="ability-item">
				<strong>${emoji} ${animal}</strong>
				<p>${desc}</p>
			</div>`;
		})
		.join('');

	abilitiesList.innerHTML = abilitiesHTML;
}

export function toggleAbilities(): void {
	const section = querySelector('.animal-abilities-section');
	const abilitiesList = querySelector('.abilities-list');
	const toggleAbilitiesBtn = getElement('toggle-abilities-btn');

	const isHidden = abilitiesList.classList.toggle('hidden');
	if (isHidden) {
		section.classList.add('collapsed');
		toggleAbilitiesBtn.innerHTML = '<i data-lucide="chevron-down"></i><span>Show Abilities</span>';
	} else {
		section.classList.remove('collapsed');
		toggleAbilitiesBtn.innerHTML = '<i data-lucide="chevron-up"></i><span>Hide Abilities</span>';
	}
	lucide.createIcons();
}

export function switchMode(mode: GameMode): void {
	currentMode = mode;
	const standardModeBtn = getElement('standard-mode-btn');
	const challengerModeBtn = getElement('challenger-mode-btn');
	const standardSetup = getElement('standard-setup');
	const challengerSetup = getElement('challenger-setup');
	const startGameBtn = getElement('start-game-btn');

	if (mode === 'standard') {
		standardModeBtn.classList.add('active');
		challengerModeBtn.classList.remove('active');
		standardSetup.style.display = 'block';
		challengerSetup.style.display = 'none';
		startGameBtn.textContent = 'Start Game';
		lucide.createIcons();
	} else {
		standardModeBtn.classList.remove('active');
		challengerModeBtn.classList.add('active');
		standardSetup.style.display = 'none';
		challengerSetup.style.display = 'block';
		startGameBtn.innerHTML = '<i data-lucide="play"></i><span>Fight Challenger</span>';
		lucide.createIcons();
		updateChallengerMode();
	}
	updateStartButtonState();
}

export function updateChallengerMode(): void {
	if (currentMode !== 'challenger') return;

	const unlockedAnimalsGrid = getElement('unlocked-animals-grid');
	const challengerOpponentDisplay = getElement('challenger-opponent-display');
	const lockedAnimals = (Object.keys(ANIMAL_ROSTER) as AnimalType[]).filter(animal => !unlockedAnimals.has(animal));

	unlockedAnimalsGrid.innerHTML = '';
	([...unlockedAnimals] as AnimalType[]).forEach(animal => {
		const card = document.createElement('div');
		card.classList.add('animal-choice-card');
		if (selectedChallengerAnimal === animal) {
			card.classList.add('selected');
		}
		card.innerHTML = `
			<div class="animal-choice-name">${animal}</div>
			<div class="animal-choice-desc">${ANIMAL_ROSTER[animal].abilityDesc}</div>
		`;
		card.addEventListener('click', () => {
			selectedChallengerAnimal = animal;
			updateChallengerMode();
			updateStartButtonState();
		});
		unlockedAnimalsGrid.appendChild(card);
	});

	if (lockedAnimals.length > 0) {
		if (!selectedOpponentAnimal || unlockedAnimals.has(selectedOpponentAnimal)) {
			selectedOpponentAnimal = lockedAnimals[Math.floor(Math.random() * lockedAnimals.length)]!;
		}
		challengerOpponentDisplay.innerHTML = `
			<div class="challenger-opponent-card">
				<div class="opponent-name">${selectedOpponentAnimal}</div>
				<div class="opponent-label">Computer Opponent</div>
			</div>
		`;
	} else {
		challengerOpponentDisplay.innerHTML = `
			<div class="no-challengers">
				<p>All animals unlocked!</p>
				<p>Play standard mode to test your skills.</p>
			</div>
		`;
	}
}

export function updateStartButtonState(): void {
	const startGameBtn = getElement<HTMLButtonElement>('start-game-btn');
	if (currentMode === 'challenger') {
		const lockedAnimals = (Object.keys(ANIMAL_ROSTER) as AnimalType[]).filter(animal => !unlockedAnimals.has(animal));
		startGameBtn.disabled = !selectedChallengerAnimal || lockedAnimals.length === 0;
	} else {
		startGameBtn.disabled = false;
	}
}

export function updatePlayerSelections(): void {
	const playerCountSelect = getElement<HTMLSelectElement>('player-count');
	const playerSelectionsContainer = getElement('player-selections');

	const count = parseInt(playerCountSelect.value, 10);
	const existingData: Array<{name: string; animal: string; playerType: string}> = [];
	querySelectorAll<HTMLDivElement>('.player-setup').forEach((setupDiv) => {
		const nameInput = setupDiv.querySelector<HTMLInputElement>('input[type="text"]');
		const animalSelect = setupDiv.querySelector<HTMLSelectElement>('select');
		const playerTypeSelect = setupDiv.querySelector<HTMLSelectElement>('.player-type-select');
		existingData.push({
			name: nameInput ? nameInput.value : '',
			animal: animalSelect ? animalSelect.value : '',
			playerType: playerTypeSelect ? playerTypeSelect.value : 'human',
		});
	});

	playerSelectionsContainer.innerHTML = '';
	for (let i = 1; i <= count; i++) {
		const playerSetupDiv = document.createElement('div');
		playerSetupDiv.classList.add('player-setup');

		const label = document.createElement('label');
		label.textContent = `Player ${i}:`;
		label.htmlFor = `player${i}-name`;

		const nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.id = `player${i}-name`;
		nameInput.placeholder = `Player ${i}`;
		nameInput.dataset['playerId'] = i.toString();
		if (existingData[i - 1] && existingData[i - 1]!.name) {
			nameInput.value = existingData[i - 1]!.name;
		}

		const select = document.createElement('select');
		select.id = `player${i}-animal`;
		select.dataset['playerId'] = i.toString();

		const previousAnimal = existingData[i - 1] ? existingData[i - 1]!.animal : '';

		const playerTypeSelect = document.createElement('select');
		playerTypeSelect.classList.add('player-type-select');
		playerTypeSelect.id = `player${i}-type`;
		playerTypeSelect.dataset['playerId'] = i.toString();

		const humanOption = document.createElement('option');
		humanOption.value = 'human';
		humanOption.textContent = 'Human';
		playerTypeSelect.appendChild(humanOption);

		const computerOption = document.createElement('option');
		computerOption.value = 'computer';
		computerOption.textContent = 'Computer';
		playerTypeSelect.appendChild(computerOption);

		const previousPlayerType = existingData[i - 1] ? existingData[i - 1]!.playerType : 'human';
		playerTypeSelect.value = previousPlayerType;

		const updateAnimalSelectOptions = (): void => {
			const isHuman = playerTypeSelect.value === 'human';
			const currentValue = select.value || previousAnimal;
			select.innerHTML = '';

			const availableAnimals = isHuman
				? (Object.keys(ANIMAL_ROSTER) as AnimalType[]).filter((animal) => unlockedAnimals.has(animal))
				: (Object.keys(ANIMAL_ROSTER) as AnimalType[]);

			availableAnimals.forEach((animal) => {
				const option = document.createElement('option');
				option.value = animal;
				option.textContent = animal;
				select.appendChild(option);
			});

			if (availableAnimals.includes(currentValue as AnimalType)) {
				select.value = currentValue;
			} else if (availableAnimals.length > 0) {
				select.value = availableAnimals[0]!;
			}
		};

		playerTypeSelect.addEventListener('change', updateAnimalSelectOptions);
		updateAnimalSelectOptions();

		playerSetupDiv.appendChild(label);
		playerSetupDiv.appendChild(nameInput);
		playerSetupDiv.appendChild(select);
		playerSetupDiv.appendChild(playerTypeSelect);
		playerSelectionsContainer.appendChild(playerSetupDiv);
	}
}

export function startGame(): void {
	const players: Player[] = [];
	const setupScreen = getElement('setup-screen');
	const gameScreen = getElement('game-screen');

	if (currentMode === 'challenger') {
		if (!selectedChallengerAnimal || !selectedOpponentAnimal) return;

		players.push(createPlayer(0, 'You', selectedChallengerAnimal, false));
		players.push(createPlayer(1, 'Challenger', selectedOpponentAnimal, true));
	} else {
		const setupDivs = querySelectorAll<HTMLDivElement>('.player-setup');
		setupDivs.forEach((setupDiv, index) => {
			const nameInput = setupDiv.querySelector<HTMLInputElement>('input[type="text"]');
			const animalSelect = setupDiv.querySelector<HTMLSelectElement>('select');
			const playerTypeSelect = setupDiv.querySelector<HTMLSelectElement>('.player-type-select');
			const playerName = nameInput?.value.trim() || `Player ${index + 1}`;
			const animalType = animalSelect?.value || 'Coyote';
			const playerType = playerTypeSelect?.value || 'human';

			players.push(createPlayer(index, playerName, animalType, playerType === 'computer'));
		});
	}

	initializeState(players);

	logMessage('The battle for the Animal Kingdom begins!');
	players.forEach((player) => {
		logMessage(`${player.name} is the ${player.animal}`, 1);
	});
	const firstPlayer = players[0];
	if (firstPlayer) {
		logMessage(
			`${firstPlayer.name} (${firstPlayer.animal}) will go first!`,
			1,
		);
	}

	setupScreen.style.display = 'none';
	gameScreen.style.display = 'flex';
	document.body.classList.add('game-active');

	startTurn();
}
