import type {Meta, StoryObj} from '@storybook/react-vite';
import {PlayerCard} from './PlayerCard';
import type {Player} from '../../lib/types';

const meta = {
	title: 'Components/PlayerCard',
	component: PlayerCard,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	decorators: [
		(Story) => (
			<div style={{width: '320px'}}>
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof PlayerCard>;

export default meta;
type Story = StoryObj<typeof meta>;

const basePlayer: Player = {
	id: 1,
	name: 'Alice',
	animal: 'Tiger',
	hp: 100,
	maxHp: 100,
	isAlive: true,
	isComputer: false,
	status: {
		isShielded: false,
		isSleeping: false,
		sleepTurnsRemaining: 0,
	},
	oneTimeActions: {
		hasHealed: false,
		hasShielded: false,
		hasUsedAbility: false,
	},
	abilityCooldown: 0,
	abilityDisabled: false,
};

export const Default: Story = {
	args: {
		player: basePlayer,
	},
};

export const Active: Story = {
	args: {
		player: basePlayer,
		isActive: true,
	},
};

export const Selectable: Story = {
	args: {
		player: basePlayer,
		isSelectable: true,
		onClick: (playerId) => console.log(`Player ${playerId} clicked`),
	},
};

export const Damaged: Story = {
	args: {
		player: {
			...basePlayer,
			hp: 40,
		},
	},
};

export const LowHealth: Story = {
	args: {
		player: {
			...basePlayer,
			hp: 20,
		},
	},
};

export const Dead: Story = {
	args: {
		player: {
			...basePlayer,
			hp: 0,
			isAlive: false,
		},
	},
};

export const Shielded: Story = {
	args: {
		player: {
			...basePlayer,
			status: {
				isShielded: true,
				isSleeping: false,
				sleepTurnsRemaining: 0,
			},
		},
	},
};

export const Sleeping: Story = {
	args: {
		player: {
			...basePlayer,
			status: {
				isShielded: false,
				isSleeping: true,
				sleepTurnsRemaining: 1,
			},
		},
	},
};

export const AbilityCooldown: Story = {
	args: {
		player: {
			...basePlayer,
			abilityCooldown: 2,
		},
	},
};

export const MultipleStatuses: Story = {
	args: {
		player: {
			...basePlayer,
			hp: 50,
			status: {
				isShielded: true,
				isSleeping: false,
				sleepTurnsRemaining: 0,
			},
			abilityCooldown: 3,
		},
		isActive: true,
	},
};

export const CriticalShieldedActive: Story = {
	args: {
		player: {
			...basePlayer,
			hp: 15,
			status: {
				isShielded: true,
				isSleeping: false,
				sleepTurnsRemaining: 0,
			},
		},
		isActive: true,
	},
};

export const ComputerPlayer: Story = {
	args: {
		player: {
			...basePlayer,
			name: 'Computer',
			animal: 'Gorilla',
			isComputer: true,
		},
	},
};

export const AllAnimals = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px', width: '320px'}}>
			<PlayerCard player={{...basePlayer, animal: 'Coyote', name: 'Coyote Player'}} />
			<PlayerCard player={{...basePlayer, animal: 'Llama', name: 'Llama Player'}} />
			<PlayerCard player={{...basePlayer, animal: 'Tiger', name: 'Tiger Player'}} />
			<PlayerCard player={{...basePlayer, animal: 'Gorilla', name: 'Gorilla Player'}} />
			<PlayerCard player={{...basePlayer, animal: 'Monkey', name: 'Monkey Player'}} />
		</div>
	),
};
