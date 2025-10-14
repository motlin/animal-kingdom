import './Header.css';

export interface HeaderProperties {
	isGameActive?: boolean;
	className?: string;
}

export function Header({isGameActive = false, className = ''}: HeaderProperties) {
	const activeClass = isGameActive ? 'game-active' : '';
	const classes = ['header', activeClass, className].filter(Boolean).join(' ');

	return (
		<header className={classes}>
			<img
				src="/logo.png"
				alt="Animal Kingdom Logo"
				className="logo"
			/>
		</header>
	);
}
