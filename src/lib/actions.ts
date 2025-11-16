import type {Player} from './types.ts';
import {state, logMessage, unlockAnimal} from './game-state.ts';
import {playSound} from '../sound.ts';

export function applyDamage(target: Player, damage: number, source: Player): number {
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
}

export function handleAttack(source: Player, target: Player): void {
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

	applyDamage(target, 1, source);
}

export function handleHeal(source: Player): void {
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
}

export function handleShield(source: Player): void {
	playSound('shield');
	source.oneTimeActions.hasShielded = true;
	source.status.isShielded = true;
	logMessage(`${source.name} (${source.animal}) raised a shield! It will block the next incoming damage.`, 1);
}

export function handleHowl(source: Player): void {
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
}

export function handleSpitball(source: Player, target: Player): void {
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
		applyDamage(target, damage, source);
	} else {
		logMessage(`It missed! 0 damage.`, 2);
	}
}

export function handleStrike(source: Player, target1: Player, target2: Player): void {
	playSound('strike');
	logMessage(`${source.name} the Tiger uses Strike on ${target1.name} and ${target2.name}!`, 1);
	applyDamage(target1, 1, source);
	applyDamage(target2, 1, source);
}

export function handleRampage(source: Player, target: Player): void {
	playSound('rampage');
	source.oneTimeActions.hasUsedAbility = true;
	logMessage(`${source.name} the Gorilla unleashes a devastating Rampage on ${target.name} (${target.animal})!`, 1);
	applyDamage(target, 4, source);
}

export function handleMischief(source: Player, target: Player): void {
	playSound('mischief');
	source.oneTimeActions.hasUsedAbility = true;
	target.abilityDisabled = true;
	logMessage(`${source.name} the Monkey uses Mischief on ${target.name} (${target.animal})!`, 1);
	logMessage(`${target.name}'s (${target.animal}) ability has been permanently disabled!`, 2);
}
