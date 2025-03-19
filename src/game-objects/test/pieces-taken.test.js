import "phaser";
import {PAWN, ROOK, KNIGHT, BISHOP, QUEEN} from "../constants";
import {PLAYER, COMPUTER} from "../constants";
jest.mock("../chess-piece");
jest.mock("../pieces-taken");

test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(PAWN, PLAYER);
	expect(result).toEqual(9);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(PAWN, COMPUTER);
	expect(result).toEqual(4);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(ROOK, PLAYER);
	expect(result).toEqual(3);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(ROOK, COMPUTER);
	expect(result).toEqual(13);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(KNIGHT, PLAYER);
	expect(result).toEqual(6);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(KNIGHT, COMPUTER);
	expect(result).toEqual(5);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(BISHOP, PLAYER);
	expect(result).toEqual(10);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(BISHOP, COMPUTER);
	expect(result).toEqual(2);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(QUEEN, PLAYER);
	expect(result).toEqual(7);
});
test("should return the correct piece count for this piece's rank and alignment", () => {
	const result = testPieceCount(QUEEN, COMPUTER);
	expect(result).toEqual(8);
});

const wPawnScore = 8;
const bPawnScore = 3;
const wRookScore = 2;
const bRookScore = 12;
const wKnightScore = 5;
const bKnightScore = 4;
const wBishopScore = 9;
const bBishopScore = 1;
const wQueenScore = 6;
const bQueenScore = 7;

function testPieceCount(rank, alignment) {
	var count = 1;

	// determine which count to update from based on rank and alignment
	if (alignment == PLAYER) {
		if (rank == PAWN) {
			count = count + wPawnScore;
		}
		if (rank == KNIGHT) {
			count = count + wKnightScore;
		}
		if (rank == ROOK) {
			count = count + wRookScore;
		}
		if (rank == BISHOP) {
			count = count + wBishopScore;
		}
		if (rank == QUEEN) {
			count = count + wQueenScore;
		}
	} else if (alignment == COMPUTER) {
		if (rank == PAWN) {
			count = count + bPawnScore;
		}
		if (rank == KNIGHT) {
			count = count + bKnightScore;
		}
		if (rank == ROOK) {
			count = count + bRookScore;
		}
		if (rank == BISHOP) {
			count = count + bBishopScore;
		}
		if (rank == QUEEN) {
			count = count + bQueenScore;
		}
	}

	return count;
}
