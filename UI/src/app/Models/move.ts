import { Gamestate } from "./gamestate";

export interface Move {
    gameState: Gamestate,
    movePosition: number
}