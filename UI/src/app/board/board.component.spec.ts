import { HttpClientModule } from '@angular/common/http';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { of } from 'rxjs';
import { GameBoard } from '../Models/gameBoard';
import { Gamestate } from '../Models/gamestate';
import { GamestateDto } from '../Models/gamestateDto';
import { Player } from '../Models/player';
import { BoardService } from '../Services/board.service';
import { SquareComponent } from '../square/square.component';

import { BoardComponent } from './board.component';

const ButtonClickEvents = {
  left: { button: 0 },
  right: { button: 2 }
};

function click(el: DebugElement | HTMLElement,
                  eventObj: any = ButtonClickEvents.left): void {
  if (el instanceof HTMLElement) {
    el.click();
  } else {
    el.triggerEventHandler('click', eventObj);
  }
};

describe('BoardComponent', () => {
  let component: BoardComponent;
  let fixture: ComponentFixture<BoardComponent>;
  let boardService: BoardService;
  let el: DebugElement;
  
  let p1: Player = {
    playerId: 1,
    name: 'Player 1',
    symbol: 'X'
  };

  let p2: Player = {
    playerId: 2,
    name: 'Computer',
    symbol: 'O'
  };

  let newGameBoard: GameBoard = {
    gameBoardId: 0,
    boardMatrix: ['0','1','2','3','4','5','6','7', '8']
  };

  let playedGameBoard: GameBoard = {
    gameBoardId: 0,
    boardMatrix: ['X','O','X',
                  'O','4','5',
                  'X','7', '8']
  };

  let newGameState: Gamestate = {
    player1: p1,
    player2: p2,
    activePlayer: p1,
    gameOver: false,
    winner: null,
    board: newGameBoard,
    turn: 0
  };

  
  beforeEach(async () => {
    
    await TestBed.configureTestingModule({
      declarations: [ BoardComponent, SquareComponent ],
      imports: [MDBBootstrapModule.forRoot(),
                HttpClientModule],
      providers: [
        BoardService
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    boardService = TestBed.inject(BoardService);
    boardService.createGame = jasmine.createSpy().and.returnValue(of(newGameState));

    fixture = TestBed.createComponent(BoardComponent);
    component = fixture.componentInstance;
    el = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('createGame should create and set new game state', () => {
    expect(boardService.createGame).toHaveBeenCalled();
    expect(component.gameState).toEqual(newGameState);
    expect(component.activePlayer).toBe(p1);
    expect(component.squares).toBe(newGameBoard.boardMatrix);
  });

  it('click on a square should call playerMove', () => {

    newGameBoard.boardMatrix[1] = 'X';

    let updatedGameState: Gamestate = {
      player1: p1,
      player2: p2,
      activePlayer: p2,
      winner: null,
      gameOver: false,
      board: newGameBoard,
      turn: 1
    };

    boardService.playerMove = jasmine.createSpy().and.returnValue(of(updatedGameState));

    let tileSquare = el.nativeElement.querySelector('#square');
    tileSquare.click();

    fixture.detectChanges();

    expect(boardService.playerMove).toHaveBeenCalled();
    expect(component.gameState).toEqual(updatedGameState);
    expect(component.squares).toEqual(newGameBoard.boardMatrix);

  });

  it('click on a square that is occupied should not call playerMove', () => {
    component.squares = ['X', 'O', 'X', 'O', 'X', '5', '6', '7', '8'];
    let tileSquare = el.nativeElement.querySelector('#square');
    tileSquare.click();

    fixture.detectChanges();
  });

  it('clicking reset button should reset game', () => {
    boardService.resetGame = jasmine.createSpy().and.returnValue(of(newGameState));

    let button = el.nativeElement.querySelector('.reset');
    button.click();
    //need to refactor
    component.resetGame();
    fixture.detectChanges();

    expect(boardService.resetGame).toHaveBeenCalled();
    expect(component.gameState).toEqual(newGameState);
    expect(component.squares).toEqual(newGameBoard.boardMatrix);
    expect(component.disableGame).toEqual('visible');
  });

  
  it('check winner should show modal if game is over and winner is the computer', () => {
    component.gameState.winner = p2;
    component.gameState.gameOver = true;

    component.checkWinner();
    expect(component.disableGame).toEqual('none');
    expect(component.resetState).toBeFalse();
    expect(component.gameResults).toEqual('Computer won! Would you like to play again?');

  });

  it('check winner should show modal if game is over and winner is the player', () => {
    component.gameState.winner = p1;
    component.gameState.gameOver = true;

    component.checkWinner();
    expect(component.disableGame).toEqual('none');
    expect(component.resetState).toBeFalse();
    expect(component.gameResults).toEqual('You won! Would you like to play again?');

  });

  it('check winner should show modal if game is over and there was a draw', () => {
    component.gameState.winner = null;
    component.gameState.gameOver = true;

    component.checkWinner();
    expect(component.disableGame).toEqual('none');
    expect(component.resetState).toBeFalse();
    expect(component.gameResults).toEqual('Draw! Would you like to play again?');

  });

  it('computer move should call the board service computerMove function', () => {
    playedGameBoard.boardMatrix[4] = 'O';
    let updatedGameState: Gamestate = {
      player1: p1,
      player2: p2,
      activePlayer: p1,
      winner: null,
      gameOver: false,
      board: playedGameBoard,
      turn: 6
    };

    boardService.computerMove = jasmine.createSpy().and.returnValue(of(updatedGameState));
    component.computerMove();

    expect(boardService.computerMove).toHaveBeenCalled();
    expect(component.gameState).toEqual(updatedGameState);
    expect(component.squares).toEqual(playedGameBoard.boardMatrix);
  });


});
