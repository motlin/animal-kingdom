import {
	Moon,
	Sun,
	Volume2,
	VolumeX,
	Users,
	Trophy,
	ChevronDown,
	ChevronUp,
	Play,
	Crosshair,
	Sparkles,
	Heart,
	ShieldCheck,
	Pause,
	Undo,
	ClipboardCopy,
	Download,
	RefreshCw,
	Eye,
	X,
	type LucideProps,
} from 'lucide-react';
import './Icon.css';

export type IconName =
	| 'moon'
	| 'sun'
	| 'volume-2'
	| 'volume-x'
	| 'users'
	| 'trophy'
	| 'chevron-down'
	| 'chevron-up'
	| 'play'
	| 'crosshair'
	| 'sparkles'
	| 'heart'
	| 'shield-check'
	| 'pause'
	| 'undo'
	| 'clipboard-copy'
	| 'download'
	| 'refresh-cw'
	| 'eye'
	| 'x';

const iconMap = {
	moon: Moon,
	sun: Sun,
	'volume-2': Volume2,
	'volume-x': VolumeX,
	users: Users,
	trophy: Trophy,
	'chevron-down': ChevronDown,
	'chevron-up': ChevronUp,
	play: Play,
	crosshair: Crosshair,
	sparkles: Sparkles,
	heart: Heart,
	'shield-check': ShieldCheck,
	pause: Pause,
	undo: Undo,
	'clipboard-copy': ClipboardCopy,
	download: Download,
	'refresh-cw': RefreshCw,
	eye: Eye,
	x: X,
};

export interface IconProperties extends Omit<LucideProps, 'ref'> {
	name: IconName;
	size?: number;
	className?: string;
}

export function Icon({name, size = 18, className = '', ...properties}: IconProperties) {
	const IconComponent = iconMap[name];

	if (!IconComponent) {
		console.error(`Icon "${name}" not found`);
		return null;
	}

	return (
		<IconComponent
			size={size}
			className={`icon ${className}`}
			{...properties}
		/>
	);
}
