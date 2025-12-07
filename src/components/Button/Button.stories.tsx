import type {Meta, StoryObj} from '@storybook/react-vite';
import {Button} from './Button';

const meta = {
	title: 'Components/Button',
	component: Button,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['primary', 'mode', 'undo', 'toggle', 'log'],
		},
		disabled: {
			control: 'boolean',
		},
		active: {
			control: 'boolean',
		},
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
	args: {
		variant: 'primary',
		children: 'Primary Button',
	},
};

export const PrimaryDisabled: Story = {
	args: {
		variant: 'primary',
		children: 'Disabled Primary',
		disabled: true,
	},
};

export const PrimaryWithUnderline: Story = {
	args: {
		variant: 'primary',
		children: <span dangerouslySetInnerHTML={{__html: '<u>S</u>tart Game'}} />,
	},
};

export const Mode: Story = {
	args: {
		variant: 'mode',
		children: 'Standard Mode',
	},
};

export const ModeActive: Story = {
	args: {
		variant: 'mode',
		children: 'Standard Mode',
		active: true,
	},
};

export const ModeDisabled: Story = {
	args: {
		variant: 'mode',
		children: 'Standard Mode',
		disabled: true,
	},
};

export const Undo: Story = {
	args: {
		variant: 'undo',
		children: <span dangerouslySetInnerHTML={{__html: '<u>U</u>ndo Turn'}} />,
	},
};

export const UndoDisabled: Story = {
	args: {
		variant: 'undo',
		children: <span dangerouslySetInnerHTML={{__html: '<u>U</u>ndo Turn'}} />,
		disabled: true,
	},
};

export const Toggle: Story = {
	args: {
		variant: 'toggle',
		children: '🌙',
	},
};

export const Log: Story = {
	args: {
		variant: 'log',
		children: 'Copy Log',
	},
};

export const LogDisabled: Story = {
	args: {
		variant: 'log',
		children: 'Copy Log',
		disabled: true,
	},
};

export const AllVariants = {
	render: () => (
		<div style={{display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px'}}>
			<div>
				<h3>Primary Buttons</h3>
				<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
					<Button variant="primary">Primary</Button>
					<Button
						variant="primary"
						disabled
					>
						Primary Disabled
					</Button>
					<Button variant="primary">
						<span dangerouslySetInnerHTML={{__html: '<u>S</u>tart Game'}} />
					</Button>
				</div>
			</div>

			<div>
				<h3>Mode Buttons</h3>
				<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
					<Button variant="mode">Standard Mode</Button>
					<Button
						variant="mode"
						active
					>
						Challenger Mode (Active)
					</Button>
					<Button
						variant="mode"
						disabled
					>
						Disabled Mode
					</Button>
				</div>
			</div>

			<div>
				<h3>Undo Button</h3>
				<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
					<Button variant="undo">
						<span dangerouslySetInnerHTML={{__html: '<u>U</u>ndo Turn'}} />
					</Button>
					<Button
						variant="undo"
						disabled
					>
						<span dangerouslySetInnerHTML={{__html: '<u>U</u>ndo Turn (Disabled)'}} />
					</Button>
				</div>
			</div>

			<div>
				<h3>Toggle Button</h3>
				<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
					<Button variant="toggle">🌙</Button>
					<Button variant="toggle">🔇</Button>
				</div>
			</div>

			<div>
				<h3>Log Buttons</h3>
				<div style={{display: 'flex', gap: '10px', marginTop: '10px'}}>
					<Button variant="log">Copy Log</Button>
					<Button variant="log">Save Log</Button>
					<Button
						variant="log"
						disabled
					>
						Disabled Log
					</Button>
				</div>
			</div>
		</div>
	),
};
