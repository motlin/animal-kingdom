import {Button} from '../../components/Button/Button';
import {ModeSelector, type GameMode} from '../../components/ModeSelector/ModeSelector';
import {AnimalAbilities} from '../../components/AnimalAbilities/AnimalAbilities';
import {StandardSetup, type PlayerConfiguration} from './StandardSetup';
import {ChallengerSetup} from './ChallengerSetup';
import type {AnimalType} from '../../types';
import './SetupScreen.css';

export interface SetupScreenProperties {
	mode: GameMode;
	unlockedAnimals: Set<AnimalType>;
	playerCount: number;
	players: PlayerConfiguration[];
	selectedAnimal: AnimalType | null;
	opponentAnimal: AnimalType | null;
	onModeChange: (mode: GameMode) => void;
	onPlayerCountChange: (count: number) => void;
	onPlayerChange: (index: number, player: PlayerConfiguration) => void;
	onAnimalSelect: (animal: AnimalType) => void;
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
	onModeChange,
	onPlayerCountChange,
	onPlayerChange,
	onAnimalSelect,
	onStartGame,
	canStartGame,
}: SetupScreenProperties) {
	return (
		<div className="setup-screen">
			<h2>Game Setup</h2>

			<ModeSelector
				selectedMode={mode}
				onModeChange={onModeChange}
			/>

			<AnimalAbilities unlockedCount={unlockedAnimals.size} />

			{mode === 'standard' ? (
				<StandardSetup
					playerCount={playerCount}
					players={players}
					unlockedAnimals={unlockedAnimals}
					onPlayerCountChange={onPlayerCountChange}
					onPlayerChange={onPlayerChange}
				/>
			) : (
				<ChallengerSetup
					selectedAnimal={selectedAnimal}
					unlockedAnimals={unlockedAnimals}
					opponentAnimal={opponentAnimal}
					onAnimalSelect={onAnimalSelect}
				/>
			)}

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
