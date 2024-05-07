import GameLogo from "../assets/images/logo.svg";
import { PlayerInfo } from "../Components/PlayerInfo";
import { GameBoard } from "../Components/GameBoard";
import { GameStatus } from "../Components/GameStatus";
import "../Styles/gameStyles/gamePageDesk.css";
import { InitGameState } from "../Helpers/GameMethods";
import { useContext } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";
import { Player, RunningState } from "../Types/Enums";
import { PauseModal } from "../Components/PauseModal";
import {PAUSE, SET_MATCH_STATE} from "../GlobalState/Actions/actiontypes";
import { classNames } from "../Utils/ClassNames";


export const Game = () => {
	const { state, dispatch } = useContext(AppContext);
	const {gameState} = state

	const handleRestart = () => {
		dispatch({type: SET_MATCH_STATE, payload:InitGameState()});
		dispatch({type: PAUSE, payload: RunningState.PREGAME});
	};

	const handlePause = () =>{
		dispatch({type: PAUSE, payload: RunningState.PAUSED});
	}

	const handleResume = () => {
		dispatch({type: PAUSE, payload: RunningState.RUNNING});
	}

	return (
		<div className="game-page">
			{(state.runningState === RunningState.PAUSED) && <PauseModal resume={()=> handleResume()} restart={() => handleRestart()}/>}
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
			<GameStatus />
			<div className={classNames("footer",  gameState.gameWinner === Player.RED ? "red"  :  gameState.gameWinner === Player.YELLOW ? "yellow" : "dark-purple")}/>
		</div>
	);
};
