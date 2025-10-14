import type {Meta, StoryObj} from '@storybook/react';
import {AbilityCard} from './AbilityCard';
import {ANIMAL_ROSTER} from '../../constants';

const meta = {
	title: 'Components/AbilityCard',
	component: AbilityCard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		animal: {
			control: 'select',
			options: ['Coyote', 'Llama', 'Tiger', 'Gorilla', 'Monkey'],
		},
	},
} satisfies Meta<typeof AbilityCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Coyote: Story = {
	args: {
		animal: 'Coyote',
		abilityDescription: ANIMAL_ROSTER.Coyote.abilityDesc,
	},
};

export const Llama: Story = {
	args: {
		animal: 'Llama',
		abilityDescription: ANIMAL_ROSTER.Llama.abilityDesc,
	},
};

export const Tiger: Story = {
	args: {
		animal: 'Tiger',
		abilityDescription: ANIMAL_ROSTER.Tiger.abilityDesc,
	},
};

export const Gorilla: Story = {
	args: {
		animal: 'Gorilla',
		abilityDescription: ANIMAL_ROSTER.Gorilla.abilityDesc,
	},
};

export const Monkey: Story = {
	args: {
		animal: 'Monkey',
		abilityDescription: ANIMAL_ROSTER.Monkey.abilityDesc,
	},
};

export const AllAbilities = {
	render: () => (
		<div
			style={{
				display: 'grid',
				gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
				gap: '15px',
				maxWidth: '800px',
				padding: '20px',
			}}
		>
			<AbilityCard
				animal="Coyote"
				abilityDescription={ANIMAL_ROSTER.Coyote.abilityDesc}
			/>
			<AbilityCard
				animal="Llama"
				abilityDescription={ANIMAL_ROSTER.Llama.abilityDesc}
			/>
			<AbilityCard
				animal="Tiger"
				abilityDescription={ANIMAL_ROSTER.Tiger.abilityDesc}
			/>
			<AbilityCard
				animal="Gorilla"
				abilityDescription={ANIMAL_ROSTER.Gorilla.abilityDesc}
			/>
			<AbilityCard
				animal="Monkey"
				abilityDescription={ANIMAL_ROSTER.Monkey.abilityDesc}
			/>
		</div>
	),
};
