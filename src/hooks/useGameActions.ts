import {useCallback} from 'react';
import type {Player, GameState} from '../lib/types.ts';
import {playSound} from '../sound.ts';

export interface UseGameActionsReturn {
	applyDamage: (
		target: Player,
		damage: number,
		source: Player,
		logMessage: (message: string, indent?: number) => void,
		unlockAnimal: (animalName: string) => void,
	) => number;
	handleAttack: (
		source: Player,
		target: Player,
		logMessage: (message: string, indent?: number) => void,
		unlockAnimal: (animalName: string) => void,
	) => void;
	handleHeal: (source: Player, logMessage: (message: string, indent?: number) => void) => void;
	handleShield: (source: Player, logMessage: (message: string, indent?: number) => void) => void;
	handleHowl: (source: Player, state: GameState, logMessage: (message: string, indent?: number) => void) => void;
	handleSpitball: (
		source: Player,
		target: Player,
		logMessage: (message: string, indent?: number) => void,
		unlockAnimal: (animalName: string) => void,
	) => void;
	handleStrike: (
		source: Player,
		target1: Player,
		target2: Player,
		logMessage: (message: string, indent?: number) => void,
		unlockAnimal: (animalName: string) => void,
	) => void;
	handleRampage: (
		source: Player,
		target: Player,
		logMessage: (message: string, indent?: number) => void,
		unlockAnimal: (animalName: string) => void,
	) => void;
	handleMischief: (source: Player, target: Player, logMessage: (message: string, indent?: number) => void) => void;
	handleSnapBack: (source: Player, logMessage: (message: string, indent?: number) => void) => void;
}

