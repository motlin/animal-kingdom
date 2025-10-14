import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import type {AnimalType} from '../../lib/types';
import {ABILITY_NAMES} from '../../lib/constants';
import './GameControls.css';

export interface GameControlsProperties {
	turnIndicator: string;
	currentAnimal: AnimalType;
	canAttack?: boolean;
	canUseAbility?: boolean;
	canHeal?: boolean;
	canShield?: boolean;
	canDoNothing?: boolean;
	canUndo?: boolean;
	healsRemaining?: number;
	shieldsRemaining?: number;
	onAttack?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onUseAbility?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onHeal?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onShield?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onDoNothing?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onUndo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GameControls({
	turnIndicator,
	currentAnimal,
	canAttack = true,
	canUseAbility = true,
	canHeal = true,
	canShield = true,
	canDoNothing = true,
	canUndo = true,
	healsRemaining = 1,
	shieldsRemaining = 1,
	onAttack,
	onUseAbility,
	onHeal,
	onShield,
	onDoNothing,
	onUndo,
}: GameControlsProperties) {
	const abilityName = ABILITY_NAMES[currentAnimal];

	const healText = healsRemaining > 0 ? `<u>H</u>eal (${healsRemaining})` : '<u>H</u>eal (0)';
	const shieldText = shieldsRemaining > 0 ? `<u>S</u>hield (${shieldsRemaining})` : '<u>S</u>hield (0)';

	return (
		<div className="game-controls">
			<div className="turn-indicator">{turnIndicator}</div>
			<div className="action-buttons">
				<Button
					variant="primary"
					disabled={!canAttack}
					{...(onAttack && {onClick: onAttack})}
				>
					<Icon name="crosshair" />
					<span dangerouslySetInnerHTML={{__html: '<u>A</u>ttack'}} />
				</Button>
				<Button
					variant="primary"
					disabled={!canUseAbility}
					{...(onUseAbility && {onClick: onUseAbility})}
				>
					<Icon name="sparkles" />
					<span dangerouslySetInnerHTML={{__html: `Use A<u>b</u>ility: ${abilityName}`}} />
				</Button>
				<Button
					variant="primary"
					disabled={!canHeal}
					{...(onHeal && {onClick: onHeal})}
				>
					<Icon name="heart" />
					<span dangerouslySetInnerHTML={{__html: healText}} />
				</Button>
				<Button
					variant="primary"
					disabled={!canShield}
					{...(onShield && {onClick: onShield})}
				>
					<Icon name="shield-check" />
					<span dangerouslySetInnerHTML={{__html: shieldText}} />
				</Button>
				<Button
					variant="primary"
					disabled={!canDoNothing}
					{...(onDoNothing && {onClick: onDoNothing})}
				>
					<Icon name="pause" />
					<span dangerouslySetInnerHTML={{__html: 'Do <u>N</u>othing'}} />
				</Button>
			</div>
			<Button
				variant="undo"
				disabled={!canUndo}
				{...(onUndo && {onClick: onUndo})}
			>
				<Icon name="undo" />
				<u>U</u>ndo Last Action
			</Button>
		</div>
	);
}
