import { Link } from "react-router-dom";
import GameLogo from "../assets/images/logo.svg";
import PvpImg from "../assets/images/player-vs-player.svg";
import "../Styles/mainMenu/mainMenuDesk.css"
import "../Styles/mainMenu/mainMenuMobile.css"

export const MainMenu = () => {
	return (
		<div className="menu-page">
			<div className="menu-card">
				<img className="menu-img" src={GameLogo} alt="game logo" />
				<Link to={`Game`} className="pvp-btn menu-btn link">
					<h3 className="heaing-m">PLAY VS PLAYER</h3>
					<img src={PvpImg} alt="two faces" />
				</Link>
				<Link to={`Rules`} className="rules-btn menu-btn link">
					<h3 className="heaing-m">GAME RULES</h3>
				</Link>
			</div>
		</div>
	);
};
