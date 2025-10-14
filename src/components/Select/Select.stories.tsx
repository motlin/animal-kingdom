import type {Meta, StoryObj} from '@storybook/react';
import {useState} from 'react';
import {Select, type SelectOption} from './Select';

const meta = {
	title: 'Components/Select',
	component: Select,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		disabled: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const playerCountOptions: SelectOption[] = [
	{value: '2', label: '2'},
	{value: '3', label: '3'},
	{value: '4', label: '4'},
	{value: '5', label: '5'},
	{value: '6', label: '6'},
	{value: '7', label: '7'},
	{value: '8', label: '8'},
	{value: '9', label: '9'},
	{value: '10', label: '10'},
];

const animalOptions: SelectOption[] = [
	{value: 'coyote', label: 'Coyote'},
	{value: 'llama', label: 'Llama'},
	{value: 'tiger', label: 'Tiger'},
	{value: 'gorilla', label: 'Gorilla'},
	{value: 'monkey', label: 'Monkey'},
];

const playerTypeOptions: SelectOption[] = [
	{value: 'human', label: 'Human'},
	{value: 'computer', label: 'Computer'},
];

export const PlayerCount: Story = {
	args: {
		value: '2',
		options: playerCountOptions,
		onChange: () => {},
		label: 'Number of Players:',
	},
};

export const AnimalSelection: Story = {
	args: {
		value: 'coyote',
		options: animalOptions,
		onChange: () => {},
		label: 'Choose Animal:',
	},
};

export const PlayerType: Story = {
	args: {
		value: 'human',
		options: playerTypeOptions,
		onChange: () => {},
		label: 'Player Type:',
	},
};

export const Disabled: Story = {
	args: {
		value: 'coyote',
		options: animalOptions,
		onChange: () => {},
		label: 'Choose Animal:',
		disabled: true,
	},
};

export const WithoutLabel: Story = {
	args: {
		value: '2',
		options: playerCountOptions,
		onChange: () => {},
	},
};

export const Interactive = {
	render: () => {
		const InteractiveSelect = () => {
			const [playerCount, setPlayerCount] = useState('2');
			const [animal, setAnimal] = useState('coyote');
			const [playerType, setPlayerType] = useState('human');

			return (
				<div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px'}}>
					<Select
						value={playerCount}
						options={playerCountOptions}
						onChange={setPlayerCount}
						label="Number of Players:"
					/>
					<p>Selected player count: {playerCount}</p>

					<Select
						value={animal}
						options={animalOptions}
						onChange={setAnimal}
						label="Choose Animal:"
					/>
					<p>Selected animal: {animal}</p>

					<Select
						value={playerType}
						options={playerTypeOptions}
						onChange={setPlayerType}
						label="Player Type:"
					/>
					<p>Selected player type: {playerType}</p>
				</div>
			);
		};

		return <InteractiveSelect />;
	},
};

export const AllVariants = {
	render: () => {
		const AllVariantsDemo = () => {
			const [values, setValues] = useState({
				playerCount: '2',
				animal: 'coyote',
				playerType: 'human',
			});

			return (
				<div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px'}}>
					<div>
						<h3>Player Count Selection</h3>
						<Select
							value={values.playerCount}
							options={playerCountOptions}
							onChange={(value) => setValues({...values, playerCount: value})}
							label="Number of Players:"
						/>
					</div>

					<div>
						<h3>Animal Selection</h3>
						<Select
							value={values.animal}
							options={animalOptions}
							onChange={(value) => setValues({...values, animal: value})}
							label="Choose Animal:"
						/>
					</div>

					<div>
						<h3>Player Type Selection</h3>
						<Select
							value={values.playerType}
							options={playerTypeOptions}
							onChange={(value) => setValues({...values, playerType: value})}
							label="Player Type:"
						/>
					</div>

					<div>
						<h3>Without Label</h3>
						<Select
							value={values.animal}
							options={animalOptions}
							onChange={(value) => setValues({...values, animal: value})}
						/>
					</div>

					<div>
						<h3>Disabled</h3>
						<Select
							value={values.animal}
							options={animalOptions}
							onChange={(value) => setValues({...values, animal: value})}
							label="Choose Animal:"
							disabled
						/>
					</div>
				</div>
			);
		};

		return <AllVariantsDemo />;
	},
};
