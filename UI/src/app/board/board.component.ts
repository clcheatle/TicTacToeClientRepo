import { Component, OnInit } from '@angular/core';
import { Player } from '../Models/player';
import { GamestateDto } from '../Models/gamestateDto';
import { BoardService } from '../Services/board.service';
import { Gamestate } from '../Models/gamestate';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  squares: any[];
  activePlayer: Player;
  winner: Player;
  gameState: Gamestate;
  player1: Player;
  player2: Player;
  gsdto: GamestateDto;
  

  constructor(private boardService: BoardService) { }

  ngOnInit(): void {

    this.createPlayers("X");
    this.createNewGame();
    
  }

  createPlayers(sym: string)
  {
    this.player1 = {
      playerId: 1,
      name: "Player 1",
      symbol: sym
    };

    this.player2 = {
      playerId: 2,
      name: "Computer",
      symbol: "O"
    };
  }

  createNewGame()
  {
    this.gsdto = {
      player1: this.player1,
      player2: this.player2
    };

    this.boardService.createGame(this.gsdto).subscribe(gs => {
      this.gameState = gs;
      this.activePlayer = gs.activePlayer;
      this.squares = gs.board.boardMatrix;
      console.log(this.gameState);
      console.log(this.activePlayer);
      console.log(this.squares);
    });
  }

  //refactor
  playerMove(position: number)
  {
    console.log(position);
    
    if(this.squares[position] != "X" && this.squares[position] != "O")
    {
      this.squares.splice(position, 1, this.activePlayer.symbol);
    }
    console.log(this.squares);
  }

}
