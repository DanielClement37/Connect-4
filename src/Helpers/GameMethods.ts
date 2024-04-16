import { CellColor, Player } from "../Types/Enums";
import { GameState, Cell } from "../Types/GameTypes";

export const InitGameState = (): GameState => {
	return {
        boardState: ResetBoard(),
        currPlayer: Player.RED,
        turnCount: 1,
        playerScores: [0,0]
    };
};

export const ResetBoard = (): Cell[][] => {
    const board: Cell[][] = [];
    for (let row = 0; row < 6; row++) {
        const rowCells: Cell[] = [];
        for (let col = 0; col < 7; col++) {
            const cell: Cell = {
                row,
                col,
                color: CellColor.NONE
            };
            rowCells.push(cell);
        }
        board.push(rowCells);
    }
    return board;
};
