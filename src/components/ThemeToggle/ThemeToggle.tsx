import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import './ThemeToggle.css';

export interface ThemeToggleProperties {
	theme: 'light' | 'dark';
	onToggle: () => void;
}

export function ThemeToggle({theme, onToggle}: ThemeToggleProperties) {
	return (
		<Button
			variant="toggle"
			onClick={onToggle}
			className="theme-toggle"
			aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
		>
			<Icon
				name={theme === 'light' ? 'moon' : 'sun'}
				size={24}
			/>
		</Button>
	);
}
