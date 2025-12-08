import {PlayerCard} from '../../components/PlayerCard/PlayerCard';
import {GameControls} from '../../components/GameControls/GameControls';
import {GameLog} from '../../components/GameLog/GameLog';
import {GameOverModal} from '../../components/GameOverModal/GameOverModal';
import type {Player, LogEntry, AnimalType, Team} from '../../lib/types';
import './GameScreen.css';

export interface GameScreenProperties {
	players: Player[];
	teams?: Team[];
	currentPlayerIndex: number;
	turnIndicator: string;
	currentAnimal: AnimalType;
	canAttack?: boolean;
	canUseAbility?: boolean;
	canHeal?: boolean;
	canShield?: boolean;
	canDoNothing?: boolean;
	canUndo?: boolean;
	healsRemaining?: number;
	shieldsRemaining?: number;
	logEntries: LogEntry[];
	isGameOver?: boolean;
	winnerAnnouncement?: string;
	selectablePlayerIds?: number[];
	onPlayerClick?: (playerId: number) => void;
	onAttack?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onUseAbility?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onHeal?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onShield?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onDoNothing?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onUndo?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onCopyToClipboard?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onSaveLog?: (event: React.MouseEvent<HTMLButtonElement>) => void;
	onPlayAgain?: () => void;
	onCopyLog?: () => void;
	onSaveGameLog?: () => void;
}

export function GameScreen({
	players,
	teams = [],
	currentPlayerIndex,
	turnIndicator,
	currentAnimal,
	canAttack = true,
	canUseAbility = true,
	canHeal = true,
	canShield = true,
	canDoNothing = true,
	canUndo = true,
	healsRemaining = 1,
	shieldsRemaining = 1,
	logEntries,
	isGameOver = false,
	winnerAnnouncement = '',
	selectablePlayerIds = [],
	onPlayerClick,
	onAttack,
	onUseAbility,
	onHeal,
	onShield,
	onDoNothing,
	onUndo,
	onCopyToClipboard,
	onSaveLog,
	onPlayAgain,
	onCopyLog,
	onSaveGameLog,
}: GameScreenProperties) {
	const handlePlayerClick = (playerId: number) => {
		if (onPlayerClick) {
			onPlayerClick(playerId);
		}
	};

	const currentPlayer = players[currentPlayerIndex];

	const getTeamColor = (teamId: number | undefined): string | undefined => {
		if (teamId === undefined) return undefined;
		const team = teams.find((t) => t.id === teamId);
		return team?.color;
	};

	return (
		<div className="game-screen">
			<div className="players-container">
				{players.map((player) => {
					const isActive = Boolean(currentPlayer && player.id === currentPlayer.id);
					const isSelectable = selectablePlayerIds.includes(player.id);
					const teamColor = getTeamColor(player.teamId);

					return (
						<PlayerCard
							key={player.id}
							player={player}
							isActive={isActive}
							isSelectable={isSelectable}
							{...(teamColor ? {teamColor} : {})}
							onClick={handlePlayerClick}
						/>
					);
				})}
			</div>

			<div className="game-interface">
				<div className="controls-container">
					<GameControls
						turnIndicator={turnIndicator}
						currentAnimal={currentAnimal}
						canAttack={canAttack}
						canUseAbility={canUseAbility}
						canHeal={canHeal}
						canShield={canShield}
						canDoNothing={canDoNothing}
						canUndo={canUndo}
						healsRemaining={healsRemaining}
						shieldsRemaining={shieldsRemaining}
						{...(onAttack && {onAttack})}
						{...(onUseAbility && {onUseAbility})}
						{...(onHeal && {onHeal})}
						{...(onShield && {onShield})}
						{...(onDoNothing && {onDoNothing})}
						{...(onUndo && {onUndo})}
					/>
				</div>

				<div className="log-container">
					<GameLog
						entries={logEntries}
						{...(onCopyToClipboard && {onCopyToClipboard})}
						{...(onSaveLog && {onSaveLog})}
					/>
				</div>
			</div>

			<GameOverModal
				winnerAnnouncement={winnerAnnouncement}
				logEntries={logEntries}
				isOpen={isGameOver}
				{...(onPlayAgain && {onPlayAgain})}
				{...(onCopyLog && {onCopyLog})}
				{...(onSaveGameLog && {onSaveLog: onSaveGameLog})}
			/>
		</div>
	);
}
