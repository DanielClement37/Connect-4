/* eslint-disable @typescript-eslint/no-unused-vars */
import { Cell } from "../Types/GameTypes";
import "../Styles/gameStyles/gameBoardDesk.css";
import { useContext, useState } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";
import { classNames } from "../Utils/ClassNames";
import { Player } from "../Types/Enums";

export interface GameBoardProps {
	gameBoard: Cell[][];
}

export const GameBoard = ({ gameBoard }: GameBoardProps) => {
	const { state, dispatch } = useContext(AppContext);
	const {gameState} = state
	
	const [hoveredCol, setHoveredCol] = useState<number>(0);
	const columnWidth = 632 / 7; // Calculate the width of each column
	const markerWidth = 38; // The width of the marker
    const adjustment = (columnWidth - markerWidth) / 2;

	return (
		<div className="board-container">
			<div className="marker-container">
				<div
					className={classNames(gameState.currPlayer === Player.RED ? "marker-red" : "marker-yellow")}
					style={{
						left: hoveredCol !== null ? `${hoveredCol * columnWidth + adjustment}px` : "0px",
						position: "absolute",
						transition: "left 0.1s ease",
					}}
				/>
			</div>
			<div className="board-grid">
				{gameBoard.map((col, colIndex) => (
					<div key={colIndex} className="board-col" onMouseEnter={() => {setHoveredCol(colIndex); console.log(colIndex)}}>
						{col.map((cell, rowIndex) => (
							<div key={rowIndex} className="board-cell"></div>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
