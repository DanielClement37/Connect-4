import { Player } from "../Types/Enums";
import { classNames } from "../Utils/ClassNames";
import "../Styles/gameStyles/playerInfo.css";
import { useContext } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";

export interface PlayerInfoProps {
	playerColor: Player;
}

export const PlayerInfo = ({ playerColor }: PlayerInfoProps) => {
	const { state } = useContext(AppContext);
	const { gameState } = state;

	return (
		<div className="player-info-container">
			<div className="player-info-card">
				<div className="player-img-container center-container">
					<div className={classNames("player-img", playerColor == Player.RED ? "red-player-img" : "yellow-player-img")} />
				</div>
				<div className="info-container">
					<h4 className="heading-s">PLAYER {playerColor}</h4>
					<h1 className="heading-l">{gameState.playerScores[playerColor-1]}</h1>
				</div>
			</div>
		</div>
	);
};
