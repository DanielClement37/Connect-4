import { Link } from "react-router-dom";
import GameLogo from "../assets/images/logo.svg";
import PvpImg from "../assets/images/player-vs-player.svg";
import PveImg from "../assets/images/player-vs-cpu.svg"
import "../Styles/mainMenu.css"

export const MainMenu = () => {
	return (
		<div className="menu-page">
			<div className="menu-card">
				<img className="menu-img" src={GameLogo} alt="game logo" />
				<Link to={`/Connect-4/game-vs-cpu`} className="pve-btn menu-btn link">
					<h3 className="heaing-m">PLAY VS CPU</h3>
					<img src={PveImg} alt="two faces" />
				</Link>
				<Link to={`/Connect-4/Game`} className="pvp-btn menu-btn link">
					<h3 className="heaing-m">PLAY VS PLAYER</h3>
					<img src={PvpImg} alt="two faces" />
				</Link>
				<Link to={`/Connect-4/Rules`} className="rules-btn menu-btn link">
					<h3 className="heaing-m">GAME RULES</h3>
				</Link>
			</div>
		</div>
	);
};
