import { RunningState } from "../../Types/Enums";
import { GameState } from "../../Types/GameTypes";

export const SET_MATCH_STATE = "SET_MATCH_STATE";
export const PAUSE = "PAUSE"
export const RESUME = "RESUME"
export const MAKE_MOVE = "MAKE_MOVE";

export interface Action {
	type: "SET_MATCH_STATE" | "MAKE_MOVE" | "PAUSE"| "RESUME";
	payload: GameState | RunningState
}
