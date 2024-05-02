import GameLogo from "../assets/images/logo.svg";
import { PlayerInfo } from "../Components/PlayerInfo";
import { GameBoard } from "../Components/GameBoard";
import { GameInfo } from "../Components/GameInfo";
import "../Styles/gameStyles/gamePageDesk.css";
import { InitGameState } from "../Helpers/GameMethods";
import { useState } from "react";
import { Player } from "../Types/Enums";
import { PauseModal } from "../Components/PauseModal";

export const Game = () => {
	const [gameState, setGameState] = useState(InitGameState());
	const [isPaused, setIsPaused] = useState(false);

	const handleRestart = () => {
		setGameState(InitGameState());
		setIsPaused(false);
		console.log(gameState);
	};

	const handlePause = () =>{
		setIsPaused(true);
		//TODO when gamestate is in a react context dispatch runningState to PAUSED
	}

	const handleResume = () => {
		setIsPaused(false);
		//TODO when gamestate is in a react context dispatch runningState to RUNNING
	}

	return (
		<div className="game-page">
			{isPaused && <PauseModal resume={()=> handleResume()} restart={() => handleRestart()}/>}
			<div className="game-header">
				<button onClick={()=> handlePause()} className="header-btn">MENU</button>
				<img src={GameLogo} alt="game logo" className="logo" />
				<button onClick={() => handleRestart()} className="header-btn">
					RESTART
				</button>
			</div>
			<div className="game-body">
				<PlayerInfo playerColor={Player.RED} />
				<GameBoard gameBoard={gameState.boardState}/>
				<PlayerInfo playerColor={Player.YELLOW} />
			</div>
			<GameInfo />
			<div className="game-footer" />
		</div>
	);
};
