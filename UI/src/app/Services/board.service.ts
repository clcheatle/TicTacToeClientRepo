import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GamestateDto } from '../Models/gamestateDto';
import { Gamestate } from '../Models/gamestate';
import { Move } from '../Models/move';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  boardBaseUrl = "https://localhost:5001/Board";

  constructor(private http: HttpClient) { }

  //Create a new gamestate
  createGame(gsDto: GamestateDto) {
    return this.http.post<Gamestate>(this.boardBaseUrl + "/createGame", gsDto);
  }

  //reset gamestate
  resetGame(gs: Gamestate) {
    return this.http.post<Gamestate>(this.boardBaseUrl + "/resetBoard", gs);
  }

  //player move
  playerMove(m: Move) {
    return this.http.post<Gamestate>(this.boardBaseUrl + "/playerMove", m);
  }

  //computer move
  computerMove(gs: Gamestate) {
    return this.http.post<Gamestate>(this.boardBaseUrl + "/computerMove", gs);
  }
}
