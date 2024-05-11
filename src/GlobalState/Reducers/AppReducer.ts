import { InitGameState } from "../../Helpers/GameMethods.ts";
import { RunningState } from "../../Types/Enums.ts";
import { Cell, GameState } from "../../Types/GameTypes";
import { SET_MATCH_STATE, MAKE_MOVE, PAUSE, RESUME, GET_MOVES, SET_HOVERED_COLUMN, GAME_OVER, SET_WINNING_CELLS } from "../Actions/actiontypes.ts"

export interface AppState {
	gameState: GameState;
	runningState: RunningState;
	moveList: Cell[],
	winningCells: { row: number, col: number }[]; 
}

export const initialState: AppState = {
	gameState: InitGameState(),
	runningState: RunningState.RUNNING,
	moveList: [],
	winningCells: []
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appReducer = (state: AppState, action: any) => {
	switch (action.type) {
		case SET_MATCH_STATE:
			return { ...state, gameState: action.payload };
		case MAKE_MOVE:
			return { ...state,  gameState: action.payload};
		case GET_MOVES:
			return {...state, moveList: action.payload}
		case PAUSE:
			return { ...state, runningState: action.payload};
		case RESUME:
			return { ...state, runningState: action.payload};
		case SET_HOVERED_COLUMN:
			return { ...state,  gameState: action.payload};
		case GAME_OVER:
			return { ...state, gameState: action.payload, winningCells: action.winningCells };
		case SET_WINNING_CELLS:
			return { ...state,  winningCells: action.payload};
		default:
			return state;
	}
};
