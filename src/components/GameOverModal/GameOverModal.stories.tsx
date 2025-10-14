import type {Meta, StoryObj} from '@storybook/react';
import {GameOverModal} from './GameOverModal';

const meta = {
	title: 'Components/GameOverModal',
	component: GameOverModal,
	parameters: {
		layout: 'fullscreen',
	},
	tags: ['autodocs'],
	argTypes: {
		isOpen: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof GameOverModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleWinner: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice wins! 🎉',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const MultipleWinners: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice, Bob, and Charlie win! 🎉',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerVictory: Story = {
	args: {
		winnerAnnouncement: '🏆 You defeated the Tiger! 🏆',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerDefeat: Story = {
	args: {
		winnerAnnouncement: '💀 The Tiger defeated you! 💀',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const LastSurvivors: Story = {
	args: {
		winnerAnnouncement: '🎊 Dave survives! 🎊',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const Closed: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice wins! 🎉',
		isOpen: false,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const WithoutCallbacks: Story = {
	args: {
		winnerAnnouncement: '🎉 Bob wins! 🎉',
		isOpen: true,
	},
};

export const LongWinnerMessage: Story = {
	args: {
		winnerAnnouncement:
			'🎉 Alice, Bob, Charlie, Dave, Eve, Frank, Grace, and Helen all win together in an epic battle royale! 🎉',
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onViewLog: () => console.log('View Log clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const AllScenarios = {
	render: () => (
		<div style={{position: 'relative', height: '100vh'}}>
			<div style={{padding: '20px', textAlign: 'center'}}>
				<h3>Example Winner Announcements</h3>
				<p>(Each modal would appear one at a time)</p>
			</div>
			<GameOverModal
				winnerAnnouncement="🎉 Alice wins! 🎉"
				isOpen={true}
			/>
		</div>
	),
};
