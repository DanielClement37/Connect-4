import { RunningState } from "../../Types/Enums";
import { Cell, GameState } from "../../Types/GameTypes";

export const SET_MATCH_STATE = "SET_MATCH_STATE";
export const PAUSE = "PAUSE"
export const RESUME = "RESUME"
export const MAKE_MOVE = "MAKE_MOVE";
export const GET_MOVES = "GET_MOVES";

export interface Action {
	type: "SET_MATCH_STATE" | "MAKE_MOVE" | "PAUSE"| "RESUME" | "GET_MOVES";
	payload: GameState | RunningState | Cell[]
}
