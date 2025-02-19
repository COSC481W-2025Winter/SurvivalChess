import "phaser";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "./constants";
import { PLAYER, COMPUTER } from './constants';
jest.mock("../chess-piece");

const { testPosition } = require('../pieces-taken');

test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(PAWN, PLAYER);
    expect(result).toBe([5, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(ROOK, PLAYER);
    expect(result).toBe([4, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KNIGHT, PLAYER);
    expect(result).toBe([4, 2]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(BISHOP, PLAYER);
    expect(result).toBe([4, 4]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(QUEEN, PLAYER);
    expect(result).toBe([4, 6]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KING, PLAYER);
    expect(result).toBe([4, 7]);
});


test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(PAWN, COMPUTER);
    expect(result).toBe([3, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(ROOK, COMPUTER);
    expect(result).toBe([2, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KNIGHT, COMPUTER);
    expect(result).toBe([2, 2]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(BISHOP, COMPUTER);
    expect(result).toBe([2, 4]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(QUEEN, COMPUTER);
    expect(result).toBe([2, 6]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KING, COMPUTER);
    expect(result).toBe([2, 7]);
});











