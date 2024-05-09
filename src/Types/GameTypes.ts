import { CellColor, Player} from "./Enums";

export interface Cell{
    row: number,
    col: number,
    color: CellColor,
    isHovered: boolean
}

export interface GameState{
    boardState: Cell[][]
    currPlayer: Player
    turnCount: number
    playerScores: number[]
    gameWinner?: Player
}