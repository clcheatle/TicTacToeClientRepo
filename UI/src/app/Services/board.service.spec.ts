import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { BoardService } from './board.service';
import { Player } from '../Models/player';
import { GamestateDto } from '../Models/gamestateDto';
import { Gamestate } from '../Models/gamestate';
import { GameBoard } from '../Models/gameBoard';
import { Move } from '../Models/move';

describe('BoardService', () => {
  let service: BoardService;
  let httpTestingController: HttpTestingController;

  let p1: Player = {
    playerId: 1,
    name: 'Jon',
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

  let gsdto: GamestateDto;
  let gamestateTest: Gamestate;

  let newGameState: Gamestate = {
    player1: p1,
    player2: p2,
    activePlayer: p1,
    gameOver: false,
    winner: null,
    board: newGameBoard,
    turn: 0
  };

  let playedGameState: Gamestate = {
    player1: p1,
    player2: p2,
    activePlayer: p2,
    gameOver: false,
    winner: null,
    board: playedGameBoard,
    turn: 5
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        BoardService
      ]
    });

    service = TestBed.inject(BoardService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a newly created gamestate', () => {
    gsdto = {
      player1: p1,
      player2: p2
    };

    service.createGame(gsdto).subscribe(gamestate => {
      expect(gamestate).toBeTruthy('No gamestate returned');
      expect(gamestate.player1).toBe(p1, 'Incorrect player 1 assigned to new game');
      expect(gamestate.player2).toBe(p2, 'Incorrect player 2 assigned to new game');
      expect(gamestate.activePlayer).toBe(p1, 'Incorrect active player assigned to new game');
      expect(gamestate.winner).toBe(null, 'Incorrect winner assigned to new game');
      expect(gamestate.gameOver).toBeFalsy('Game Over not assigned correctly to new game');
      expect(gamestate.board).toBe(newGameBoard, 'Board not assigned to new game correctly');
      expect(gamestate.turn).toBe(0, 'Turn not correctly assigned to new game');
    });

    const req = httpTestingController.expectOne('https://localhost:5001/Board/createGame');
    expect(req.request.method).toEqual("POST");
    req.flush(newGameState);

  });

  it('should return a gamestate that was been reset', () => {

    service.resetGame(playedGameState).subscribe(gamestate => {
      expect(gamestate).toBeTruthy('No gamestate returned');
      expect(gamestate.player1).toBe(p1, 'Incorrect player 1 assigned to reset game');
      expect(gamestate.player2).toBe(p2, 'Incorrect player 2 assigned to reset game');
      expect(gamestate.activePlayer).toBe(p1, 'Incorrect active player assigned to reset game');
      expect(gamestate.winner).toBe(null, 'Incorrect winner assigned to reset game');
      expect(gamestate.gameOver).toBeFalsy('Game Over not assigned correctly to reset game');
      expect(gamestate.board).toBe(newGameBoard, 'Board not assigned to reset game correctly');
      expect(gamestate.turn).toBe(0, 'Turn not correctly assigned to reset game');
    });

    const req = httpTestingController.expectOne('https://localhost:5001/Board/resetBoard');
    expect(req.request.method).toEqual("POST");
    req.flush(newGameState);

  });

  it('should return updated gamestate from player move', () => {

    playedGameState.board.boardMatrix[4] = 'O';
    let m: Move = {
      gameState: playedGameState,
      movePosition: 5
    };

    let updategs = playedGameState;
    updategs.activePlayer = p2;
    updategs.turn = 7;
    updategs.board.boardMatrix[5] = 'X';

    let updatedBoard = updategs.board;

    service.playerMove(m).subscribe(gamestate => {
      expect(gamestate).toBeTruthy('No gamestate returned');
      expect(gamestate.activePlayer).toBe(p2, 'Incorrect active player assigned to return player move');
      expect(gamestate.winner).toBe(null, 'Incorrect winner assigned to return player move');
      expect(gamestate.gameOver).toBeFalsy('Game Over not assigned correctly to return player move');
      expect(gamestate.board).toBe(updatedBoard, 'Board not assigned to return player move');
      expect(gamestate.turn).toBe(7, 'Turn not correctly assigned to return player move');
    });

    const req = httpTestingController.expectOne('https://localhost:5001/Board/playerMove');
    expect(req.request.method).toEqual("POST");
    req.flush(updategs);
  });

  it('it should return updated game state after computer move', () => {

    let updatedgs = playedGameState;
    updatedgs.activePlayer = p1;
    updatedgs.turn = 6;
    updatedgs.board.boardMatrix[4] = 'O';

    let updatedBoard = updatedgs.board;

    service.computerMove(updatedgs).subscribe(gamestate => {
      expect(gamestate).toBeTruthy('No gamestate returned');
      expect(gamestate.activePlayer).toBe(p1, 'Incorrect active player assigned to return player move');
      expect(gamestate.winner).toBe(null, 'Incorrect winner assigned to return player move');
      expect(gamestate.gameOver).toBeFalsy('Game Over not assigned correctly to return player move');
      expect(gamestate.board).toBe(updatedBoard, 'Board not assigned to return player move');
      expect(gamestate.turn).toBe(6, 'Turn not correctly assigned to return player move');
    });

    const req = httpTestingController.expectOne('https://localhost:5001/Board/computerMove');
    expect(req.request.method).toEqual("POST");
    req.flush(updatedgs);


  })

});
