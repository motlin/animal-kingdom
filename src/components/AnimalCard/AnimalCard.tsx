import type {AnimalType} from '../../lib/types';
import './AnimalCard.css';

export interface AnimalCardProperties {
	animal: AnimalType;
	abilityDescription: string;
	selected?: boolean;
	onClick?: (animal: AnimalType) => void;
	className?: string;
}

export function AnimalCard({
	animal,
	abilityDescription,
	selected = false,
	onClick,
	className = '',
}: AnimalCardProperties) {
	const handleClick = () => {
		if (onClick) {
			onClick(animal);
		}
	};

	const selectedClass = selected ? 'selected' : '';
	const classes = ['animal-card', selectedClass, className].filter(Boolean).join(' ');

	return (
		<div
			className={classes}
			onClick={handleClick}
			role="button"
			tabIndex={0}
			onKeyDown={(event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					handleClick();
				}
			}}
		>
			<div className="animal-card-name">{animal}</div>
			<div className="animal-card-description">{abilityDescription}</div>
		</div>
	);
}
