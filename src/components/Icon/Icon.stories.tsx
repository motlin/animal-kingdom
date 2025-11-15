import type {Meta, StoryObj} from '@storybook/react-vite';
import {Icon} from './Icon';

const meta = {
	title: 'Components/Icon',
	component: Icon,
	parameters: {
		layout: 'centered',
	},
	tags: ['autodocs'],
	argTypes: {
		name: {
			control: 'select',
			options: [
				'moon',
				'sun',
				'volume-2',
				'volume-x',
				'users',
				'trophy',
				'chevron-down',
				'chevron-up',
				'play',
				'crosshair',
				'sparkles',
				'heart',
				'shield-check',
				'pause',
				'undo',
				'clipboard-copy',
				'download',
				'refresh-cw',
				'eye',
				'x',
			],
		},
		size: {
			control: {type: 'number', min: 12, max: 64, step: 1},
		},
		color: {
			control: 'color',
		},
		strokeWidth: {
			control: {type: 'number', min: 1, max: 4, step: 0.5},
		},
	},
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Moon: Story = {
	args: {
		name: 'moon',
	},
};

export const Sun: Story = {
	args: {
		name: 'sun',
	},
};

export const Volume2: Story = {
	args: {
		name: 'volume-2',
	},
};

export const VolumeX: Story = {
	args: {
		name: 'volume-x',
	},
};

export const Users: Story = {
	args: {
		name: 'users',
	},
};

export const Trophy: Story = {
	args: {
		name: 'trophy',
	},
};

export const ChevronDown: Story = {
	args: {
		name: 'chevron-down',
	},
};

export const ChevronUp: Story = {
	args: {
		name: 'chevron-up',
	},
};

export const Play: Story = {
	args: {
		name: 'play',
	},
};

export const Crosshair: Story = {
	args: {
		name: 'crosshair',
	},
};

export const Sparkles: Story = {
	args: {
		name: 'sparkles',
	},
};

export const Heart: Story = {
	args: {
		name: 'heart',
	},
};

export const ShieldCheck: Story = {
	args: {
		name: 'shield-check',
	},
};

export const Pause: Story = {
	args: {
		name: 'pause',
	},
};

export const Undo: Story = {
	args: {
		name: 'undo',
	},
};

export const ClipboardCopy: Story = {
	args: {
		name: 'clipboard-copy',
	},
};

export const Download: Story = {
	args: {
		name: 'download',
	},
};

export const RefreshCw: Story = {
	args: {
		name: 'refresh-cw',
	},
};

export const Eye: Story = {
	args: {
		name: 'eye',
	},
};

export const X: Story = {
	args: {
		name: 'x',
	},
};

export const LargeIcon: Story = {
	args: {
		name: 'heart',
		size: 48,
	},
};

export const SmallIcon: Story = {
	args: {
		name: 'heart',
		size: 12,
	},
};

export const CustomColor: Story = {
	args: {
		name: 'heart',
		color: '#e74c3c',
	},
};

export const CustomStrokeWidth: Story = {
	args: {
		name: 'heart',
		strokeWidth: 3,
	},
};

export const AllIcons = {
	render: () => (
		<div style={{padding: '20px'}}>
			<h2 style={{marginBottom: '20px'}}>Theme Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
					marginBottom: '40px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="moon"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>moon</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="sun"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>sun</div>
				</div>
			</div>

			<h2 style={{marginBottom: '20px'}}>Sound Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
					marginBottom: '40px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="volume-2"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>volume-2</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="volume-x"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>volume-x</div>
				</div>
			</div>

			<h2 style={{marginBottom: '20px'}}>Mode Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
					marginBottom: '40px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="users"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>users</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="trophy"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>trophy</div>
				</div>
			</div>

			<h2 style={{marginBottom: '20px'}}>Navigation Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
					marginBottom: '40px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="chevron-down"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>chevron-down</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="chevron-up"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>chevron-up</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="eye"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>eye</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="x"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>x</div>
				</div>
			</div>

			<h2 style={{marginBottom: '20px'}}>Game Action Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
					marginBottom: '40px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="play"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>play</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="crosshair"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>crosshair</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="sparkles"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>sparkles</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>heart</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="shield-check"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>shield-check</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="pause"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>pause</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="undo"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>undo</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="refresh-cw"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>refresh-cw</div>
				</div>
			</div>

			<h2 style={{marginBottom: '20px'}}>Log Action Icons</h2>
			<div
				style={{
					display: 'grid',
					gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
					gap: '20px',
				}}
			>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="clipboard-copy"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>clipboard-copy</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="download"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>download</div>
				</div>
			</div>

			<h2 style={{marginTop: '40px', marginBottom: '20px'}}>Size Variations</h2>
			<div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={12}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>12px</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={18}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>18px (default)</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={24}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>24px</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>32px</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={48}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>48px</div>
				</div>
			</div>

			<h2 style={{marginTop: '40px', marginBottom: '20px'}}>Color Variations</h2>
			<div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						color="#e74c3c"
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>Red</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						color="#3498db"
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>Blue</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						color="#2ecc71"
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>Green</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						color="#f39c12"
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>Orange</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						color="#9b59b6"
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>Purple</div>
				</div>
			</div>

			<h2 style={{marginTop: '40px', marginBottom: '20px'}}>Stroke Width Variations</h2>
			<div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						strokeWidth={1}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>1</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						strokeWidth={1.5}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>1.5</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						strokeWidth={2}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>2 (default)</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						strokeWidth={2.5}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>2.5</div>
				</div>
				<div style={{textAlign: 'center'}}>
					<Icon
						name="heart"
						size={32}
						strokeWidth={3}
					/>
					<div style={{marginTop: '8px', fontSize: '12px'}}>3</div>
				</div>
			</div>
		</div>
	),
};
