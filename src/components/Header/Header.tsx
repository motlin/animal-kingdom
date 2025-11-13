import './Header.css';

export interface HeaderProperties {
	isGameActive?: boolean;
	className?: string;
}

export function Header({isGameActive = false, className = ''}: HeaderProperties) {
	const activeClass = isGameActive ? 'game-active' : '';
	const classes = ['header', activeClass, className].filter(Boolean).join(' ');
	const baseUrl = import.meta.env.BASE_URL || '/';

	return (
		<header className={classes}>
			<img
				src={`${baseUrl}logo.png`}
				alt="Animal Kingdom Logo"
				className="logo"
			/>
		</header>
	);
}
