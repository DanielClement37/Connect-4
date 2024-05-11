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
                color: CellColor.NONE,
                isHovered: false
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
                moves.push({ row, col, color: CellColor.NONE , isHovered: false});
                break; // Stop after finding the first empty cell in this column
            }
        }
    }
    return moves;
};

export const checkForWin = (boardState: Cell[][]): { winner: Player | undefined, winningCells: {row: number, col: number}[] | undefined } => {
    const rows = boardState[0].length;
    const cols = boardState.length;

    // Helper to check within board limits
    const isValidCell = (row: number, col: number) => row >= 0 && row < rows && col >= 0 && col < cols;

    // Check all directions from a given starting cell
    const checkDirection = (startRow: number, startCol: number, deltaRow: number, deltaCol: number) => {
        let count = 1;
        const color = boardState[startCol][startRow].color;
        if (color === CellColor.NONE) return undefined;

        const winningCells = [{ row: startRow, col: startCol }];

        // Check in the positive direction
        let r = startRow + deltaRow;
        let c = startCol + deltaCol;
        while (isValidCell(r, c) && boardState[c][r].color === color) {
            winningCells.push({ row: r, col: c });
            count++;
            if (count === 4) return { color, cells: winningCells };
            r += deltaRow;
            c += deltaCol;
        }

        // Check in the negative direction
        r = startRow - deltaRow;
        c = startCol - deltaCol;
        while (isValidCell(r, c) && boardState[c][r].color === color) {
            winningCells.unshift({ row: r, col: c }); // Prepend to maintain order
            count++;
            if (count === 4) return { color, cells: winningCells };
            r -= deltaRow;
            c -= deltaCol;
        }

        return undefined;
    };

    // Check all cells for possible winning combinations
    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            // Check vertical, horizontal, and both diagonals
            const directions = [
                { dr: 1, dc: 0 },  // Vertical
                { dr: 0, dc: 1 },  // Horizontal
                { dr: 1, dc: 1 },  // Diagonal ascending
                { dr: 1, dc: -1 }  // Diagonal descending
            ];

            for (const { dr, dc } of directions) {
                const result = checkDirection(row, col, dr, dc);
                if (result) {
                    return {
                        winner: result.color === CellColor.RED ? Player.RED : Player.YELLOW,
                        winningCells: result.cells
                    };
                }
            }
        }
    }

    return { winner: undefined, winningCells: undefined };
};
