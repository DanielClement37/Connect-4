import { Link } from "react-router-dom";
import "../Styles/ruleStyles/rules.css";

export const Rules = () => {
	return (
		<div className="rules-page">
			<div className="rules-card">
				<div className="center-container">
					<h1 className="rules-header">RULES</h1>
				</div>
				<h4 className="purple heading-s">OBJECTIVE</h4>
				<p>Be the first player to connect 4 of the same colored discs in a row (either vertically, horizontally, or diagonally).</p>
				<h4 className="purple heading-s">HOW TO PLAY</h4>
				<ol className="rules">
					<li><p>Red goes first in the first game.</p></li>
					<li><p>Players must alternate turns, and only one disc can be dropped in each turn.</p></li>
					<li><p>The game ends when there is a 4-in-a-row or a stalemate.</p></li>
					<li><p>The starter of the previous game goes second on the next game.</p></li>
				</ol>
				<div className="return-container center-container">
					<Link to={`/Connect-4`} className="link return-btn">
						<div className="return-img" />
					</Link>
				</div>
			</div>
		</div>
	);
};
