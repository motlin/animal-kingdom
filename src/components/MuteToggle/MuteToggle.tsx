import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import './MuteToggle.css';

export interface MuteToggleProperties {
	isMuted: boolean;
	onToggle: () => void;
}

export function MuteToggle({isMuted, onToggle}: MuteToggleProperties) {
	return (
		<Button
			variant="toggle"
			onClick={onToggle}
			className="mute-toggle"
			aria-label={isMuted ? 'Unmute' : 'Mute'}
		>
			<Icon
				name={isMuted ? 'volume-x' : 'volume-2'}
				size={24}
			/>
		</Button>
	);
}
