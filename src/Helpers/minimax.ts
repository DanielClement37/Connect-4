import {Cell} from "../Types/GameTypes.ts";
import {Player} from "../Types/Enums.ts";
import {checkForWin, cloneBoard, evaluateBoard, getOpponent, getPossibleMoves, placePiece} from "./GameMethods.ts";

const NEG_INFINITY = Number.NEGATIVE_INFINITY;
const POS_INFINITY = Number.POSITIVE_INFINITY;

/**
 * Minimax with alpha-beta pruning.
 * @param boardState The current board
 * @param depth Depth limit to search
 * @param alpha Current alpha (best score for maximizer)
 * @param beta Current beta (best score for minimizer)
 * @param isMax Is it the maximizing player's turn?
 * @param aiPlayer The AI’s player color (RED/YELLOW)
 * @returns A numeric score for the board state
 */
export function minimax(
    boardState: Cell[][],
    depth: number,
    alpha: number,
    beta: number,
    isMax: boolean,
    aiPlayer: Player
): number {
    // 1. Terminal or depth check
    const result = checkForWin(boardState);
    if (result.winner !== undefined) {
        // If the AI just won, return a large positive. If the opponent won, large negative.
        return result.winner === aiPlayer ? POS_INFINITY : NEG_INFINITY;
    }

    const possibleMoves = getPossibleMoves(boardState);
    if (possibleMoves.length === 0) {
        // Board is full or no moves => draw => 0
        return 0;
    }

    if (depth === 0) {
        // Return the evaluated score of this board for the AI
        return evaluateBoard(boardState, aiPlayer);
    }

    // 2. Recur as Maximizing or Minimizing
    if (isMax) {
        let bestScore = NEG_INFINITY;
        // The maximizer is the AI
        for (const move of possibleMoves) {
            // Clone board, place AI piece
            const clonedBoard = cloneBoard(boardState);
            placePiece(clonedBoard, move.col, aiPlayer);

            const score = minimax(
                clonedBoard,
                depth - 1,
                alpha,
                beta,
                false,
                aiPlayer
            );

            bestScore = Math.max(bestScore, score);
            alpha = Math.max(alpha, bestScore);

            // Alpha-Beta Pruning
            if (beta <= alpha) {
                break;
            }
        }
        return bestScore;
    } else {
        // Minimizing for the opponent
        let bestScore = POS_INFINITY;
        const opponent = getOpponent(aiPlayer);
        for (const move of possibleMoves) {
            const clonedBoard = cloneBoard(boardState);
            placePiece(clonedBoard, move.col, opponent);

            const score = minimax(
                clonedBoard,
                depth - 1,
                alpha,
                beta,
                true,
                aiPlayer
            );

            bestScore = Math.min(bestScore, score);
            beta = Math.min(beta, bestScore);

            // Alpha-Beta Pruning
            if (beta <= alpha) {
                break;
            }
        }
        return bestScore;
    }
}

/**
 * Finds the best column to play using minimax search.
 * @param boardState The current board.
 * @param depth Depth limit for minimax.
 * @param aiPlayer Which player is the AI? (RED or YELLOW)
 * @returns The column index that yields the best minimax score.
 */
export function findBestMove(boardState: Cell[][], depth: number, aiPlayer: Player): number {
    let bestScore = NEG_INFINITY;
    let bestColumn = -1;

    const possibleMoves = getPossibleMoves(boardState);
    if (possibleMoves.length === 0) {
        return bestColumn; // No moves, maybe -1 or 0 as a "pass" or "invalid"
    }

    for (const move of possibleMoves) {
        // 1) Clone & place the AI piece
        const clonedBoard = cloneBoard(boardState);
        placePiece(clonedBoard, move.col, aiPlayer);

        // 2) Score the resulting board with minimax (opponent's turn next => isMax = false)
        const score = minimax(
            clonedBoard,
            depth - 1,
            NEG_INFINITY,
            POS_INFINITY,
            false,
            aiPlayer
        );

        // 3) If better than current best, update
        if (score > bestScore) {
            bestScore = score;
            bestColumn = move.col;
        }
    }

    return bestColumn;
}