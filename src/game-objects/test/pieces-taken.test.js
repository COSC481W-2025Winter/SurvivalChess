import "phaser";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "../constants";
import { PLAYER, COMPUTER } from '../constants';
jest.mock("../chess-piece");
jest.mock("../pieces-taken");


test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(PAWN, PLAYER);
    expect(result).toEqual([5, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(ROOK, PLAYER);
    expect(result).toEqual([4, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KNIGHT, PLAYER);
    expect(result).toEqual([4, 2]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(BISHOP, PLAYER);
    expect(result).toEqual([4, 4]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(QUEEN, PLAYER);
    expect(result).toEqual([4, 6]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KING, PLAYER);
    expect(result).toEqual([4, 7]);
});


test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(PAWN, COMPUTER);
    expect(result).toEqual([3, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(ROOK, COMPUTER);
    expect(result).toEqual([2, 0]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KNIGHT, COMPUTER);
    expect(result).toEqual([2, 2]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(BISHOP, COMPUTER);
    expect(result).toEqual([2, 4]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(QUEEN, COMPUTER);
    expect(result).toEqual([2, 6]);
});
test("should return the correct position for this piece's rank and alignment", () => {
    const result = testPosition(KING, COMPUTER);
    expect(result).toEqual([2, 7]);
});

const wknightTaken = false;
const wRookTaken = false;
const wBishopTaken = false;
const bknightTaken = false;
const bRookTaken = false;
const bBishopTaken = false;
const nextPawnW = 0;
const nextPawnB = 0;


function testPosition(rank, alignment){
    var inrow;
    var incol;
    if (alignment == PLAYER){
        if (rank == PAWN){
            inrow = 5;
            incol = nextPawnW;
            
        } else {
            inrow = 4;
            if (rank == KNIGHT){
                if (wknightTaken){
                    incol = 3;
                } else {
                    incol = 2;
                    
                }
            }
            if (rank == ROOK){
                if (wRookTaken){
                    incol = 1;
                } else {
                    incol = 0;
                    
                }
            }
            if (rank == BISHOP){
                if (wBishopTaken){
                    incol = 5;
                } else {
                    incol = 4;
                    
                }
            }
            if (rank == QUEEN){
                incol = 6;
            }
            if (rank == KING){
                incol = 7;
            }
        }
    } else {
        if (rank == PAWN){
            inrow = 3;
            incol = nextPawnB;
            
        } else {
            inrow = 2;
            if (rank == KNIGHT){
                if (bknightTaken){
                    incol = 3;
                } else {
                    incol = 2;
                    
                }
            }
            if (rank == ROOK){
                if (bRookTaken){
                    incol = 1;
                } else {
                    incol = 0;
                    
                }
            }
            if (rank == BISHOP){
                if (bBishopTaken){
                    incol = 5;
                } else {
                    incol = 4;
                    
                }
            }
            if (rank == QUEEN){
                incol = 6;
            }
            if (rank == KING){
                incol = 7;
            }
        }
    }

    return ([inrow, incol]);
}






