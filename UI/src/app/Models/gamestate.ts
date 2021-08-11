import { GameBoard } from "./gameBoard";
import { Player } from "./player";

export interface Gamestate {
    player1: Player,
    player2: Player,
    activePlayer: Player,
    gameOver: boolean,
    winner: Player,
    board: GameBoard,
    turn: number
}