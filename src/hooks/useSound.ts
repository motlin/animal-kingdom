import {useState, useEffect, useCallback} from 'react';
import type {SoundType} from '../lib/types.ts';
import {
	initializeAudioContext,
	setMuted as setMutedInSound,
	isSoundMuted,
	playSound as playSoundFromSound,
} from '../sound.ts';

export interface UseSoundReturn {
	isMuted: boolean;
	setIsMuted: (muted: boolean) => void;
	playSound: (type: SoundType) => void;
}

export function useSound(): UseSoundReturn {
	const [isMuted, setIsMutedState] = useState<boolean>(() => isSoundMuted());

	useEffect(() => {
		initializeAudioContext();
	}, []);

	const setIsMuted = useCallback((muted: boolean) => {
		setIsMutedState(muted);
		setMutedInSound(muted);
	}, []);

	const playSound = useCallback((type: SoundType) => {
		playSoundFromSound(type);
	}, []);

	return {
		isMuted,
		setIsMuted,
		playSound,
	};
}
