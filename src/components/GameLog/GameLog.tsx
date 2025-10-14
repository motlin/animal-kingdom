import {useRef, useEffect} from 'react';
import {Button} from '../Button/Button';
import {Icon} from '../Icon/Icon';
import type {LogEntry} from '../../types';
import './GameLog.css';

export interface GameLogProperties {
	entries: LogEntry[];
	onCopyToClipboard?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onSaveLog?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function GameLog({entries, onCopyToClipboard, onSaveLog}: GameLogProperties) {
	const logContainerReference = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (logContainerReference.current) {
			logContainerReference.current.scrollTop = logContainerReference.current.scrollHeight;
		}
	}, [entries]);

	const formatLogEntry = (entry: LogEntry, index: number): string => {
		if (entry.indent === 0) {
			return entry.message;
		}

		const nextEntry = entries[index + 1];
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

	const handleCopyToClipboard = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (onCopyToClipboard) {
			onCopyToClipboard(event);
		}
	};

	const handleSaveLog = (event: React.MouseEvent<HTMLButtonElement>) => {
		if (onSaveLog) {
			onSaveLog(event);
		}
	};

	return (
		<div className="game-log-container">
			<h3 className="game-log-header">Game Log</h3>
			<div
				ref={logContainerReference}
				className="game-log-content"
			>
				{entries.map((entry, index) => (
					<div
						key={index}
						className="log-entry"
					>
						{formatLogEntry(entry, index)}
					</div>
				))}
			</div>
			<div className="log-buttons">
				<Button
					variant="log"
					onClick={handleCopyToClipboard}
				>
					<Icon name="clipboard-copy" />
					Copy to Clipboard
				</Button>
				<Button
					variant="log"
					onClick={handleSaveLog}
				>
					<Icon name="download" />
					Save Log
				</Button>
			</div>
		</div>
	);
}
