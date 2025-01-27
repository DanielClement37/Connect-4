import {Player} from "../Types/Enums";
import {classNames} from "../Utils/ClassNames";
import "../Styles/gameStyles/playerInfo.css";
import {useContext} from "react";
import {AppContext} from "../GlobalState/Context/AppContext";
import PlayerOneImg from "../assets/images/player-one.svg";
import PlayerTwoImg from "../assets/images/player-two.svg";

export interface PlayerInfoProps {
    playerColor: Player;
}

export const PlayerInfo = ({playerColor}: PlayerInfoProps) => {
    const {state} = useContext(AppContext);
    const {gameState} = state;

    return (
        <div className="player-info-container">
            <div className="player-info-card">
                <img
                    className={classNames("player-img", playerColor === Player.RED ? "red-player-img" : "yellow-player-img")}
                    src={playerColor === Player.RED ? PlayerOneImg : PlayerTwoImg}
                    alt="Player Piece"
                />
                <div className="info-container">
                    <h4 className="player-text">PLAYER {playerColor}</h4>
                    <h1 className="player-score">{gameState.playerScores[playerColor - 1]}</h1>
                </div>
            </div>
        </div>
    );
};
