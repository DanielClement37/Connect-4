/* eslint-disable @typescript-eslint/no-unused-vars */
import "../Styles/gameStyles/gameBoard.css";
import {useContext, useState} from "react";
import {AppContext} from "../GlobalState/Context/AppContext";
import {classNames} from "../Utils/ClassNames";
import {CellColor, Player, RunningState} from "../Types/Enums";
import {SET_HOVERED_COLUMN} from "../GlobalState/Actions/actiontypes";
import {useMediaQuery} from "react-responsive";

export interface GameBoardProps {
    handleMove: (colIndex: number) => void;
    lastPlaced: { col: number; row: number } | null;
}

export const GameBoard = ({handleMove, lastPlaced}: GameBoardProps) => {
    const {state, dispatch} = useContext(AppContext);
    const {gameState, moveList, runningState, winningCells} = state;
    const [hoveredCol, setHoveredCol] = useState<number>(0);
    const isMobile = useMediaQuery({maxWidth: 767});
    const showMarker = useMediaQuery({minWidth: 1025});

    // Calculate board/marker widths based on breakpoints
    const columnWidth = isMobile ? 335 / 7 : 632 / 7;
    const markerWidth = isMobile ? 0 : 38;
    const adjustment = (columnWidth - markerWidth) / 2;

    const isWinningCell = (row: number, col: number) => {
        return winningCells.some((cell) => cell.row === row && cell.col === col);
    };

    const handleHoverEnter = (colIndex: number) => {
        setHoveredCol(colIndex);
        if (runningState !== RunningState.RUNNING) {
            return;
        }
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
        if (runningState !== RunningState.RUNNING) {
            return;
        }
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
            {showMarker && (
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
            )}
            <div className="board-grid">
                {gameState.boardState.map((col, colIndex) => (
                    <div
                        key={colIndex}
                        className="board-col"
                        onClick={() => handleMove(colIndex)}
                        onMouseEnter={() => handleHoverEnter(colIndex)}
                        onMouseLeave={() => handleHoverExit(colIndex)}
                    >
                        {col.map((cell, rowIndex) => {
                            const isLastPlaced =
                                lastPlaced &&
                                lastPlaced.col === colIndex &&
                                lastPlaced.row === rowIndex;

                            return (
                                <div
                                    key={rowIndex}
                                    className={classNames(
                                        "board-cell",
                                        cell.color === CellColor.RED
                                            ? "red-cell"
                                            : cell.color === CellColor.YELLOW && "yellow-cell",
                                        cell.isHovered &&
                                        gameState.currPlayer === Player.RED &&
                                        "hovered-red",
                                        cell.isHovered &&
                                        gameState.currPlayer === Player.YELLOW &&
                                        "hovered-yellow",
                                        isWinningCell(rowIndex, colIndex) && "winning-cell",
                                        isLastPlaced && "drop-animation"
                                    )}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};
