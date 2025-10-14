import './HPBar.css';

export interface HPBarProperties {
	currentHp: number;
	maxHp: number;
	className?: string;
}

export function HPBar({currentHp, maxHp, className = ''}: HPBarProperties) {
	const percentage = Math.max(0, Math.min(100, (currentHp / maxHp) * 100));

	let colorClass = 'hp-full';
	if (percentage <= 33) {
		colorClass = 'hp-low';
	} else if (percentage <= 66) {
		colorClass = 'hp-medium';
	}

	return (
		<div className={`hp-bar-container ${className}`}>
			<div
				className={`hp-bar ${colorClass}`}
				style={{width: `${percentage}%`}}
			/>
		</div>
	);
}
