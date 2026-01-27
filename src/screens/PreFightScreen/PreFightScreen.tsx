import {useEffect, useState} from 'react';
import type {AnimalType} from '../../lib/types';
import {ANIMAL_ROSTER} from '../../lib/constants';
import './PreFightScreen.css';

// Realistic animal images - using high quality stock photo URLs
const ANIMAL_IMAGES: Record<AnimalType, string> = {
	Coyote: 'https://images.unsplash.com/photo-1474511320723-9a56873571b7?w=400&h=400&fit=crop&crop=faces',
	Llama: 'https://images.unsplash.com/photo-1518288774672-b94e808873ff?w=400&h=400&fit=crop&crop=faces',
	Tiger: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=400&h=400&fit=crop&crop=faces',
	Gorilla: 'https://images.unsplash.com/photo-1544020877-89b5bda8ea5a?w=400&h=400&fit=crop&crop=faces',
	Monkey: 'https://images.unsplash.com/photo-1540573133985-87b6da6d54a9?w=400&h=400&fit=crop&crop=faces',
	Bird: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=400&h=400&fit=crop&crop=faces',
	Crocodile: 'https://images.unsplash.com/photo-1518831107511-a2bbc0a3b88f?w=400&h=400&fit=crop&crop=faces',
};

export interface PreFightScreenProps {
	player1Name: string;
	player1Animal: AnimalType;
	player2Name: string;
	player2Animal: AnimalType;
	onFightStart: () => void;
}

export function PreFightScreen({
	player1Name,
	player1Animal,
	player2Name,
	player2Animal,
	onFightStart,
}: PreFightScreenProps) {
	const [showVs, setShowVs] = useState(false);
	const [showPlayers, setShowPlayers] = useState(false);
	const [showButton, setShowButton] = useState(false);

	useEffect(() => {
		// Staggered animation sequence
		const timer1 = setTimeout(() => setShowPlayers(true), 200);
		const timer2 = setTimeout(() => setShowVs(true), 600);
		const timer3 = setTimeout(() => setShowButton(true), 1200);

		return () => {
			clearTimeout(timer1);
			clearTimeout(timer2);
			clearTimeout(timer3);
		};
	}, []);

	return (
		<div className="prefight-screen">
			<div className="prefight-backdrop" />

			<div className="prefight-container">
				{/* Player 1 Side */}
				<div className={`fighter-panel fighter-left ${showPlayers ? 'visible' : ''}`}>
					<div className="fighter-image-container">
						<img
							src={ANIMAL_IMAGES[player1Animal]}
							alt={player1Animal}
							className="fighter-image"
						/>
						<div className="fighter-glow left" />
					</div>
					<div className="fighter-info">
						<h2 className="fighter-name">{player1Name}</h2>
						<h3 className="fighter-animal">{player1Animal}</h3>
						<p className="fighter-ability">{ANIMAL_ROSTER[player1Animal].abilityDesc}</p>
					</div>
				</div>

				{/* VS Badge */}
				<div className={`vs-container ${showVs ? 'visible' : ''}`}>
					<div className="vs-flames">
						<div className="flame flame-1" />
						<div className="flame flame-2" />
						<div className="flame flame-3" />
						<div className="flame flame-4" />
						<div className="flame flame-5" />
					</div>
					<div className="vs-badge">
						<span className="vs-text">VS</span>
					</div>
				</div>

				{/* Player 2 Side */}
				<div className={`fighter-panel fighter-right ${showPlayers ? 'visible' : ''}`}>
					<div className="fighter-image-container">
						<img
							src={ANIMAL_IMAGES[player2Animal]}
							alt={player2Animal}
							className="fighter-image"
						/>
						<div className="fighter-glow right" />
					</div>
					<div className="fighter-info">
						<h2 className="fighter-name">{player2Name}</h2>
						<h3 className="fighter-animal">{player2Animal}</h3>
						<p className="fighter-ability">{ANIMAL_ROSTER[player2Animal].abilityDesc}</p>
					</div>
				</div>
			</div>

			{/* Fight Button */}
			<button
				className={`fight-button ${showButton ? 'visible' : ''}`}
				onClick={onFightStart}
			>
				<span className="fight-button-text">FIGHT!</span>
				<div className="fight-button-sparks" />
			</button>

			<div className="prefight-tagline">NO MERCY. NO SURRENDER.</div>
		</div>
	);
}
