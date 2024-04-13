import { Link } from "react-router-dom";
import GameLogo from "../assets/images/logo.svg";
import PvpImg from "../assets/images/player-vs-player.svg";
import "../Styles/mainMenu.css";

export const MainMenu = () => {
	return (
		<div className="menu-page">
			<div className="menu-card">
				<img src={GameLogo} alt="game logo" />
				<Link to={`Game`} className="pvp menu-btn link">
					<h2 className="heaing-m">PLAY VS PLAYER</h2>
					<img src={PvpImg} alt="two faces" />
				</Link>
				<Link to={`Rules`} className="rules menu-btn link">
					<h2 className="heaing-m">GAME RULES</h2>
				</Link>
			</div>
		</div>
	);
};
