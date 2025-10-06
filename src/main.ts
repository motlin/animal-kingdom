import {loadUnlockedAnimals, loadMutePreference} from './storage.ts';
import {setUnlockedAnimals} from './game-state.ts';
import {initializeAudioContext, setMuted} from './sound.ts';
import {updateAbilitiesList, updatePlayerSelections, updateChallengerMode} from './setup.ts';
import {setupEventListeners, initializeTheme} from './events.ts';
import {updateMuteToggle} from './ui.ts';

declare const lucide: {createIcons: () => void};

document.addEventListener('DOMContentLoaded', () => {
	initializeAudioContext();

	const unlockedAnimals = loadUnlockedAnimals();
	setUnlockedAnimals(unlockedAnimals as Set<string>);

	const isMuted = loadMutePreference();
	setMuted(isMuted);
	updateMuteToggle(isMuted);

	initializeTheme();
	updateAbilitiesList();
	updatePlayerSelections();
	updateChallengerMode();
	setupEventListeners();

	lucide.createIcons();
});
