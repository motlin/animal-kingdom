import type {Meta, StoryObj} from '@storybook/react-vite';
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

const sampleLogEntries = [
	{message: 'Game Start', indent: 0},
	{message: 'Players:', indent: 0},
	{message: 'Alice (Coyote)', indent: 1},
	{message: 'Bob (Tiger)', indent: 1},
	{message: "It's Alice's (Coyote) turn!", indent: 0},
	{message: 'Alice (Coyote) attacks Bob (Tiger).', indent: 1},
	{message: 'Bob (Tiger) takes 1 damage.', indent: 2},
	{message: 'Bob (Tiger) now has 2/3 HP.', indent: 2},
	{message: "It's Bob's (Tiger) turn!", indent: 0},
	{message: 'Bob (Tiger) attacks Alice (Coyote).', indent: 1},
	{message: 'Alice (Coyote) takes 1 damage.', indent: 2},
	{message: 'Alice (Coyote) now has 2/3 HP.', indent: 2},
];

export const SingleWinner: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice wins! 🎉',
		logEntries: sampleLogEntries,
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const MultipleWinners: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice, Bob, and Charlie win! 🎉',
		logEntries: [],
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerVictory: Story = {
	args: {
		winnerAnnouncement: '🏆 You defeated the Tiger! 🏆',
		logEntries: [],
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const ChallengerDefeat: Story = {
	args: {
		winnerAnnouncement: '💀 The Tiger defeated you! 💀',
		logEntries: [],
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const LastSurvivors: Story = {
	args: {
		winnerAnnouncement: '🎊 Dave survives! 🎊',
		logEntries: [],
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const Closed: Story = {
	args: {
		winnerAnnouncement: '🎉 Alice wins! 🎉',
		logEntries: [],
		isOpen: false,
		onPlayAgain: () => console.log('Play Again clicked'),
		onCopyLog: () => console.log('Copy Log clicked'),
		onSaveLog: () => console.log('Save Log clicked'),
	},
};

export const WithoutCallbacks: Story = {
	args: {
		winnerAnnouncement: '🎉 Bob wins! 🎉',
		logEntries: [],
		isOpen: true,
	},
};

export const LongWinnerMessage: Story = {
	args: {
		winnerAnnouncement:
			'🎉 Alice, Bob, Charlie, Dave, Eve, Frank, Grace, and Helen all win together in an epic battle royale! 🎉',
		logEntries: [],
		isOpen: true,
		onPlayAgain: () => console.log('Play Again clicked'),
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
				logEntries={[]}
				isOpen={true}
			/>
		</div>
	),
};
