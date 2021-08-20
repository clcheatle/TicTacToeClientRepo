import { Component, OnInit, ViewChild } from '@angular/core';
import { Player } from '../Models/player';
import { GamestateDto } from '../Models/gamestateDto';
import { BoardService } from '../Services/board.service';
import { Gamestate } from '../Models/gamestate';
import { Move } from '../Models/move';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  @ViewChild ('frame') public modal: any;
  squares: any[];
  activePlayer: Player;
  winner: Player;
  gameState: Gamestate;
  player1: Player;
  player2: Player;
  gsdto: GamestateDto;
  gameResults: string;
  disableGame: string = 'visible';
  resetState: boolean = true;
  

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
    this.disableGame = 'visible';
    this.resetState = true;
    this.gsdto = {
      player1: this.player1,
      player2: this.player2
    };

    this.boardService.createGame(this.gsdto).subscribe(gs => {
      this.gameState = gs;
      this.activePlayer = gs.activePlayer;
      this.squares = gs.board.boardMatrix;
    });

    if(this.modal != undefined)
    {
      this.modal.hide();
    }
    
  }

  playerMove(position: number)
  {    
    if(this.squares[position] != "X" && this.squares[position] != "O")
    {
      let m: Move = {
        gameState: this.gameState,
        movePosition: position
      };

      this.boardService.playerMove(m).subscribe(gs => {
        this.gameState = gs;
        this.squares = gs.board.boardMatrix;
        this.checkWinner();
        this.computerMove();
      });
    }
  }

  computerMove()
  {
    this.boardService.computerMove(this.gameState).subscribe(gs => {
      this.gameState = gs;
      this.squares = gs.board.boardMatrix;

      this.checkWinner();
    });
  }

  resetGame()
  {
    this.boardService.resetGame(this.gameState).subscribe(gs => {
      this.gameState = gs;
      this.squares = this.gameState.board.boardMatrix;
      this.disableGame = 'visible';
    });
  }

  checkWinner()
  {
    if(this.gameState.gameOver)
    {
      this.disableGame = 'none';
      this.resetState = false;
      if(this.gameState.winner == null)
      {
        this.gameResults = "Draw! Would you like to play again?";
      }
      else if(this.gameState.winner.playerId == 1)
      {
        this.gameResults = "You won! Would you like to play again?";
      }
      else
      {
        this.gameResults = this.gameState.winner.name + " won! Would you like to play again?";
      }
  
      this.modal.show();
    }
  }

}
