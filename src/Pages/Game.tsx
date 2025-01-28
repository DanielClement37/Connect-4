import GameLogo from "../assets/images/logo.svg";
import {PlayerInfo} from "../Components/PlayerInfo";
import {GameBoard} from "../Components/GameBoard";
import {GameStatus} from "../Components/GameStatus";
import "../Styles/gameStyles/gamePage.css";
import {checkForWin, getPossibleMoves, ResetBoard} from "../Helpers/GameMethods";
import {useContext, useEffect, useState} from "react";
import {AppContext} from "../GlobalState/Context/AppContext";
import {CellColor, Player, RunningState} from "../Types/Enums";
import {PauseModal} from "../Components/PauseModal";
import {
    GAME_OVER,
    GET_MOVES,
    MAKE_MOVE,
    PAUSE,
    RESUME,
    SET_MATCH_STATE,
    SET_WINNING_CELLS
} from "../GlobalState/Actions/actiontypes";
import {classNames} from "../Utils/ClassNames";
import {useMediaQuery} from "react-responsive";

export const Game = () => {
    const {state, dispatch} = useContext(AppContext);
    const {gameState, runningState, moveList} = state;
    const [counter, setCounter] = useState(30);
    const [lastPlaced, setLastPlaced] = useState<{ col: number; row: number } | null>(null);
    const isDesktop = useMediaQuery({
        query: '(min-width: 1025px)'
    })

    useEffect(() => {
        //get legal moves then convert to move objects
        const moves = getPossibleMoves(gameState.boardState);
        dispatch({
            type: GET_MOVES,
            payload: moves,
        });
    }, [dispatch, gameState.boardState]);

    useEffect(() => {
        if (runningState === RunningState.RUNNING) {
            if (counter > 0) {
                const timerId = setTimeout(() => {
                    setCounter(counter - 1);
                }, 1000);
                return () => clearTimeout(timerId);  // Cleanup function to clear the timer
            } else {
                //get random move
                const randomMove = moveList[Math.floor(Math.random() * moveList.length)];
                //make random move
                handleMove(randomMove.col);
            }
        }
    }, [counter, runningState]);

    const handleMove = (colIndex: number) => {
        if (runningState !== RunningState.RUNNING) return;

        // Find if the move is within the possible moves
        const validMove = moveList.find((move) => move.col === colIndex && move.color === CellColor.NONE);

        if (validMove) {
            const newBoardState = gameState.boardState.map((col) => col.slice()); // Clone the board state

            if (newBoardState[colIndex][validMove.row].color === CellColor.NONE) {
                newBoardState[colIndex][validMove.row].color = gameState.currPlayer as unknown as CellColor; // Set the player's color
                newBoardState[colIndex][validMove.row].isHovered = false;

                setLastPlaced({col: colIndex, row: validMove.row});

                const result = checkForWin(newBoardState);
                if (result.winner) {
                    const newPlayerScores = gameState.playerScores;
                    newPlayerScores[gameState.currPlayer - 1]++;

                    dispatch({
                        type: GAME_OVER,
                        payload: {
                            boardState: newBoardState,
                            currPlayer: gameState.currPlayer,
                            turnCount: gameState.turnCount,
                            playerScores: newPlayerScores,
                            gameWinner: result.winner,
                        },
                    });

                    dispatch({
                        type: SET_WINNING_CELLS,
                        payload: result.winningCells,
                    });

                    dispatch({
                        type: PAUSE,
                        payload: RunningState.GAME_OVER,
                    });

                    return;
                }
            }

            // Update game state after the move
            const newTurnCount = gameState.turnCount + 1;
            const newCurrPlayer = gameState.currPlayer === Player.RED ? Player.YELLOW : Player.RED;

            dispatch({
                type: MAKE_MOVE,
                payload: {
                    boardState: newBoardState,
                    currPlayer: newCurrPlayer,
                    turnCount: newTurnCount,
                    playerScores: gameState.playerScores,
                    gameWinner: gameState.gameWinner,
                },
            });
            setCounter(30);
        }
    };

    const handleRestart = () => {

        setCounter(30);
        dispatch({
            type: SET_MATCH_STATE,
            payload: {
                boardState: ResetBoard(),
                currPlayer: Player.RED,
                turnCount: 1,
                playerScores: gameState.playerScores,
                gameWinner: undefined,
            },
        });

        dispatch({
            type: SET_WINNING_CELLS,
            payload: [],
        });

        dispatch({type: RESUME, payload: RunningState.RUNNING});
    };

    const handlePause = () => {
        dispatch({type: PAUSE, payload: RunningState.PAUSED});
    };

    const handleResume = () => {
        dispatch({type: RESUME, payload: RunningState.RUNNING});
    };

    return (
        <div className="game-page">
            {state.runningState === RunningState.PAUSED && (
                <PauseModal resume={handleResume} restart={handleRestart}/>
            )}

            <div className="game-header">
                <button onClick={handlePause} className="header-btn">
                    MENU
                </button>
                <img src={GameLogo} alt="game logo" className="logo"/>
                <button onClick={handleRestart} className="header-btn">
                    RESTART
                </button>
            </div>


            {isDesktop ? (
                    <div className="game-body">
                        <div className="red-info">
                            <PlayerInfo playerColor={Player.RED}/>
                        </div>
                        <GameBoard handleMove={handleMove} lastPlaced={lastPlaced}/>
                        <div className="yellow-info">
                            <PlayerInfo playerColor={Player.YELLOW}/>
                        </div>
                    </div>
                ) :
                (<div className="game-body">
                    <div className="info-row">
                        <div className="red-info">
                            <PlayerInfo playerColor={Player.RED}/>
                        </div>
                        <div className="yellow-info">
                            <PlayerInfo playerColor={Player.YELLOW}/>
                        </div>
                    </div>
                    <GameBoard handleMove={handleMove} lastPlaced={lastPlaced}/>
                </div>)
            }
            <GameStatus handleRestart={handleRestart} counter={counter}/>
            <div
                className={classNames(
                    "footer",
                    gameState.gameWinner === Player.RED
                        ? "red"
                        : gameState.gameWinner === Player.YELLOW && "yellow"
                )}
            />
        </div>
    );
};
