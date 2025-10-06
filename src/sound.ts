import type {SoundType} from './types.ts';

let audioContext: AudioContext;
let isMuted = false;

export function initializeAudioContext(): void {
	audioContext = new (window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext)();
}

export function setMuted(muted: boolean): void {
	isMuted = muted;
}

export function isSoundMuted(): boolean {
	return isMuted;
}

export function playSound(type: SoundType): void {
	if (isMuted) return;

	const now = audioContext.currentTime;
	const oscillator = audioContext.createOscillator();
	const gainNode = audioContext.createGain();

	oscillator.connect(gainNode);
	gainNode.connect(audioContext.destination);

	switch (type) {
		case 'attack':
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(200, now);
			oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.1);
			gainNode.gain.setValueAtTime(0.3, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
			oscillator.start(now);
			oscillator.stop(now + 0.1);
			break;

		case 'damage':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(440, now);
			oscillator.frequency.exponentialRampToValueAtTime(220, now + 0.15);
			gainNode.gain.setValueAtTime(0.2, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
			oscillator.start(now);
			oscillator.stop(now + 0.15);
			break;

		case 'heal': {
			const healOsc1 = audioContext.createOscillator();
			const healOsc2 = audioContext.createOscillator();
			const healGain = audioContext.createGain();

			healOsc1.connect(healGain);
			healOsc2.connect(healGain);
			healGain.connect(audioContext.destination);

			healOsc1.type = 'sine';
			healOsc2.type = 'sine';
			healOsc1.frequency.setValueAtTime(523.25, now);
			healOsc2.frequency.setValueAtTime(659.25, now);
			healGain.gain.setValueAtTime(0.15, now);
			healGain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

			healOsc1.start(now);
			healOsc2.start(now);
			healOsc1.stop(now + 0.3);
			healOsc2.stop(now + 0.3);
			return;
		}

		case 'shield':
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(300, now);
			oscillator.frequency.linearRampToValueAtTime(400, now + 0.05);
			oscillator.frequency.linearRampToValueAtTime(300, now + 0.1);
			gainNode.gain.setValueAtTime(0.2, now);
			gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
			oscillator.start(now);
			oscillator.stop(now + 0.2);
			break;

		case 'howl':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(200, now);
			oscillator.frequency.linearRampToValueAtTime(400, now + 0.3);
			oscillator.frequency.linearRampToValueAtTime(300, now + 0.6);
			gainNode.gain.setValueAtTime(0.2, now);
			gainNode.gain.linearRampToValueAtTime(0.25, now + 0.3);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
			oscillator.start(now);
			oscillator.stop(now + 0.6);
			break;

		case 'spitball':
			oscillator.type = 'square';
			oscillator.frequency.setValueAtTime(150, now);
			oscillator.frequency.exponentialRampToValueAtTime(300, now + 0.08);
			gainNode.gain.setValueAtTime(0.15, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
			oscillator.start(now);
			oscillator.stop(now + 0.08);
			break;

		case 'strike':
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(250, now);
			oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.12);
			gainNode.gain.setValueAtTime(0.25, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);
			oscillator.start(now);
			oscillator.stop(now + 0.12);

			setTimeout(() => {
				const osc2 = audioContext.createOscillator();
				const gain2 = audioContext.createGain();
				osc2.connect(gain2);
				gain2.connect(audioContext.destination);
				osc2.type = 'sawtooth';
				const now2 = audioContext.currentTime;
				osc2.frequency.setValueAtTime(250, now2);
				osc2.frequency.exponentialRampToValueAtTime(150, now2 + 0.12);
				gain2.gain.setValueAtTime(0.25, now2);
				gain2.gain.exponentialRampToValueAtTime(0.01, now2 + 0.12);
				osc2.start(now2);
				osc2.stop(now2 + 0.12);
			}, 100);
			return;

		case 'rampage':
			for (let i = 0; i < 4; i++) {
				setTimeout(() => {
					const rampOsc = audioContext.createOscillator();
					const rampGain = audioContext.createGain();
					rampOsc.connect(rampGain);
					rampGain.connect(audioContext.destination);
					rampOsc.type = 'sawtooth';
					const rampNow = audioContext.currentTime;
					rampOsc.frequency.setValueAtTime(300 - i * 30, rampNow);
					rampOsc.frequency.exponentialRampToValueAtTime(150 - i * 20, rampNow + 0.08);
					rampGain.gain.setValueAtTime(0.3, rampNow);
					rampGain.gain.exponentialRampToValueAtTime(0.01, rampNow + 0.08);
					rampOsc.start(rampNow);
					rampOsc.stop(rampNow + 0.08);
				}, i * 60);
			}
			return;

		case 'mischief':
			oscillator.type = 'triangle';
			oscillator.frequency.setValueAtTime(800, now);
			oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.25);
			gainNode.gain.setValueAtTime(0.2, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
			oscillator.start(now);
			oscillator.stop(now + 0.25);
			break;

		case 'defeat':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(300, now);
			oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.4);
			gainNode.gain.setValueAtTime(0.2, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
			oscillator.start(now);
			oscillator.stop(now + 0.4);
			break;

		case 'victory': {
			const notes = [523.25, 659.25, 783.99, 1046.5];
			notes.forEach((freq, index) => {
				setTimeout(() => {
					const victoryOsc = audioContext.createOscillator();
					const victoryGain = audioContext.createGain();
					victoryOsc.connect(victoryGain);
					victoryGain.connect(audioContext.destination);
					victoryOsc.type = 'sine';
					const victoryNow = audioContext.currentTime;
					victoryOsc.frequency.setValueAtTime(freq, victoryNow);
					victoryGain.gain.setValueAtTime(0.2, victoryNow);
					victoryGain.gain.exponentialRampToValueAtTime(0.01, victoryNow + 0.3);
					victoryOsc.start(victoryNow);
					victoryOsc.stop(victoryNow + 0.3);
				}, index * 150);
			});
			return;
		}

		case 'nothing':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(200, now);
			gainNode.gain.setValueAtTime(0.1, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
			oscillator.start(now);
			oscillator.stop(now + 0.1);
			break;

		case 'sleep':
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(400, now);
			oscillator.frequency.linearRampToValueAtTime(300, now + 0.2);
			gainNode.gain.setValueAtTime(0.15, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
			oscillator.start(now);
			oscillator.stop(now + 0.2);
			break;
	}
}
