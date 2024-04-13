import { Link } from "react-router-dom";
import GameLogo from "../assets/images/logo.svg";
import PvpImg from "../assets/images/player-vs-player.svg";
import "../Styles/mainMenu.css"

export const MainMenu = () => {
	return (
		<div className="menu-card">
			<img src={GameLogo} alt="game logo" />
			<div className="pvp-btn">
				<Link to={`Game`}>
					<h2 className="heaing-m">PLAY VS PLAYER</h2>
					<img src={PvpImg} alt="two faces" />
				</Link>
			</div>
			<div className="rules-btn">
				<Link to={`Rules`}>
					<h2 className="heaing-m">GAME RULES</h2>
				</Link>
			</div>
		</div>
	);
};
