import {Button} from '../../components/Button/Button';
import {ModeSelector, type GameMode} from '../../components/ModeSelector/ModeSelector';
import {AnimalAbilities} from '../../components/AnimalAbilities/AnimalAbilities';
import {StandardSetup, type PlayerConfiguration} from './StandardSetup';
import {TeamSetup, type TeamConfiguration, type TeamPlayerConfiguration} from './TeamSetup';
import {ChallengerSetup} from './ChallengerSetup';
import type {AnimalType} from '../../lib/types';
import './SetupScreen.css';

export interface SetupScreenProperties {
	mode: GameMode;
	unlockedAnimals: Set<AnimalType>;
	playerCount: number;
	players: PlayerConfiguration[];
	selectedAnimal: AnimalType | null;
	opponentAnimal: AnimalType | null;
	teamCount: number;
	playersPerTeam: number;
	teams: TeamConfiguration[];
	teamPlayers: TeamPlayerConfiguration[];
	onModeChange: (mode: GameMode) => void;
	onPlayerCountChange: (count: number) => void;
	onPlayerChange: (index: number, player: PlayerConfiguration) => void;
	onAnimalSelect: (animal: AnimalType) => void;
	onTeamCountChange: (count: number) => void;
	onPlayersPerTeamChange: (count: number) => void;
	onTeamChange: (index: number, team: TeamConfiguration) => void;
	onTeamPlayerChange: (index: number, player: TeamPlayerConfiguration) => void;
	onStartGame: () => void;
	canStartGame: boolean;
}

export function SetupScreen({
	mode,
	unlockedAnimals,
	playerCount,
	players,
	selectedAnimal,
	opponentAnimal,
	teamCount,
	playersPerTeam,
	teams,
	teamPlayers,
	onModeChange,
	onPlayerCountChange,
	onPlayerChange,
	onAnimalSelect,
	onTeamCountChange,
	onPlayersPerTeamChange,
	onTeamChange,
	onTeamPlayerChange,
	onStartGame,
	canStartGame,
}: SetupScreenProperties) {
	const renderSetupContent = () => {
		switch (mode) {
			case 'standard':
				return (
					<StandardSetup
						playerCount={playerCount}
						players={players}
						unlockedAnimals={unlockedAnimals}
						onPlayerCountChange={onPlayerCountChange}
						onPlayerChange={onPlayerChange}
					/>
				);
			case 'team':
				return (
					<TeamSetup
						teamCount={teamCount}
						playersPerTeam={playersPerTeam}
						teams={teams}
						players={teamPlayers}
						unlockedAnimals={unlockedAnimals}
						onTeamCountChange={onTeamCountChange}
						onPlayersPerTeamChange={onPlayersPerTeamChange}
						onTeamChange={onTeamChange}
						onPlayerChange={onTeamPlayerChange}
					/>
				);
			case 'challenger':
				return (
					<ChallengerSetup
						selectedAnimal={selectedAnimal}
						unlockedAnimals={unlockedAnimals}
						opponentAnimal={opponentAnimal}
						onAnimalSelect={onAnimalSelect}
					/>
				);
		}
	};

	return (
		<div className="setup-screen">
			<h2>Game Setup</h2>

			<ModeSelector
				selectedMode={mode}
				onModeChange={onModeChange}
			/>

			<AnimalAbilities unlockedCount={unlockedAnimals.size} />

			{renderSetupContent()}

			<div className="start-game-container">
				<Button
					variant="primary"
					disabled={!canStartGame}
					onClick={onStartGame}
				>
					Start Game
				</Button>
			</div>
		</div>
	);
}
