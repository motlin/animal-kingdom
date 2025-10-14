import type {AnimalType} from '../../types';
import {ANIMAL_EMOJIS, ABILITY_NAMES} from '../../constants';
import './AbilityCard.css';

export interface AbilityCardProperties {
	animal: AnimalType;
	abilityDescription: string;
	className?: string;
}

export function AbilityCard({animal, abilityDescription, className = ''}: AbilityCardProperties) {
	const emoji = ANIMAL_EMOJIS[animal];
	const abilityName = ABILITY_NAMES[animal];
	const classes = ['ability-card', className].filter(Boolean).join(' ');

	return (
		<div className={classes}>
			<strong>
				{emoji} {animal} - {abilityName}
			</strong>
			<p>{abilityDescription}</p>
		</div>
	);
}
