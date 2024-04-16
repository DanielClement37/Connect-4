import { Player } from "../Types/Enums";
import { classNames } from "../Utils/ClassNames";
import "../Styles/gameStyles/playerInfo.css";

export interface PlayerInfoProps {
	playerColor: Player;
}

export const PlayerInfo = ({ playerColor }: PlayerInfoProps) => {
	return (
		<div className="player-info-container">
			<div className="player-info-card">
				<div className="img-container center-container">
					<div className={classNames("img", playerColor == Player.RED ? "red-img" : "yellow-img")} />
				</div>
				<div className="info-container">
					<h4 className="heading-s">PLAYER {playerColor}</h4>
					<h2 className="heading-l">0</h2>
				</div>
			</div>
		</div>
	);
};
