import type {SoundType} from './lib/types.ts';

let audioContext: AudioContext;
let isMuted = false;

export function initializeAudioContext(): void {
	audioContext = new (
		window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext
	)();
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
		case 'attack': {
			// Aggressive slash sound - deeper and more brutal
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(150, now);
			oscillator.frequency.exponentialRampToValueAtTime(60, now + 0.15);
			gainNode.gain.setValueAtTime(0.5, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
			oscillator.start(now);
			oscillator.stop(now + 0.15);

			// Add a secondary impact sound
			const impactOsc = audioContext.createOscillator();
			const impactGain = audioContext.createGain();
			impactOsc.connect(impactGain);
			impactGain.connect(audioContext.destination);
			impactOsc.type = 'square';
			impactOsc.frequency.setValueAtTime(80, now + 0.05);
			impactOsc.frequency.exponentialRampToValueAtTime(40, now + 0.2);
			impactGain.gain.setValueAtTime(0.3, now + 0.05);
			impactGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
			impactOsc.start(now + 0.05);
			impactOsc.stop(now + 0.2);
			return;
		}

		case 'damage': {
			// Brutal impact sound
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(300, now);
			oscillator.frequency.exponentialRampToValueAtTime(80, now + 0.25);
			gainNode.gain.setValueAtTime(0.4, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
			oscillator.start(now);
			oscillator.stop(now + 0.25);

			// Add crunch/impact layer
			const crunchOsc = audioContext.createOscillator();
			const crunchGain = audioContext.createGain();
			crunchOsc.connect(crunchGain);
			crunchGain.connect(audioContext.destination);
			crunchOsc.type = 'square';
			crunchOsc.frequency.setValueAtTime(120, now);
			crunchOsc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
			crunchGain.gain.setValueAtTime(0.25, now);
			crunchGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
			crunchOsc.start(now);
			crunchOsc.stop(now + 0.1);
			return;
		}

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

		case 'snapback':
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(150, now);
			oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.15);
			gainNode.gain.setValueAtTime(0.3, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
			oscillator.start(now);
			oscillator.stop(now + 0.15);
			break;

		case 'defeat': {
			// Dramatic death sound - descending doom tones
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(400, now);
			oscillator.frequency.exponentialRampToValueAtTime(50, now + 0.8);
			gainNode.gain.setValueAtTime(0.4, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
			oscillator.start(now);
			oscillator.stop(now + 0.8);

			// Add ominous undertone
			const doomOsc = audioContext.createOscillator();
			const doomGain = audioContext.createGain();
			doomOsc.connect(doomGain);
			doomGain.connect(audioContext.destination);
			doomOsc.type = 'sine';
			doomOsc.frequency.setValueAtTime(100, now);
			doomOsc.frequency.exponentialRampToValueAtTime(30, now + 1);
			doomGain.gain.setValueAtTime(0.3, now);
			doomGain.gain.exponentialRampToValueAtTime(0.01, now + 1);
			doomOsc.start(now);
			doomOsc.stop(now + 1);
			return;
		}

		case 'victory': {
			// Triumphant war victory - powerful ascending fanfare
			const victoryNotes = [196, 247, 294, 392, 494, 587];
			victoryNotes.forEach((freq, index) => {
				setTimeout(() => {
					const victoryOsc = audioContext.createOscillator();
					const victoryOsc2 = audioContext.createOscillator();
					const victoryGain = audioContext.createGain();
					victoryOsc.connect(victoryGain);
					victoryOsc2.connect(victoryGain);
					victoryGain.connect(audioContext.destination);
					victoryOsc.type = 'sawtooth';
					victoryOsc2.type = 'square';
					const victoryNow = audioContext.currentTime;
					victoryOsc.frequency.setValueAtTime(freq, victoryNow);
					victoryOsc2.frequency.setValueAtTime(freq * 1.5, victoryNow);
					victoryGain.gain.setValueAtTime(0.25, victoryNow);
					victoryGain.gain.exponentialRampToValueAtTime(0.01, victoryNow + 0.4);
					victoryOsc.start(victoryNow);
					victoryOsc2.start(victoryNow);
					victoryOsc.stop(victoryNow + 0.4);
					victoryOsc2.stop(victoryNow + 0.4);
				}, index * 120);
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

		case 'battle_start': {
			// Epic battle horn/gong - announces the fight with intensity
			// Deep gong hit
			oscillator.type = 'sine';
			oscillator.frequency.setValueAtTime(80, now);
			oscillator.frequency.exponentialRampToValueAtTime(60, now + 1.5);
			gainNode.gain.setValueAtTime(0.5, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
			oscillator.start(now);
			oscillator.stop(now + 1.5);

			// War horn ascending
			const hornOsc = audioContext.createOscillator();
			const hornGain = audioContext.createGain();
			hornOsc.connect(hornGain);
			hornGain.connect(audioContext.destination);
			hornOsc.type = 'sawtooth';
			hornOsc.frequency.setValueAtTime(150, now + 0.1);
			hornOsc.frequency.linearRampToValueAtTime(300, now + 0.6);
			hornOsc.frequency.linearRampToValueAtTime(250, now + 1);
			hornGain.gain.setValueAtTime(0.35, now + 0.1);
			hornGain.gain.linearRampToValueAtTime(0.4, now + 0.5);
			hornGain.gain.exponentialRampToValueAtTime(0.01, now + 1.2);
			hornOsc.start(now + 0.1);
			hornOsc.stop(now + 1.2);

			// Cymbal crash
			const crashOsc = audioContext.createOscillator();
			const crashGain = audioContext.createGain();
			crashOsc.connect(crashGain);
			crashGain.connect(audioContext.destination);
			crashOsc.type = 'square';
			crashOsc.frequency.setValueAtTime(3000, now + 0.05);
			crashOsc.frequency.exponentialRampToValueAtTime(100, now + 0.5);
			crashGain.gain.setValueAtTime(0.15, now + 0.05);
			crashGain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
			crashOsc.start(now + 0.05);
			crashOsc.stop(now + 0.5);
			return;
		}

		case 'dramatic_hit': {
			// Heavy impact for dramatic moments
			oscillator.type = 'sawtooth';
			oscillator.frequency.setValueAtTime(100, now);
			oscillator.frequency.exponentialRampToValueAtTime(30, now + 0.4);
			gainNode.gain.setValueAtTime(0.6, now);
			gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
			oscillator.start(now);
			oscillator.stop(now + 0.4);

			// Sub bass rumble
			const subOsc = audioContext.createOscillator();
			const subGain = audioContext.createGain();
			subOsc.connect(subGain);
			subGain.connect(audioContext.destination);
			subOsc.type = 'sine';
			subOsc.frequency.setValueAtTime(50, now);
			subOsc.frequency.exponentialRampToValueAtTime(25, now + 0.6);
			subGain.gain.setValueAtTime(0.4, now);
			subGain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
			subOsc.start(now);
			subOsc.stop(now + 0.6);
			return;
		}

		case 'war_cry': {
			// Intense battle cry sound
			for (let i = 0; i < 3; i++) {
				setTimeout(() => {
					const cryOsc = audioContext.createOscillator();
					const cryGain = audioContext.createGain();
					cryOsc.connect(cryGain);
					cryGain.connect(audioContext.destination);
					cryOsc.type = 'sawtooth';
					const cryNow = audioContext.currentTime;
					cryOsc.frequency.setValueAtTime(200 + i * 100, cryNow);
					cryOsc.frequency.linearRampToValueAtTime(400 + i * 100, cryNow + 0.15);
					cryOsc.frequency.linearRampToValueAtTime(150 + i * 50, cryNow + 0.3);
					cryGain.gain.setValueAtTime(0.35, cryNow);
					cryGain.gain.exponentialRampToValueAtTime(0.01, cryNow + 0.3);
					cryOsc.start(cryNow);
					cryOsc.stop(cryNow + 0.3);
				}, i * 100);
			}
			return;
		}
	}
}
