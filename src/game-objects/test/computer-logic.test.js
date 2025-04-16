import {ChessGameState} from "../computer-logic";
import {EventBus} from "../../game/EventBus.js";
import {BoardStateLite} from "../board-mockups";
import {PieceCoordinates} from "../piece-coordinates";
import {COMPUTER, PLAYER, ROOK, KING, QUEEN, PAWN} from "../constants";

test("event should be sent and received in intended format", () => {
	const theGameState = new ChessGameState(null); // doesn't need data, just needs functions
	EventBus.once("ComputerMove", (detail) => {
		expect(detail.length).toBe(3);
		expect(detail[0]).toEqual([1, 1]);
		expect(detail[1]).toEqual([1, 3]);
		expect(detail[2]).toEqual(false);
	});
	theGameState.sendMove([1, 1], [1, 3]);
});

test("random numbers should be int and in specified range", () => {
	const theGameState = new ChessGameState(null); // doesn't need data, just needs functions

	for (let i = 0; i < 100; i++) {
		// lots of random numbers increases chance of going
		// out of expected range if possible
		const value = theGameState.getRandomInt(0, 10);
		expect(Number.isInteger(value)).toBe(true);
		expect(value).toBeGreaterThan(-1);
		expect(value).toBeLessThan(11);
	}
});

test("makes obviously correct move", () => {
	const coordinates = new PieceCoordinates();
	const boardState = new BoardStateLite(coordinates);
	boardState.addPiece(0, 0, ROOK, COMPUTER); // in position to take queen and check king
	boardState.addPiece(1, 1, PAWN, COMPUTER); // worse move, threatens nothing
	boardState.addPiece(6, 7, PAWN, PLAYER); //
	boardState.addPiece(0, 7, QUEEN, PLAYER); // threatened by computer rook
	boardState.addPiece(7, 7, KING, PLAYER);
	const theGameState = new ChessGameState(boardState);
	EventBus.once("ComputerMove", (detail) => {
		expect(detail.length).toBe(3);
		expect(detail[0]).toEqual([0, 0]);
		expect(detail[1]).toEqual([0, 7]);
		expect(detail[2]).toEqual(true);
	});
	theGameState.getBestMove();
});
