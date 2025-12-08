import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import type {GameMode} from '../../lib/types';
import './ModeSelector.css';

export type {GameMode};

export interface ModeSelectorProperties {
	selectedMode: GameMode;
	onModeChange: (mode: GameMode) => void;
	disabled?: boolean;
}

export function ModeSelector({selectedMode, onModeChange, disabled = false}: ModeSelectorProperties) {
	return (
		<div className="mode-selection">
			<Button
				variant="mode"
				active={selectedMode === 'standard'}
				disabled={disabled}
				onClick={() => onModeChange('standard')}
			>
				<Icon name="users" />
				<span>Standard Battle</span>
			</Button>
			<Button
				variant="mode"
				active={selectedMode === 'team'}
				disabled={disabled}
				onClick={() => onModeChange('team')}
			>
				<Icon name="users" />
				<span>Team Battle</span>
			</Button>
			<Button
				variant="mode"
				active={selectedMode === 'challenger'}
				disabled={disabled}
				onClick={() => onModeChange('challenger')}
			>
				<Icon name="trophy" />
				<span>New Challenger</span>
			</Button>
		</div>
	);
}
