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
    const result = checkForWin(boardState);
    if (result.winner !== undefined) {
        return result.winner === aiPlayer ? POS_INFINITY : NEG_INFINITY;
    }

    const possibleMoves = getPossibleMoves(boardState);
    if (possibleMoves.length === 0) {
        return 0;
    }

    if (depth === 0) {
        return evaluateBoard(boardState, aiPlayer);
    }

    if (isMax) {
        let bestScore = NEG_INFINITY;
        for (const move of possibleMoves) {
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

            if (beta <= alpha) {
                break;
            }
        }
        return bestScore;
    } else {
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
        return bestColumn;
    }

    for (const move of possibleMoves) {
        const clonedBoard = cloneBoard(boardState);
        placePiece(clonedBoard, move.col, aiPlayer);

        const score = minimax(
            clonedBoard,
            depth - 1,
            NEG_INFINITY,
            POS_INFINITY,
            false,
            aiPlayer
        );

        if (score > bestScore) {
            bestScore = score;
            bestColumn = move.col;
        }
    }

    return bestColumn;
}