import GameLogo from "../assets/images/logo.svg";
import {PlayerInfo} from "../Components/PlayerInfo";
import {GameBoard} from "../Components/GameBoard";
import {GameStatus} from "../Components/GameStatus";
import "../Styles/gameStyles/gamePage.css";
import {checkForWin, cloneBoard, getPossibleMoves, ResetBoard} from "../Helpers/GameMethods";
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
import PlayerOne from "../assets/images/player-one.svg";
import CPU from "../assets/images/cpu.svg"
import {findBestMove} from "../Helpers/minimax.ts";

export const GameVsCPU = () => {
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

        useEffect(() => {
            if (
                gameState.currPlayer === Player.YELLOW &&
                runningState === RunningState.RUNNING
            ) {
                const cpuTimer = setTimeout(() => {
                    handleCpuMove();
                }, 800);
                return () => clearTimeout(cpuTimer);
            }
        }, [gameState.currPlayer, runningState]);

        const handleCpuMove = () => {
            const legalMoves = getPossibleMoves(gameState.boardState);
            if (!legalMoves.length) {
                return;
            }

            const aiPlayer = Player.YELLOW;

            const depth = 5;

            const bestCol = findBestMove(gameState.boardState, depth, aiPlayer);

            if (bestCol >= 0) {
                handleMove(bestCol);
            } else {
                return;
            }
        }

        const handleMove = (colIndex: number) => {
            if (runningState !== RunningState.RUNNING) return;

            // Find if the move is within the possible moves
            const possibleMoves = getPossibleMoves(gameState.boardState);
            const validMove = possibleMoves.find(
                 (move) => move.col === colIndex
            );

            if (!validMove) return;

            // Deep clone the board so we don't share references
            const newBoardState = cloneBoard(gameState.boardState);

            // Place the new piece
            if (newBoardState[colIndex][validMove.row].color === CellColor.NONE) {
                newBoardState[colIndex][validMove.row].color = gameState.currPlayer as unknown as CellColor;
                newBoardState[colIndex][validMove.row].isHovered = false;

                setLastPlaced({col: colIndex, row: validMove.row});

                const result = checkForWin(newBoardState);
                if (result.winner) {
                    // handle a win
                    const newPlayerScores = [...gameState.playerScores];
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

            // Update the turn
            const newTurnCount = gameState.turnCount + 1;
            const newCurrPlayer =
                gameState.currPlayer === Player.RED ? Player.YELLOW : Player.RED;

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

        const handleHumanClick = (colIndex: number) => {
            if (gameState.currPlayer !== Player.RED) return;
            handleMove(colIndex);
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
                                <PlayerInfo playerText={"YOU"} playerImg={PlayerOne}
                                            playerScore={gameState.playerScores[Player.RED - 1]}
                                            className={"left-player-img"}/>
                            </div>
                            <GameBoard handleMove={handleHumanClick} lastPlaced={lastPlaced}/>
                            <div className="yellow-info">
                                <PlayerInfo playerText={"CPU"} playerImg={CPU}
                                            playerScore={gameState.playerScores[Player.YELLOW - 1]}
                                            className={"right-player-img"}/>
                            </div>
                        </div>
                    ) :
                    (<div className="game-body">
                        <div className="info-row">
                            <div className="red-info">
                                <PlayerInfo playerText={"YOU"} playerImg={PlayerOne}
                                            playerScore={gameState.playerScores[Player.RED - 1]}
                                            className={"left-player-img"}/>
                            </div>
                            <div className="yellow-info">
                                <PlayerInfo playerText={"CPU"} playerImg={CPU}
                                            playerScore={gameState.playerScores[Player.YELLOW - 1]}
                                            className={"right-player-img"}/>
                            </div>
                        </div>
                        <GameBoard handleMove={handleHumanClick} lastPlaced={lastPlaced}/>
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
    }
;
