import {loadUnlockedAnimals, loadMutePreference} from './storage.ts';
import {setUnlockedAnimals} from './game-state.ts';
import {initializeAudioContext, setMuted} from './sound.ts';
import {updateAbilitiesList, updatePlayerSelections, updateChallengerMode} from './setup.ts';
import {setupEventListeners, initializeTheme} from './events.ts';
import {updateMuteToggle} from './ui.ts';

declare const lucide: {createIcons: () => void};

const searchParameters = new URLSearchParams(window.location.search);
const shouldUseReact = searchParameters.has('react');

if (shouldUseReact) {
	document.addEventListener('DOMContentLoaded', async () => {
		const React = await import('react');
		const ReactDOM = await import('react-dom/client');
		const {default: App} = await import('./App.tsx');

		const rootElement = document.querySelector('main');
		if (!rootElement) {
			throw new Error('Main element not found');
		}

		rootElement.innerHTML = '<div id="root"></div>';
		const root = ReactDOM.createRoot(document.querySelector('#root')!);
		root.render(React.createElement(App));
	});
} else {
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
}
