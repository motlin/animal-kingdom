import type {Player} from '../../types';
import {HPBar} from '../HPBar/HPBar';
import {Icon} from '../Icon/Icon';
import './PlayerCard.css';

export interface PlayerCardProperties {
	player: Player;
	isActive?: boolean;
	isSelectable?: boolean;
	onClick?: (playerId: number) => void;
	className?: string;
}

export function PlayerCard({
	player,
	isActive = false,
	isSelectable = false,
	onClick,
	className = '',
}: PlayerCardProperties) {
	const handleClick = () => {
		if (isSelectable && onClick) {
			onClick(player.id);
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (isSelectable && (event.key === 'Enter' || event.key === ' ')) {
			event.preventDefault();
			handleClick();
		}
	};

	const activeClass = isActive ? 'active' : '';
	const selectableClass = isSelectable ? 'selectable' : '';
	const deadClass = !player.isAlive ? 'dead' : '';
	const classes = ['player-card', activeClass, selectableClass, deadClass, className].filter(Boolean).join(' ');

	return (
		<div
			className={classes}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			role={isSelectable ? 'button' : undefined}
			tabIndex={isSelectable ? 0 : undefined}
		>
			<div className="player-info">
				<div>
					<div className="player-name">{player.name}</div>
					<div className="animal-name">{player.animal}</div>
				</div>
				<div className="status-icons">
					{player.status.isShielded && (
						<span
							className="status-icon"
							title="Shielded"
						>
							<Icon
								name="shield-check"
								size={24}
							/>
						</span>
					)}
					{player.status.isSleeping && (
						<span
							className="status-icon"
							title="Sleeping"
						>
							<Icon
								name="pause"
								size={24}
							/>
						</span>
					)}
					{player.abilityCooldown > 0 && (
						<span
							className="status-icon"
							title={`Ability on cooldown: ${player.abilityCooldown} turns`}
						>
							<Icon
								name="refresh-cw"
								size={24}
							/>
						</span>
					)}
				</div>
			</div>
			<HPBar
				currentHp={player.hp}
				maxHp={player.maxHp}
			/>
		</div>
	);
}
