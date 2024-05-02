import { InitGameState } from "../../Helpers/GameMethods.ts";
import { RunningState } from "../../Types/Enums.ts";
import { GameState } from "../../Types/GameTypes";
import { SET_MATCH_STATE, MAKE_MOVE, PAUSE, RESUME } from "../Actions/actiontypes.ts"

export interface AppState {
	gameState: GameState;
	runningState: RunningState;
}

export const initialState: AppState = {
	gameState: InitGameState(),
	runningState: RunningState.PREGAME
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const appReducer = (state: AppState, action: any) => {
	switch (action.type) {
		case SET_MATCH_STATE:
			return { ...state, gameState: action.payload };
		case MAKE_MOVE:
			return { ...state,  gameState: action.payload};
		case PAUSE:
			return { ...state, runningState: action.payload};
		case RESUME:
			return { ...state, runningState: action.payload};
		default:
			return state;
	}
};
