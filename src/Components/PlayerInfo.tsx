import {classNames} from "../Utils/ClassNames";
import "../Styles/gameStyles/playerInfo.css";

export interface PlayerInfoProps {
    playerText: string;
    className?: string;
    playerImg: string;
    playerScore: number;
}

export const PlayerInfo = ({playerText, playerImg , playerScore, className}: PlayerInfoProps) => {
    return (
        <div className="player-info-container">
            <div className="player-info-card">
                <img
                    className={classNames("player-img", className)}
                    src={playerImg}
                    alt="Player Piece"
                />
                <div className="info-container">
                    <h4 className="player-text">{playerText}</h4>
                    <h1 className="player-score">{playerScore}</h1>
                </div>
            </div>
        </div>
    );
};
