import {useEffect} from 'react';

export interface UseKeyboardOptions {
	enabled?: boolean;
	onAttack?: () => void;
	onUseAbility?: () => void;
	onHeal?: () => void;
	onShield?: () => void;
	onDoNothing?: () => void;
	onUndo?: () => void;
}

export function useKeyboard(options: UseKeyboardOptions) {
	const {enabled = true, onAttack, onUseAbility, onHeal, onShield, onDoNothing, onUndo} = options;

	useEffect(() => {
		if (!enabled) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			const key = event.key.toLowerCase();

			if (key === 'a' && onAttack) {
				onAttack();
				event.preventDefault();
			} else if (key === 'b' && onUseAbility) {
				onUseAbility();
				event.preventDefault();
			} else if (key === 'h' && onHeal) {
				onHeal();
				event.preventDefault();
			} else if (key === 's' && onShield) {
				onShield();
				event.preventDefault();
			} else if (key === 'n' && onDoNothing) {
				onDoNothing();
				event.preventDefault();
			} else if (key === 'u' && onUndo) {
				onUndo();
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [enabled, onAttack, onUseAbility, onHeal, onShield, onDoNothing, onUndo]);
}
