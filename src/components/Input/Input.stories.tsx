import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Input} from './Input';

const meta = {
	title: 'Components/Input',
	component: Input,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
		type: {
			control: 'select',
			options: ['text', 'number', 'email', 'password'],
		},
		required: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PlayerName: Story = {
	args: {
		value: '',
		onChange: () => {},
		placeholder: 'Enter player name',
		label: 'Player Name:',
	},
};

export const PlayerNameFilled: Story = {
	args: {
		value: 'Alice',
		onChange: () => {},
		placeholder: 'Enter player name',
		label: 'Player Name:',
	},
};

export const WithPlaceholder: Story = {
	args: {
		value: '',
		onChange: () => {},
		placeholder: 'Type something...',
	},
};

export const WithoutLabel: Story = {
	args: {
		value: '',
		onChange: () => {},
		placeholder: 'Enter text',
	},
};

export const Disabled: Story = {
	args: {
		value: 'Cannot edit',
		onChange: () => {},
		label: 'Disabled Input:',
		disabled: true,
	},
};

export const NumberType: Story = {
	args: {
		value: '',
		onChange: () => {},
		type: 'number',
		placeholder: 'Enter a number',
		label: 'Number Input:',
	},
};

export const EmailType: Story = {
	args: {
		value: '',
		onChange: () => {},
		type: 'email',
		placeholder: 'Enter email',
		label: 'Email:',
	},
};

export const PasswordType: Story = {
	args: {
		value: '',
		onChange: () => {},
		type: 'password',
		placeholder: 'Enter password',
		label: 'Password:',
	},
};

export const WithMaxLength: Story = {
	args: {
		value: '',
		onChange: () => {},
		placeholder: 'Max 10 characters',
		label: 'Limited Input:',
		maxLength: 10,
	},
};

export const Required: Story = {
	args: {
		value: '',
		onChange: () => {},
		placeholder: 'Required field',
		label: 'Required Input:',
		required: true,
	},
};

export const Interactive = {
	render: () => {
		const InteractiveInput = () => {
			const [playerName, setPlayerName] = useState('');
			const [email, setEmail] = useState('');
			const [number, setNumber] = useState('');

			return (
				<div
					style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', minWidth: '300px'}}
				>
					<Input
						value={playerName}
						onChange={setPlayerName}
						placeholder="Enter player name"
						label="Player Name:"
					/>
					<p>Player name: {playerName || '(empty)'}</p>

					<Input
						value={email}
						onChange={setEmail}
						type="email"
						placeholder="Enter email"
						label="Email:"
					/>
					<p>Email: {email || '(empty)'}</p>

					<Input
						value={number}
						onChange={setNumber}
						type="number"
						placeholder="Enter number"
						label="Number:"
					/>
					<p>Number: {number || '(empty)'}</p>
				</div>
			);
		};

		return <InteractiveInput />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			const [values, setValues] = useState({
				playerName: '',
				email: '',
				password: '',
				number: '',
				limited: '',
			});

			return (
				<div
					style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px', minWidth: '300px'}}
				>
					<div>
						<h3>Player Name Input</h3>
						<Input
							value={values.playerName}
							onChange={(value) => setValues({...values, playerName: value})}
							placeholder="Enter player name"
							label="Player Name:"
						/>
					</div>

					<div>
						<h3>Email Input</h3>
						<Input
							value={values.email}
							onChange={(value) => setValues({...values, email: value})}
							type="email"
							placeholder="player@example.com"
							label="Email:"
						/>
					</div>

					<div>
						<h3>Password Input</h3>
						<Input
							value={values.password}
							onChange={(value) => setValues({...values, password: value})}
							type="password"
							placeholder="Enter password"
							label="Password:"
						/>
					</div>

					<div>
						<h3>Number Input</h3>
						<Input
							value={values.number}
							onChange={(value) => setValues({...values, number: value})}
							type="number"
							placeholder="0"
							label="Number:"
						/>
					</div>

					<div>
						<h3>Limited Length Input (max 10)</h3>
						<Input
							value={values.limited}
							onChange={(value) => setValues({...values, limited: value})}
							placeholder="Max 10 characters"
							label="Limited:"
							maxLength={10}
						/>
						<small>{values.limited.length}/10 characters</small>
					</div>

					<div>
						<h3>Without Label</h3>
						<Input
							value={values.playerName}
							onChange={(value) => setValues({...values, playerName: value})}
							placeholder="No label"
						/>
					</div>

					<div>
						<h3>Disabled</h3>
						<Input
							value="Cannot edit this"
							onChange={() => {}}
							label="Disabled:"
							disabled
						/>
					</div>

					<div>
						<h3>Required Field</h3>
						<Input
							value={values.playerName}
							onChange={(value) => setValues({...values, playerName: value})}
							placeholder="Required field"
							label="Required:"
							required
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
