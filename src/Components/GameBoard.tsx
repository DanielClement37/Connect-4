import { Cell } from "../Types/GameTypes";
import "../Styles/gameStyles/gameBoardDesk.css";

export interface GameBoardProps {
	gameBoard: Cell[][];
}

export const GameBoard = ({ gameBoard }: GameBoardProps) => {
	return (
		<div className="relative">
			<div className="board-container">
				<div className="board-grid">
					{gameBoard.map((col, colIndex) => (
						<div key={colIndex} className="board-col">
							{col.map((cell, rowIndex) => (
								<div key={rowIndex} className="board-cell"></div>
							))}
						</div>
					))}
				</div>
			</div>
		</div>
	);
};
