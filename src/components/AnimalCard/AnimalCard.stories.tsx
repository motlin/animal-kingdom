import type {Meta, StoryObj} from '@storybook/react';
import {AnimalCard} from './AnimalCard';
import {ANIMAL_ROSTER} from '../../constants';

const meta = {
	title: 'Components/AnimalCard',
	component: AnimalCard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		animal: {
			control: 'select',
			options: ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'],
		},
		selected: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof AnimalCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coyote: Story = {
	args: {
		animal: 'Coyote',
		abilityDescription: ANIMAL_ROSTER.Coyote.abilityDesc,
		selected: false,
	},
};

export const CoyoteSelected: Story = {
	args: {
		animal: 'Coyote',
		abilityDescription: ANIMAL_ROSTER.Coyote.abilityDesc,
		selected: true,
	},
};

export const Llama: Story = {
	args: {
		animal: 'Llama',
		abilityDescription: ANIMAL_ROSTER.Llama.abilityDesc,
		selected: false,
	},
};

export const LlamaSelected: Story = {
	args: {
		animal: 'Llama',
		abilityDescription: ANIMAL_ROSTER.Llama.abilityDesc,
		selected: true,
	},
};

export const Tiger: Story = {
	args: {
		animal: 'Tiger',
		abilityDescription: ANIMAL_ROSTER.Tiger.abilityDesc,
		selected: false,
	},
};

export const TigerSelected: Story = {
	args: {
		animal: 'Tiger',
		abilityDescription: ANIMAL_ROSTER.Tiger.abilityDesc,
		selected: true,
	},
};

export const Gorilla: Story = {
	args: {
		animal: 'Gorilla',
		abilityDescription: ANIMAL_ROSTER.Gorilla.abilityDesc,
		selected: false,
	},
};

export const GorillaSelected: Story = {
	args: {
		animal: 'Gorilla',
		abilityDescription: ANIMAL_ROSTER.Gorilla.abilityDesc,
		selected: true,
	},
};

export const Monkey: Story = {
	args: {
		animal: 'Monkey',
		abilityDescription: ANIMAL_ROSTER.Monkey.abilityDesc,
		selected: false,
	},
};

export const MonkeySelected: Story = {
	args: {
		animal: 'Monkey',
		abilityDescription: ANIMAL_ROSTER.Monkey.abilityDesc,
		selected: true,
	},
};

export const AllAnimals = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '15px',
				maxWidth: '400px',
				padding: '20px',
			}}
		>
			<h3>All Animals (Unselected)</h3>
			<AnimalCard
				animal="Coyote"
				abilityDescription={ANIMAL_ROSTER.Coyote.abilityDesc}
			/>
			<AnimalCard
				animal="Llama"
				abilityDescription={ANIMAL_ROSTER.Llama.abilityDesc}
			/>
			<AnimalCard
				animal="Tiger"
				abilityDescription={ANIMAL_ROSTER.Tiger.abilityDesc}
			/>
			<AnimalCard
				animal="Gorilla"
				abilityDescription={ANIMAL_ROSTER.Gorilla.abilityDesc}
			/>
			<AnimalCard
				animal="Monkey"
				abilityDescription={ANIMAL_ROSTER.Monkey.abilityDesc}
			/>
		</div>
	),
};

export const AllAnimalsSelected = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '15px',
				maxWidth: '400px',
				padding: '20px',
			}}
		>
			<h3>All Animals (Selected)</h3>
			<AnimalCard
				animal="Coyote"
				abilityDescription={ANIMAL_ROSTER.Coyote.abilityDesc}
				selected
			/>
			<AnimalCard
				animal="Llama"
				abilityDescription={ANIMAL_ROSTER.Llama.abilityDesc}
				selected
			/>
			<AnimalCard
				animal="Tiger"
				abilityDescription={ANIMAL_ROSTER.Tiger.abilityDesc}
				selected
			/>
			<AnimalCard
				animal="Gorilla"
				abilityDescription={ANIMAL_ROSTER.Gorilla.abilityDesc}
				selected
			/>
			<AnimalCard
				animal="Monkey"
				abilityDescription={ANIMAL_ROSTER.Monkey.abilityDesc}
				selected
			/>
		</div>
	),
};

export const MixedStates = {
	render: () => (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				gap: '15px',
				maxWidth: '400px',
				padding: '20px',
			}}
		>
			<h3>Mixed States</h3>
			<AnimalCard
				animal="Coyote"
				abilityDescription={ANIMAL_ROSTER.Coyote.abilityDesc}
			/>
			<AnimalCard
				animal="Llama"
				abilityDescription={ANIMAL_ROSTER.Llama.abilityDesc}
				selected
			/>
			<AnimalCard
				animal="Tiger"
				abilityDescription={ANIMAL_ROSTER.Tiger.abilityDesc}
			/>
			<AnimalCard
				animal="Gorilla"
				abilityDescription={ANIMAL_ROSTER.Gorilla.abilityDesc}
			/>
			<AnimalCard
				animal="Monkey"
				abilityDescription={ANIMAL_ROSTER.Monkey.abilityDesc}
			/>
		</div>
	),
};
