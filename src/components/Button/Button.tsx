import React from 'react';
import './Button.css';

export type ButtonVariant = 'primary' | 'mode' | 'undo' | 'toggle' | 'log';

export interface ButtonProperties {
	variant?: ButtonVariant;
	disabled?: boolean;
	active?: boolean;
	children: React.ReactNode;
	onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	type?: 'button' | 'submit' | 'reset';
	className?: string;
}

export function Button({
	variant = 'primary',
	disabled = false,
	active = false,
	children,
	onClick,
	type = 'button',
	className = '',
}: ButtonProperties) {
	const variantClass = `button-${variant}`;
	const activeClass = active ? 'active' : '';
	const classes = [variantClass, activeClass, className].filter(Boolean).join(' ');

	return (
		<button
			type={type}
			className={classes}
			disabled={disabled}
			onClick={onClick}
		>
			{children}
		</button>
	);
}
