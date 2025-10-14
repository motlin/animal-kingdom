import React from 'react';
import './Select.css';

export interface SelectOption {
	value: string;
	label: string;
}

export interface SelectProperties {
	value: string;
	options: SelectOption[];
	onChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
	id?: string;
	label?: string;
}

export function Select({value, options, onChange, disabled = false, className = '', id, label}: SelectProperties) {
	const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		onChange(event.target.value);
	};

	return (
		<div className={`select-container ${className}`}>
			{label && <label htmlFor={id}>{label}</label>}
			<select
				id={id}
				value={value}
				onChange={handleChange}
				disabled={disabled}
				className="select"
			>
				{options.map((option) => (
					<option
						key={option.value}
						value={option.value}
					>
						{option.label}
					</option>
				))}
			</select>
		</div>
	);
}
