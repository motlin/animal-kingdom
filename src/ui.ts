import {getElement} from './dom.ts';
import {getLogText} from './render.ts';
import {state} from './game-state.ts';

declare const lucide: {createIcons: () => void};

export function showConfetti(): void {
	const confettiContainer = document.createElement('div');
	confettiContainer.id = 'confetti-container';
	confettiContainer.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		pointer-events: none;
		z-index: 50;
	`;
	document.body.appendChild(confettiContainer);

	const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
	const confettiCount = 100;

	for (let i = 0; i < confettiCount; i++) {
		const confetti = document.createElement('div');
		confetti.style.cssText = `
			position: absolute;
			width: 10px;
			height: 10px;
			background-color: ${colors[Math.floor(Math.random() * colors.length)]};
			top: -10px;
			left: ${Math.random() * 100}%;
			opacity: ${0.7 + Math.random() * 0.3};
			transform: rotate(${Math.random() * 360}deg);
		`;
		confettiContainer.appendChild(confetti);

		const duration = 2000 + Math.random() * 1000;
		const startTime = Date.now();
		const startLeft = parseFloat(confetti.style.left);
		const horizontalDrift = (Math.random() - 0.5) * 30;

		const animate = (): void => {
			const elapsed = Date.now() - startTime;
			const progress = elapsed / duration;

			if (progress < 1) {
				confetti.style.top = `${progress * 110}vh`;
				confetti.style.left = `${startLeft + horizontalDrift * progress}%`;
				confetti.style.transform = `rotate(${progress * 720}deg)`;
				requestAnimationFrame(animate);
			} else {
				confetti.remove();
			}
		};

		setTimeout(() => requestAnimationFrame(animate), Math.random() * 100);
	}

	setTimeout(() => {
		confettiContainer.remove();
	}, 3500);
}

export function showKeyboardShortcuts(): void {
	getElement('keyboard-shortcuts-modal').style.display = 'flex';
}

export function hideKeyboardShortcuts(): void {
	getElement('keyboard-shortcuts-modal').style.display = 'none';
}

export function showFullscreenLog(): void {
	const logHTML = state.log
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
	getElement('fullscreen-log-content').innerHTML = logHTML;
	getElement('fullscreen-log-modal').style.display = 'flex';
}

export function hideFullscreenLog(): void {
	getElement('fullscreen-log-modal').style.display = 'none';
}

export function saveGameLog(): void {
	const logText = getLogText();
	const blob = new Blob([logText], {type: 'text/plain'});
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `animal-kingdom-log-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.txt`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}

export function copyGameLog(event: Event): void {
	const logText = getLogText();
	navigator.clipboard
		.writeText(logText)
		.then(() => {
			const buttonClicked = event.target as HTMLButtonElement;
			const originalText = buttonClicked.textContent || '';
			buttonClicked.textContent = 'Copied!';
			buttonClicked.style.backgroundColor = 'var(--hp-full)';
			setTimeout(() => {
				buttonClicked.textContent = originalText;
				buttonClicked.style.backgroundColor = '';
			}, 2000);
		})
		.catch((error) => {
			console.error('Failed to copy log:', error);
			const buttonClicked = event.target as HTMLButtonElement;
			const originalText = buttonClicked.textContent || '';
			buttonClicked.textContent = 'Copy failed';
			buttonClicked.style.backgroundColor = 'var(--hp-low)';
			setTimeout(() => {
				buttonClicked.textContent = originalText;
				buttonClicked.style.backgroundColor = '';
			}, 2000);
		});
}

export function updateThemeToggle(isDark: boolean): void {
	const themeToggleBtn = getElement('theme-toggle-btn');
	themeToggleBtn.innerHTML = isDark ? '<i data-lucide="sun"></i>' : '<i data-lucide="moon"></i>';
	lucide.createIcons();
}

export function updateMuteToggle(isMuted: boolean): void {
	const muteToggleBtn = getElement('mute-toggle-btn');
	muteToggleBtn.innerHTML = isMuted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
	lucide.createIcons();
}
