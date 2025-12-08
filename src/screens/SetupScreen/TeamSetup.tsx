import {Select, type SelectOption} from '../../components/Select/Select';
import {Input} from '../../components/Input/Input';
import {PlayerSetup} from '../../components/PlayerSetup/PlayerSetup';
import type {AnimalType} from '../../lib/types';
import {TEAM_COLORS} from '../../lib/constants';
import './TeamSetup.css';

export interface TeamConfiguration {
	id: number;
	name: string;
	color: string;
}

export interface TeamPlayerConfiguration {
	name: string;
	animalType: AnimalType;
	playerType: 'human' | 'computer';
	teamId: number;
}

export interface TeamSetupProperties {
	teamCount: number;
	playersPerTeam: number;
	teams: TeamConfiguration[];
	players: TeamPlayerConfiguration[];
	unlockedAnimals: Set<AnimalType>;
	onTeamCountChange: (count: number) => void;
	onPlayersPerTeamChange: (count: number) => void;
	onTeamChange: (index: number, team: TeamConfiguration) => void;
	onPlayerChange: (index: number, player: TeamPlayerConfiguration) => void;
	disabled?: boolean;
}

export function TeamSetup({
	teamCount,
	playersPerTeam,
	teams,
	players,
	unlockedAnimals,
	onTeamCountChange,
	onPlayersPerTeamChange,
	onTeamChange,
	onPlayerChange,
	disabled = false,
}: TeamSetupProperties) {
	const teamCountOptions: SelectOption[] = Array.from({length: 5}, (_, i) => ({
		value: (i + 2).toString(),
		label: `${i + 2} Teams`,
	}));

	const playersPerTeamOptions: SelectOption[] = Array.from({length: 4}, (_, i) => ({
		value: (i + 1).toString(),
		label: `${i + 1} per team`,
	}));

	const handleTeamCountChange = (value: string) => {
		onTeamCountChange(parseInt(value, 10));
	};

	const handlePlayersPerTeamChange = (value: string) => {
		onPlayersPerTeamChange(parseInt(value, 10));
	};

	const totalPlayers = teamCount * playersPerTeam;

	return (
		<div className="team-setup">
			<div className="setup-section team-options">
				<Select
					id="team-count"
					label="Number of Teams:"
					value={teamCount.toString()}
					options={teamCountOptions}
					onChange={handleTeamCountChange}
					disabled={disabled}
				/>
				<Select
					id="players-per-team"
					label="Players per Team:"
					value={playersPerTeam.toString()}
					options={playersPerTeamOptions}
					onChange={handlePlayersPerTeamChange}
					disabled={disabled}
				/>
			</div>

			<div className="teams-section">
				<h3>Team Names</h3>
				<div className="team-names">
					{teams.slice(0, teamCount).map((team, index) => (
						<div
							key={index}
							className="team-name-input"
						>
							<span
								className="team-color-indicator"
								style={{backgroundColor: TEAM_COLORS[index % TEAM_COLORS.length]}}
							/>
							<Input
								id={`team-${index}-name`}
								value={team.name}
								onChange={(name) =>
									onTeamChange(index, {
										...team,
										name,
										color: TEAM_COLORS[index % TEAM_COLORS.length] ?? '#888888',
									})
								}
								placeholder={`Team ${index + 1}`}
								disabled={disabled}
							/>
						</div>
					))}
				</div>
			</div>

			<div className="players-section">
				<h3>Players</h3>
				{teams.slice(0, teamCount).map((team, teamIndex) => (
					<div
						key={teamIndex}
						className="team-players"
					>
						<div
							className="team-header"
							style={{borderLeftColor: team.color}}
						>
							{team.name || `Team ${teamIndex + 1}`}
						</div>
						{players
							.slice(teamIndex * playersPerTeam, (teamIndex + 1) * playersPerTeam)
							.map((player, playerIndex) => {
								const globalIndex = teamIndex * playersPerTeam + playerIndex;
								if (globalIndex >= totalPlayers) return null;
								return (
									<PlayerSetup
										key={globalIndex}
										playerNumber={globalIndex + 1}
										playerName={player.name}
										animalType={player.animalType}
										playerType={player.playerType}
										unlockedAnimals={unlockedAnimals}
										onPlayerNameChange={(name) =>
											onPlayerChange(globalIndex, {...player, name})
										}
										onAnimalTypeChange={(animalType) =>
											onPlayerChange(globalIndex, {...player, animalType})
										}
										onPlayerTypeChange={(playerType) =>
											onPlayerChange(globalIndex, {...player, playerType})
										}
										disabled={disabled}
									/>
								);
							})}
					</div>
				))}
			</div>
		</div>
	);
}