export function useGameActions(): UseGameActionsReturn {
	const applyDamage = useCallback(
		(
			target: Player,
			damage: number,
			source: Player,
			logMessage: (message: string, indent?: number) => void,
			unlockAnimal: (animalName: string) => void,
		): number => {
			// Crocodile Snap Back counter-attack
			if (target.status.snapBackActive && damage > 0) {
				target.status.snapBackActive = false;
				playSound('snapback');
				logMessage(`${target.name} the Crocodile snaps back at ${source.name}!`, 2);
				const counterDamage = damage * 2;
				logMessage(`${source.name} (${source.animal}) takes ${counterDamage} damage from the counter-attack!`, 3);
				// Apply counter-attack damage to the source
				const actualCounterDamage = Math.min(source.hp, counterDamage);
				source.hp -= actualCounterDamage;
				playSound('damage');
				logMessage(`${source.name} (${source.animal}) now has ${source.hp}/${source.maxHp} HP.`, 3);
				if (source.hp <= 0) {
					source.isAlive = false;
					playSound('defeat');
					logMessage(`${source.name}'s (${source.animal}) has been defeated!`, 4);
					unlockAnimal(source.animal);
				}
				return 0; // Target (Crocodile) takes no damage
			}

			if (target.status.isShielded) {
				playSound('shield');
				logMessage(`${target.name}'s (${target.animal}) shield blocked the attack from ${source.name}!`, 2);
				return 0;
			}

			// Bird evasion: 2/3 chance to evade incoming damage
			if (target.animal === 'Bird' && damage > 0) {
				const evasionRoll = Math.random();
				if (evasionRoll > 1 / 3) {
					playSound('nothing');
					logMessage(`${target.name} the Bird evaded the attack!`, 2);
					return 0;
				}
			}

			playSound('damage');
			const actualDamage = Math.min(target.hp, damage);
			target.hp -= actualDamage;
			logMessage(`${target.name} (${target.animal}) now has ${target.hp}/${target.maxHp} HP.`, 2);
			if (target.hp <= 0) {
				target.isAlive = false;
				playSound('defeat');
				logMessage(`${target.name}'s (${target.animal}) has been defeated!`, 3);
				unlockAnimal(target.animal);
			}
			return actualDamage;
		},
		[],
	);

	const handleAttack = useCallback(
		(
			source: Player,
			target: Player,
			logMessage: (message: string, indent?: number) => void,
			unlockAnimal: (animalName: string) => void,
		): void => {
			playSound('attack');
			logMessage(`${source.name} (${source.animal}) attacks ${target.name} (${target.animal}).`, 1);

			// Bird miss chance: 2/3 chance to miss when attacking
			if (source.animal === 'Bird') {
				const accuracyRoll = Math.random();
				if (accuracyRoll > 1 / 3) {
					playSound('nothing');
					logMessage(`${source.name} the Bird's attack missed!`, 2);
					return;
				}
			}

			applyDamage(target, 1, source, logMessage, unlockAnimal);
		},
		[applyDamage],
	);

	const handleHeal = useCallback((source: Player, logMessage: (message: string, indent?: number) => void): void => {
		playSound('heal');
		source.oneTimeActions.hasHealed = true;
		if (source.hp >= source.maxHp) {
			source.hp += 1;
			logMessage(`${source.name} (${source.animal}) is overhealed for 1 HP! (${source.hp}/${source.maxHp})`, 1);
		} else {
			const amountToHeal = Math.min(1, source.maxHp - source.hp);
			source.hp += amountToHeal;
			logMessage(`${source.name} (${source.animal}) healed for ${amountToHeal} HP.`, 1);
		}
	}, []);

	const handleShield = useCallback((source: Player, logMessage: (message: string, indent?: number) => void): void => {
		playSound('shield');
		source.oneTimeActions.hasShielded = true;
		source.status.isShielded = true;
		logMessage(`${source.name} (${source.animal}) raised a shield! It will block the next incoming damage.`, 1);
	}, []);

	const handleHowl = useCallback(
		(source: Player, state: GameState, logMessage: (message: string, indent?: number) => void): void => {
			playSound('howl');
			source.abilityCooldown = 2;
			logMessage(`${source.name} the Coyote lets out a piercing Howl!`, 1);
			state.players.forEach((p) => {
				if (p.isAlive && p.id !== source.id && p.animal !== 'Coyote') {
					p.status.isSleeping = true;
					p.status.sleepTurnsRemaining = 1; // Sleep for 1 turn
					playSound('sleep');
				}
			});
		},
		[],
	);

	const handleSpitball = useCallback(
		(
			source: Player,
			target: Player,
			logMessage: (message: string, indent?: number) => void,
			unlockAnimal: (animalName: string) => void,
		): void => {
			playSound('spitball');
			const rand = Math.random();
			let damage = 0;
			if (rand < 0.15) {
				damage = 2;
			} else if (rand < 0.55) {
				damage = 1;
			}

			logMessage(`${source.name} the Llama uses Spitball on ${target.name} (${target.animal})...`, 1);
			if (damage > 0) {
				logMessage(`It's a direct hit for ${damage} damage!`, 2);
				applyDamage(target, damage, source, logMessage, unlockAnimal);
			} else {
				logMessage(`It missed! 0 damage.`, 2);
			}
		},
		[applyDamage],
	);

	const handleStrike = useCallback(
		(
			source: Player,
			target1: Player,
			target2: Player,
			logMessage: (message: string, indent?: number) => void,
			unlockAnimal: (animalName: string) => void,
		): void => {
			playSound('strike');
			logMessage(`${source.name} the Tiger uses Strike on ${target1.name} and ${target2.name}!`, 1);
			applyDamage(target1, 1, source, logMessage, unlockAnimal);
			applyDamage(target2, 1, source, logMessage, unlockAnimal);
		},
		[applyDamage],
	);

	const handleRampage = useCallback(
		(
			source: Player,
			target: Player,
			logMessage: (message: string, indent?: number) => void,
			unlockAnimal: (animalName: string) => void,
		): void => {
			playSound('rampage');
			source.oneTimeActions.hasUsedAbility = true;
			logMessage(
				`${source.name} the Gorilla unleashes a devastating Rampage on ${target.name} (${target.animal})!`,
				1,
			);
			applyDamage(target, 4, source, logMessage, unlockAnimal);
		},
		[applyDamage],
	);

	const handleMischief = useCallback(
		(source: Player, target: Player, logMessage: (message: string, indent?: number) => void): void => {
			playSound('mischief');
			source.oneTimeActions.hasUsedAbility = true;
			target.abilityDisabled = true;
			logMessage(`${source.name} the Monkey uses Mischief on ${target.name} (${target.animal})!`, 1);
			logMessage(`${target.name}'s (${target.animal}) ability has been permanently disabled!`, 2);
		},
		[],
	);

	const handleSnapBack = useCallback(
		(source: Player, logMessage: (message: string, indent?: number) => void): void => {
			playSound('snapback');
			source.status.snapBackActive = true;
			logMessage(`${source.name} the Crocodile uses Snap Back...`, 1);
			logMessage('Nothing happens... or does it?', 2);
		},
		[],
	);

	return {
		applyDamage,
		handleAttack,
		handleHeal,
		handleShield,
		handleHowl,
		handleSpitball,
		handleStrike,
		handleRampage,
		handleMischief,
		handleSnapBack,
	};
}
