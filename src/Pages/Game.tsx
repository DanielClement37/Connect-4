import GameLogo from "../assets/images/logo.svg";
import { PlayerInfo } from "../Components/PlayerInfo";
import { GameBoard } from "../Components/GameBoard";
import { GameInfo } from "../Components/GameInfo";
import "../Styles/gameStyles/gamePageDesk.css";
import { InitGameState } from "../Helpers/GameMethods";
import { useState } from "react";
import { Player } from "../Types/Enums";

export const Game = () => {
	const [gameState, setGameState] = useState(InitGameState());

	const handleRestart = () => {
		setGameState(InitGameState());

		console.log(gameState);
	};

	return (
		<div className="game-page">
			<div className="game-header">
				<button className="game-header-btn game-menu">Menu</button>
				<img src={GameLogo} alt="game logo" className="logo" />
				<button onClick={() => handleRestart()} className="game-header-btn game-restart">
					Restart
				</button>
			</div>
			<div className="game-body">
				<PlayerInfo playerColor={Player.RED} />
				<GameBoard gameBoard={gameState.boardState}/>
				<PlayerInfo playerColor={Player.YELLOW} />
			</div>
			<div className="game-footer">
				<GameInfo />
			</div>
		</div>
	);
};
