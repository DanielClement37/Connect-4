import { CellColor, Player } from "../Types/Enums";
import { GameState, Cell } from "../Types/GameTypes";

/**
 * Initializes a new GameState with an empty board and default values.
 */
export const InitGameState = (): GameState => {
    return {
        boardState: ResetBoard(),
        currPlayer: Player.RED,
        turnCount: 1,
        playerScores: [0, 0],
        gameWinner: undefined,
    };
};

/**
 * Creates and returns a new 7x6 board filled with empty cells.
 */
export const ResetBoard = (): Cell[][] => {
    const board: Cell[][] = [];
    for (let col = 0; col < 7; col++) {
        const boardCol: Cell[] = [];
        for (let row = 0; row < 6; row++) {
            const cell: Cell = {
                col,
                row,
                color: CellColor.NONE,
                isHovered: false,
            };
            boardCol.push(cell);
        }
        board.push(boardCol);
    }
    return board;
};

/**
 * Determines all possible moves by finding the lowest empty cell in each column.
 * Returns an array of valid Cell positions where a piece can be placed.
 */
export const getPossibleMoves = (boardState: Cell[][]): Cell[] => {
    const moves: Cell[] = [];
    for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
            if (boardState[col][row].color === CellColor.NONE) {
                moves.push({ row, col, color: CellColor.NONE, isHovered: false });
                break;
            }
        }
    }
    return moves;
};

/**
 * Checks the board for a winning connect-four pattern.
 * Returns an object containing the winning Player (if any) and the cells that form the win.
 */
export const checkForWin = (
    boardState: Cell[][]
): { winner: Player | undefined; winningCells: { row: number; col: number }[] | undefined } => {
    const rows = boardState[0].length;
    const cols = boardState.length;

    const isValidCell = (row: number, col: number) =>
        row >= 0 && row < rows && col >= 0 && col < cols;

    const checkDirection = (
        startRow: number,
        startCol: number,
        deltaRow: number,
        deltaCol: number
    ) => {
        let count = 1;
        const color = boardState[startCol][startRow].color;
        if (color === CellColor.NONE) return undefined;

        const winningCells = [{ row: startRow, col: startCol }];

        let r = startRow + deltaRow;
        let c = startCol + deltaCol;
        while (isValidCell(r, c) && boardState[c][r].color === color) {
            winningCells.push({ row: r, col: c });
            count++;
            if (count === 4) return { color, cells: winningCells };
            r += deltaRow;
            c += deltaCol;
        }

        r = startRow - deltaRow;
        c = startCol - deltaCol;
        while (isValidCell(r, c) && boardState[c][r].color === color) {
            winningCells.unshift({ row: r, col: c });
            count++;
            if (count === 4) return { color, cells: winningCells };
            r -= deltaRow;
            c -= deltaCol;
        }

        return undefined;
    };

    for (let col = 0; col < cols; col++) {
        for (let row = 0; row < rows; row++) {
            const directions = [
                { dr: 1, dc: 0 },
                { dr: 0, dc: 1 },
                { dr: 1, dc: 1 },
                { dr: 1, dc: -1 },
            ];

            for (const { dr, dc } of directions) {
                const result = checkDirection(row, col, dr, dc);
                if (result) {
                    return {
                        winner: result.color === CellColor.RED ? Player.RED : Player.YELLOW,
                        winningCells: result.cells,
                    };
                }
            }
        }
    }

    return { winner: undefined, winningCells: undefined };
};

/**
 * Scores a 4-cell window based on how many pieces belong to the AI or the opponent.
 * Higher scores favor the AI; negative scores favor the opponent.
 */
