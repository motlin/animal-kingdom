import React from 'react';
import './Input.css';

export interface InputProperties {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
	id?: string;
	label?: string;
	type?: 'text' | 'number' | 'email' | 'password';
	maxLength?: number;
	minLength?: number;
	required?: boolean;
}

export function Input({
	value,
	onChange,
	placeholder,
	disabled = false,
	className = '',
	id,
	label,
	type = 'text',
	maxLength,
	minLength,
	required = false,
}: InputProperties) {
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value);
	};

	return (
		<div className={`input-container ${className}`}>
			{label && <label htmlFor={id}>{label}</label>}
			<input
				id={id}
				type={type}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				disabled={disabled}
				className="input"
				maxLength={maxLength}
				minLength={minLength}
				required={required}
			/>
		</div>
	);
}
