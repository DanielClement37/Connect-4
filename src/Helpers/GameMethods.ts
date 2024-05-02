import { CellColor, Player, RunningState } from "../Types/Enums";
import { GameState, Cell } from "../Types/GameTypes";

export const InitGameState = (): GameState => {
	return {
        boardState: ResetBoard(),
        currPlayer: Player.RED,
        turnCount: 1,
        playerScores: [0,0],
        runningState: RunningState.PREGAME
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
