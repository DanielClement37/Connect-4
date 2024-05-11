/* eslint-disable @typescript-eslint/no-unused-vars */
import { useContext } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";
import { Player, RunningState } from "../Types/Enums";
import "../Styles/gameStyles/gameStatusDesk.css";
import { classNames } from "../Utils/ClassNames";

export const GameStatus = () => {
	const { state } = useContext(AppContext);
	const { gameState, runningState } = state;

	if (runningState === RunningState.GAME_OVER) {
		return <div>Game over</div>;
	} else {
		return (
			<div className="status-container">
				<div className={classNames("status-img-container", gameState.currPlayer === Player.RED ? "red-status-img" : "yellow-status-img")} />
				<div className="status-content-container">
					<h4 className={classNames("heading-xs", gameState.currPlayer === Player.YELLOW && "black-text")}>PLAYER {gameState.currPlayer}'S TURN</h4>
					<h1 className={classNames("heading-l", gameState.currPlayer === Player.YELLOW && "black-text")}>30s</h1>
				</div>
			</div>
		);
	}
};
