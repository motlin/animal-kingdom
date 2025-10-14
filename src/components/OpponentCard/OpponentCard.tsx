import type {AnimalType} from '../../lib/types';
import './OpponentCard.css';

export interface OpponentCardProperties {
	opponentName: AnimalType;
	className?: string;
}

export function OpponentCard({opponentName, className = ''}: OpponentCardProperties) {
	const classes = ['opponent-card', className].filter(Boolean).join(' ');

	return (
		<div className={classes}>
			<div className="opponent-name">{opponentName}</div>
			<div className="opponent-label">Computer Opponent</div>
		</div>
	);
}
