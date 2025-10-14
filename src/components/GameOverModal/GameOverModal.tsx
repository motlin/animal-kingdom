import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import './GameOverModal.css';

export interface GameOverModalProperties {
	winnerAnnouncement: string;
	isOpen?: boolean;
	onPlayAgain?: () => void;
	onViewLog?: () => void;
	onCopyLog?: () => void;
	onSaveLog?: () => void;
}

export function GameOverModal({
	winnerAnnouncement,
	isOpen = false,
	onPlayAgain,
	onViewLog,
	onCopyLog,
	onSaveLog,
}: GameOverModalProperties) {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="game-over-screen">
			<div className="game-over-modal">
				<h2>{winnerAnnouncement}</h2>
				<div className="button-group">
					<Button
						variant="primary"
						className="primary"
						{...(onPlayAgain && {onClick: onPlayAgain})}
					>
						<Icon name="refresh-cw" />
						Play Again
					</Button>
					<Button
						variant="primary"
						{...(onViewLog && {onClick: onViewLog})}
					>
						<Icon name="eye" />
						View Log
					</Button>
					<Button
						variant="primary"
						{...(onCopyLog && {onClick: onCopyLog})}
					>
						<Icon name="clipboard-copy" />
						Copy to Clipboard
					</Button>
					<Button
						variant="primary"
						{...(onSaveLog && {onClick: onSaveLog})}
					>
						<Icon name="download" />
						Save Log
					</Button>
				</div>
			</div>
		</div>
	);
}
