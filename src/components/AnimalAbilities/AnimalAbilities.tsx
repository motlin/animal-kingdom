import {useState} from 'react';
import type {AnimalType} from '../../lib/types';
import {ANIMAL_ROSTER, ANIMAL_UNLOCK_ORDER} from '../../lib/constants';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import {AbilityCard} from '../AbilityCard/AbilityCard';
import './AnimalAbilities.css';

export interface AnimalAbilitiesProperties {
	unlockedCount: number;
	className?: string;
	defaultExpanded?: boolean;
}

export function AnimalAbilities({unlockedCount, className = '', defaultExpanded = false}: AnimalAbilitiesProperties) {
	const [isExpanded, setIsExpanded] = useState(defaultExpanded);

	const unlockedAnimals = ANIMAL_UNLOCK_ORDER.slice(0, unlockedCount);

	const toggleExpanded = () => {
		setIsExpanded(!isExpanded);
	};

	const sectionClasses = ['animal-abilities-section', isExpanded ? '' : 'collapsed', className]
		.filter(Boolean)
		.join(' ');

	return (
		<div className={sectionClasses}>
			<div className="abilities-header">
				<h3>Animal Abilities</h3>
				<Button onClick={toggleExpanded}>
					<Icon name={isExpanded ? 'chevron-up' : 'chevron-down'} />
					<span>{isExpanded ? 'Hide' : 'Show'} Abilities</span>
				</Button>
			</div>
			{isExpanded && (
				<div className="abilities-list">
					{unlockedAnimals.map((animal: AnimalType) => (
						<AbilityCard
							key={animal}
							animal={animal}
							abilityDescription={ANIMAL_ROSTER[animal].abilityDesc}
						/>
					))}
				</div>
			)}
		</div>
	);
}
