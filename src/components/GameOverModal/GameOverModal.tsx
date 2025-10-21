import {useState, useEffect} from 'react';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import type {LogEntry} from '../../lib/types';
import './GameOverModal.css';

export interface GameOverModalProperties {
	winnerAnnouncement: string;
	logEntries: LogEntry[];
	isOpen?: boolean;
	onPlayAgain?: () => void;
	onCopyLog?: () => void;
	onSaveLog?: () => void;
}

export function GameOverModal({
	winnerAnnouncement,
	logEntries,
	isOpen = false,
	onPlayAgain,
	onCopyLog,
	onSaveLog,
}: GameOverModalProperties) {
	const [viewingLog, setViewingLog] = useState(false);

	useEffect(() => {
		if (!isOpen || !viewingLog) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setViewingLog(false);
				event.preventDefault();
			}
		};

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [isOpen, viewingLog]);

	if (!isOpen) {
		return null;
	}

	const formatLogEntry = (entry: LogEntry, index: number): string => {
		if (entry.indent === 0) {
			return entry.message;
		}

		const nextEntry = logEntries[index + 1];
		const hasNextSibling = nextEntry && nextEntry.indent === entry.indent;
		const hasChildren = nextEntry && nextEntry.indent > entry.indent;

		let prefix = '';
		if (entry.indent === 1) {
			if (hasChildren) {
				prefix = hasNextSibling ? '├─┐ ' : '└─┐ ';
			} else {
				prefix = hasNextSibling ? '├── ' : '└── ';
			}
		} else if (entry.indent === 2) {
			const connector = hasNextSibling ? '├─┐ ' : '└─┐ ';
			if (hasChildren) {
				prefix = '  ' + connector;
			} else {
				prefix = '  ' + (hasNextSibling ? '├── ' : '└── ');
			}
		} else if (entry.indent === 3) {
			const connector = hasNextSibling ? '├── ' : '└── ';
			prefix = '    ' + connector;
		}

		return prefix + entry.message;
	};

	if (viewingLog) {
		return (
			<div className="game-over-screen">
				<div className="game-over-modal game-over-modal-log">
					<h2>Game Log</h2>
					<div className="modal-log-content">
						{logEntries.map((entry, index) => (
							<div
								key={index}
								className="modal-log-entry"
							>
								{formatLogEntry(entry, index)}
							</div>
						))}
					</div>
					<div className="button-group">
						<Button
							variant="primary"
							onClick={() => setViewingLog(false)}
						>
							<Icon name="undo" />
							Back to Results
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
						onClick={() => setViewingLog(true)}
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
