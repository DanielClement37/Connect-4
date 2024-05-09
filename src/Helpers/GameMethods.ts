import { CellColor, Player } from "../Types/Enums";
import { GameState, Cell } from "../Types/GameTypes";

export const InitGameState = (): GameState => {
	return {
        boardState: ResetBoard(),
        currPlayer: Player.RED,
        turnCount: 1,
        playerScores: [0,0],
        gameWinner: undefined
    };
};

export const ResetBoard = (): Cell[][] => {
    const board: Cell[][] = [];
    for (let col = 0; col < 7; col++) {
        const boardCol: Cell[] = [];
        for (let row = 0; row < 6; row++) {
            const cell: Cell = {
                col,
                row,
                color: CellColor.NONE
            };
            boardCol.push(cell);
        }
        board.push(boardCol);
    }
    return board;
};

export const getPossibleMoves = (boardState: Cell[][]): Cell[] => {
    const moves: Cell[] = [];
    for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
            if (boardState[col][row].color === CellColor.NONE) {
                moves.push({ row, col, color: CellColor.NONE });
                break; // Stop after finding the first empty cell in this column
            }
        }
    }
    return moves;
};