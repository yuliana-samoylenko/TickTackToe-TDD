import {expect} from 'chai';
import sinon from 'sinon';
import Game from '../src/Game';

const userName = 'user';
const computerName = 'computer';
const userMoveSymbol = 'x';
const initialGameBoard = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
]

let game;

beforeEach(() => { game = new Game() });

describe('Game', () => {
  it('Should return empty game board', () => {
    const board = game.getState();

    expect(board).to.deep.equal(initialGameBoard);
  })
})

it('Writes user\'s symbol in cell with given coordinates', () => {
  const x = 1, y = 1;

  game.acceptUserMove(x, y);
  const board = game.getState();

  expect(board[x][y]).to.equal(userMoveSymbol);
})

it('Throws an exception if user moves in taken cell', () => {
  const x = 2, y = 2;

  game.acceptUserMove(x, y);
  const func = game.acceptUserMove.bind(game, x, y);

  expect(func).to.throw('cell is already taken');
})

it('Game saves user\'s move in history', () => {
  const x = 1, y = 1;

  game.acceptUserMove(x, y);
  const history = game.getMoveHistory();

  expect(history).to.deep.equal([{turn: userName, x, y}]);
})

it('Game saves computers\'s move in history', () => {
  const stub = sinon.stub(Math, 'random').returns(0.5);

  game.createComputerMove();
  const history = game.getMoveHistory();

  expect(history).to.deep.equal([{turn: computerName, x: 1, y: 1}]);
  stub.restore();
})

it('Game saves 1 user\'s move and 1 computer\'s move in history', () => {
  const x = 1, y = 1;

  game.acceptUserMove(x, y);
  game.createComputerMove();
  const history = game.getMoveHistory();

  expect(history.length).to.equal(2);
  expect(history[0].turn).to.equal(userName);
  expect(history[1].turn).to.equal(computerName);
})

it('Computer moves in randomly chosen cell', () => {
  const userMoveSymbol = 'x';
  const computerMoveSymbol = 'o';

  const stub = sinon.stub(Math, 'random').returns(0.5);

  game.createComputerMove();
  const board = game.getState();

  expect(board[1][1]).to.equal(computerMoveSymbol);
  stub.restore();
})

it('Computer moves in cell that is not taken', () => {
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (i !== 2 || j !== 2) game.acceptUserMove(i, j);
    }
  }

  game.createComputerMove();
  const board = game.getState();

  const userCount = board.reduce((result, row) => {
    return row.reduce((count, el) => {
      return el === userMoveSymbol ? ++count : count;
    }, result)
  }, 0)

  const computerCount = board.reduce((result, row) => {
    return row.reduce((count, el) => {
      return el === computerMoveSymbol ? ++count : count;
    }, result)
  }, 0)

  expect(userCount).to.equal(8);
  expect(computerCount).to.equal(1);
  expect(board[2][2]).to.equal(computerMoveSymbol);
})
