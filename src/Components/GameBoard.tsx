/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Styles/gameStyles/gameBoardDesk.css";
import { useContext, useState } from "react";
import { AppContext } from "../GlobalState/Context/AppContext";
import { classNames } from "../Utils/ClassNames";
import { CellColor, Player, RunningState } from "../Types/Enums";
import { GAME_OVER, MAKE_MOVE, PAUSE, SET_HOVERED_COLUMN, SET_WINNING_CELLS } from "../GlobalState/Actions/actiontypes";
import { checkForWin } from "../Helpers/GameMethods";

export const GameBoard = () => {
	const { state, dispatch } = useContext(AppContext);
	const { gameState, moveList, runningState, winningCells } = state;

	const [hoveredCol, setHoveredCol] = useState<number>(0);
	const columnWidth = 632 / 7; // Calculate the width of each column
	const markerWidth = 38; // The width of the marker
	const adjustment = (columnWidth - markerWidth) / 2;

	const isWinningCell = (row: number, col: number) => {
		return winningCells.some((cell) => cell.row === row && cell.col === col);
	};

	const handleMove = (colIndex: number) => {
		if (runningState !== RunningState.RUNNING) return;

		// Find if the move is within the possible moves
		const validMove = moveList.find((move) => move.col === colIndex && move.color === CellColor.NONE);

		if (validMove) {
			const newBoardState = gameState.boardState.map((col) => col.slice()); // Clone the board state

			if (newBoardState[colIndex][validMove.row].color === CellColor.NONE) {
				newBoardState[colIndex][validMove.row].color = gameState.currPlayer as unknown as CellColor; // Set the player's color
				newBoardState[colIndex][validMove.row].isHovered = false;

				const result = checkForWin(newBoardState);
				if (result.winner) {
					console.log(result.winner + " has won the game!");

					/* 
					TODO Highlight the winning cells in the UI, using result.winningCells
					e.g., pass winningCells to the game board component to render them differently 
					*/
					console.log(result.winningCells);

					const newPlayerScores = gameState.playerScores;
					newPlayerScores[gameState.currPlayer - 1]++;

					dispatch({
						type: GAME_OVER,
						payload: {
							boardState: newBoardState,
							currPlayer: gameState.currPlayer,
							turnCount: gameState.turnCount,
							playerScores: newPlayerScores,
							gameWinner: result.winner,
						},
					});

					dispatch({
						type: SET_WINNING_CELLS,
						payload: result.winningCells
					});

					dispatch({
						type: PAUSE,
						payload: RunningState.GAME_OVER,
					});
					return;
				}
			}

			// Update game state after the move
			const newTurnCount = gameState.turnCount + 1;
			const newCurrPlayer = gameState.currPlayer === Player.RED ? Player.YELLOW : Player.RED;

			dispatch({
				type: MAKE_MOVE,
				payload: {
					boardState: newBoardState,
					currPlayer: newCurrPlayer,
					turnCount: newTurnCount,
					playerScores: gameState.playerScores,
					gameWinner: gameState.gameWinner,
				},
			});
		}
	};

	const handleHoverEnter = (colIndex: number) => {
		setHoveredCol(colIndex);
		const validMove = moveList.find((move) => move.col === colIndex && move.color === CellColor.NONE);
		if (validMove) {
			const newBoardState = gameState.boardState.map((col) => col.slice()); // Clone the board state

			if (newBoardState[colIndex][validMove.row].color === CellColor.NONE) {
				newBoardState[colIndex][validMove.row].isHovered = true; // Set the player's color

				dispatch({
					type: SET_HOVERED_COLUMN,
					payload: {
						boardState: newBoardState,
						currPlayer: gameState.currPlayer,
						turnCount: gameState.turnCount,
						playerScores: gameState.playerScores,
						gameWinner: gameState.gameWinner,
					},
				});
			}
		}
	};

	const handleHoverExit = (colIndex: number) => {
		setHoveredCol(colIndex);

		const validMove = moveList.find((move) => move.col === colIndex && move.color === CellColor.NONE);
		if (validMove) {
			const newBoardState = gameState.boardState.map((col) => col.slice()); // Clone the board state

			if (newBoardState[colIndex][validMove.row].color === CellColor.NONE) {
				newBoardState[colIndex][validMove.row].isHovered = false; // Set the player's color

				dispatch({
					type: SET_HOVERED_COLUMN,
					payload: {
						boardState: newBoardState,
						currPlayer: gameState.currPlayer,
						turnCount: gameState.turnCount,
						playerScores: gameState.playerScores,
						gameWinner: gameState.gameWinner,
					},
				});
			}
		}
	};

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
				{gameState.boardState.map((col, colIndex) => (
					<div
						key={colIndex}
						className="board-col"
						onClick={() => handleMove(colIndex)}
						onMouseEnter={() => handleHoverEnter(colIndex)}
						onMouseLeave={() => handleHoverExit(colIndex)}
					>
						{col.map((cell, rowIndex) => (
							<div
								key={rowIndex}
								className={classNames(
									"board-cell",
									cell.color === CellColor.RED ? "red-cell" : cell.color === CellColor.YELLOW && "yellow-cell",
									cell.isHovered && gameState.currPlayer === Player.RED && "hovered-red",
									cell.isHovered && gameState.currPlayer === Player.YELLOW && "hovered-yellow",
									isWinningCell(rowIndex, colIndex) && "winning-cell"
								)}
							/>
						))}
					</div>
				))}
			</div>
		</div>
	);
};
