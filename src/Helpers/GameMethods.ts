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

function scoreWindow(
    redCount: number,
    yellowCount: number,
    aiPlayer: Player
): number {
    // If both players occupy the window, no one can connect 4 here
    if (redCount > 0 && yellowCount > 0) {
        return 0;
    }

    // We’ll use a simple weighting
    // - 4 in a row = ±10000
    // - 3 in a row = ±100
    // - 2 in a row = ±10
    // - 1 in a row = ±1

    // Decide which color is “mine” vs “opponent”
    const myCount = aiPlayer === Player.RED ? redCount : yellowCount;
    const oppCount = aiPlayer === Player.RED ? yellowCount : redCount;

    let score = 0;

    // If I occupy x cells, good for me:
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

    // If the opponent occupies x cells, that’s bad for me:
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

// 2) The main evaluation function
export function evaluateBoard(
    boardState: Cell[][],
    aiPlayer: Player
): number {
    let totalScore = 0;
    const maxCols = 7; // typical Connect4 width
    const maxRows = 6; // typical Connect4 height

    // --- HORIZONTAL windows ---
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

    // --- VERTICAL windows ---
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

    // --- DIAGONAL (down-right, ↘) ---
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

    // --- DIAGONAL (up-right, ↗) ---
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

/** Create a deep clone of the 2D Cell array. */
export function cloneBoard(boardState: Cell[][]): Cell[][] {
    return boardState.map((col) =>
        col.map((cell) => ({ ...cell }))
    );
}

/**
 * Place a piece in the given column for the given player.
 * Returns `true` if successful, or `false` if column is full.
 */
export function placePiece(boardState: Cell[][], colIndex: number, player: Player): boolean {
    // Start from the bottom row of that column
    for (let row = 5; row >= 0; row--) {
        if (boardState[colIndex][row].color === CellColor.NONE) {
            boardState[colIndex][row].color = player as unknown as CellColor;
            return true;
        }
    }
    return false; // Column is full
}

/**
 * Returns the opponent of a given player.
 */
export function getOpponent(player: Player): Player {
    return player === Player.RED ? Player.YELLOW : Player.RED;
}

