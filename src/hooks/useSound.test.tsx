import {describe, it, expect, vi, beforeEach} from 'vitest';
import {renderHook, act} from '@testing-library/react';
import {useSound} from './useSound.ts';
import * as sound from '../sound.ts';

vi.mock('../sound.ts', () => ({
	initializeAudioContext: vi.fn(),
	setMuted: vi.fn(),
	isSoundMuted: vi.fn(() => false),
	playSound: vi.fn(),
}));

describe('useSound', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('initialization', () => {
		it('initializes audio context on mount', () => {
			renderHook(() => useSound());

			expect(sound.initializeAudioContext).toHaveBeenCalledTimes(1);
		});

		it('loads initial muted state', () => {
			vi.mocked(sound.isSoundMuted).mockReturnValue(true);

			const {result} = renderHook(() => useSound());

			expect(result.current.isMuted).toBe(true);
		});

		it('loads initial unmuted state', () => {
			vi.mocked(sound.isSoundMuted).mockReturnValue(false);

			const {result} = renderHook(() => useSound());

			expect(result.current.isMuted).toBe(false);
		});
	});

	describe('setIsMuted', () => {
		it('updates muted state to true', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.setIsMuted(true);
			});

			expect(result.current.isMuted).toBe(true);
			expect(sound.setMuted).toHaveBeenCalledWith(true);
		});

		it('updates muted state to false', () => {
			vi.mocked(sound.isSoundMuted).mockReturnValue(true);
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.setIsMuted(false);
			});

			expect(result.current.isMuted).toBe(false);
			expect(sound.setMuted).toHaveBeenCalledWith(false);
		});

		it('synchronizes with sound module', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.setIsMuted(true);
			});

			expect(sound.setMuted).toHaveBeenCalledWith(true);

			act(() => {
				result.current.setIsMuted(false);
			});

			expect(sound.setMuted).toHaveBeenCalledWith(false);
		});
	});

	describe('playSound', () => {
		it('calls playSound with attack type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('attack');
			});

			expect(sound.playSound).toHaveBeenCalledWith('attack');
		});

		it('calls playSound with heal type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('heal');
			});

			expect(sound.playSound).toHaveBeenCalledWith('heal');
		});

		it('calls playSound with victory type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('victory');
			});

			expect(sound.playSound).toHaveBeenCalledWith('victory');
		});

		it('calls playSound with howl type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('howl');
			});

			expect(sound.playSound).toHaveBeenCalledWith('howl');
		});

		it('calls playSound with spitball type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('spitball');
			});

			expect(sound.playSound).toHaveBeenCalledWith('spitball');
		});

		it('calls playSound with strike type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('strike');
			});

			expect(sound.playSound).toHaveBeenCalledWith('strike');
		});

		it('calls playSound with rampage type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('rampage');
			});

			expect(sound.playSound).toHaveBeenCalledWith('rampage');
		});

		it('calls playSound with mischief type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('mischief');
			});

			expect(sound.playSound).toHaveBeenCalledWith('mischief');
		});

		it('calls playSound with defeat type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('defeat');
			});

			expect(sound.playSound).toHaveBeenCalledWith('defeat');
		});

		it('calls playSound with damage type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('damage');
			});

			expect(sound.playSound).toHaveBeenCalledWith('damage');
		});

		it('calls playSound with shield type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('shield');
			});

			expect(sound.playSound).toHaveBeenCalledWith('shield');
		});

		it('calls playSound with sleep type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('sleep');
			});

			expect(sound.playSound).toHaveBeenCalledWith('sleep');
		});

		it('calls playSound with nothing type', () => {
			const {result} = renderHook(() => useSound());

			act(() => {
				result.current.playSound('nothing');
			});

			expect(sound.playSound).toHaveBeenCalledWith('nothing');
		});
	});
});
