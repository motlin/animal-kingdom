import {AnimalCard} from '../../components/AnimalCard/AnimalCard';
import {OpponentCard} from '../../components/OpponentCard/OpponentCard';
import {ANIMAL_ROSTER} from '../../lib/constants';
import type {AnimalType} from '../../lib/types';
import './ChallengerSetup.css';

export interface ChallengerSetupProperties {
	selectedAnimal: AnimalType | null;
	unlockedAnimals: Set<AnimalType>;
	opponentAnimal: AnimalType | null;
	onAnimalSelect: (animal: AnimalType) => void;
	disabled?: boolean;
}

export function ChallengerSetup({
	selectedAnimal,
	unlockedAnimals,
	opponentAnimal,
	onAnimalSelect,
	disabled = false,
}: ChallengerSetupProperties) {
	const unlockedAnimalsList = Array.from(unlockedAnimals);

	const handleAnimalClick = disabled ? undefined : onAnimalSelect;

	return (
		<div className="challenger-setup">
			<div className="challenger-selection">
				<h3>Choose Your Fighter</h3>
				<div className="unlocked-animals-grid">
					{unlockedAnimalsList.map((animal) => (
						<AnimalCard
							key={animal}
							animal={animal}
							abilityDescription={ANIMAL_ROSTER[animal].abilityDesc}
							selected={selectedAnimal === animal}
							{...(handleAnimalClick ? {onClick: handleAnimalClick} : {})}
						/>
					))}
				</div>
			</div>

			<div className="challenger-opponent">
				<h3>Your Opponent</h3>
				{opponentAnimal ? (
					<OpponentCard opponentName={opponentAnimal} />
				) : (
					<div className="no-challengers">
						<p>No challengers available</p>
						<p>Unlock more animals by winning in standard mode!</p>
					</div>
				)}
			</div>
		</div>
	);
}
