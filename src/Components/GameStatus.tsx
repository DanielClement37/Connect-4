/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";
import { Player, RunningState } from "../Types/Enums";
import "../Styles/gameStyles/gameStatusDesk.css";
import { classNames } from "../Utils/ClassNames";

export interface GameStatusProps{
	handleRestart: ()=> void;
	counter: number;
}

export const GameStatus = ({handleRestart, counter}:GameStatusProps) => {
	const { state } = useContext(AppContext);
	const { gameState, runningState } = state;

	if (runningState === RunningState.GAME_OVER) {
		return (
			<div className="game-over-container">
				<div className="game-over-card">
					<h4 className="heading-xs">PLAYER {gameState.gameWinner}</h4>
					<h1 className="heading-l">WINS</h1>
					<button className="game-over-btn" onClick={()=>handleRestart()}>
						PLAY AGAIN
					</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className="status-container">
				<div className={classNames("status-img-container", gameState.currPlayer === Player.RED ? "red-status-img" : "yellow-status-img")} />
				<div className="status-content-container">
					<h4 className={classNames("heading-xs", gameState.currPlayer === Player.YELLOW && "black-text")}>PLAYER {gameState.currPlayer}'S TURN</h4>
					<h1 className={classNames("heading-l", gameState.currPlayer === Player.YELLOW && "black-text")}>{counter}s</h1>
				</div>
			</div>
		);
	}
};