function scoreWindow(redCount: number, yellowCount: number, aiPlayer: Player): number {
    if (redCount > 0 && yellowCount > 0) {
        return 0;
    }

    const myCount = aiPlayer === Player.RED ? redCount : yellowCount;
    const oppCount = aiPlayer === Player.RED ? yellowCount : redCount;

    let score = 0;

    switch (myCount) {
        case 4:
            score += 10000;
            break;
        case 3:
            score += 100;
            break;
        case 2:
            score += 10;
            break;
        case 1:
            score += 1;
            break;
    }

    switch (oppCount) {
        case 4:
            score -= 10000;
            break;
        case 3:
            score -= 100;
            break;
        case 2:
            score -= 10;
            break;
        case 1:
            score -= 1;
            break;
    }

    return score;
}

/*
* Evaluates the entire board state for the AI player, summing scores from all 4-cell windows.
*/
export function evaluateBoard(boardState: Cell[][], aiPlayer: Player): number {
    let totalScore = 0;
    const maxCols = 7;
    const maxRows = 6;

    for (let col = 0; col <= maxCols - 4; col++) {
        for (let row = 0; row < maxRows; row++) {
            const windowCells = [
                boardState[col][row],
                boardState[col + 1][row],
                boardState[col + 2][row],
                boardState[col + 3][row],
            ];
            let redCount = 0;
            let yellowCount = 0;
            for (const cell of windowCells) {
                if (cell.color === CellColor.RED) redCount++;
                if (cell.color === CellColor.YELLOW) yellowCount++;
            }
            totalScore += scoreWindow(redCount, yellowCount, aiPlayer);
        }
    }

    for (let col = 0; col < maxCols; col++) {
        for (let row = 0; row <= maxRows - 4; row++) {
            const windowCells = [
                boardState[col][row],
                boardState[col][row + 1],
                boardState[col][row + 2],
                boardState[col][row + 3],
            ];
            let redCount = 0;
            let yellowCount = 0;
            for (const cell of windowCells) {
                if (cell.color === CellColor.RED) redCount++;
                if (cell.color === CellColor.YELLOW) yellowCount++;
            }
            totalScore += scoreWindow(redCount, yellowCount, aiPlayer);
        }
    }

    for (let col = 0; col <= maxCols - 4; col++) {
        for (let row = 0; row <= maxRows - 4; row++) {
            const windowCells = [
                boardState[col][row],
                boardState[col + 1][row + 1],
                boardState[col + 2][row + 2],
                boardState[col + 3][row + 3],
            ];
            let redCount = 0;
            let yellowCount = 0;
            for (const cell of windowCells) {
                if (cell.color === CellColor.RED) redCount++;
                if (cell.color === CellColor.YELLOW) yellowCount++;
            }
            totalScore += scoreWindow(redCount, yellowCount, aiPlayer);
        }
    }

    for (let col = 0; col <= maxCols - 4; col++) {
        for (let row = 3; row < maxRows; row++) {
            const windowCells = [
                boardState[col][row],
                boardState[col + 1][row - 1],
                boardState[col + 2][row - 2],
                boardState[col + 3][row - 3],
            ];
            let redCount = 0;
            let yellowCount = 0;
            for (const cell of windowCells) {
                if (cell.color === CellColor.RED) redCount++;
                if (cell.color === CellColor.YELLOW) yellowCount++;
            }
            totalScore += scoreWindow(redCount, yellowCount, aiPlayer);
        }
    }

    return totalScore;
}

/**
 * Creates a deep clone of the 2D Cell array.
 */
export function cloneBoard(boardState: Cell[][]): Cell[][] {
    return boardState.map((col) => col.map((cell) => ({ ...cell })));
}

/**
 * Places a piece in the given column for the given player.
 * Returns `true` if successful, or `false` if the column is full.
 */
export function placePiece(boardState: Cell[][], colIndex: number, player: Player): boolean {
    for (let row = 5; row >= 0; row--) {
        if (boardState[colIndex][row].color === CellColor.NONE) {
            boardState[colIndex][row].color = player as unknown as CellColor;
            return true;
        }
    }
    return false;
}

/**
 * Returns the opponent of a given player.
 */
export function getOpponent(player: Player): Player {
    return player === Player.RED ? Player.YELLOW : Player.RED;
}