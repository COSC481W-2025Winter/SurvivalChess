import "phaser";
import { ChessTiles } from "../chess-tiles.js";
jest
  .spyOn(ChessTiles.prototype, 'checkPromotion')
  .mockImplementation(([col, row]) => {
    return false;
  });
// Mock ChessPiece class
class MockChessPiece {
    constructor(scene, x, y, rank, alignment) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.rank = rank;
        this.alignment = alignment;
        this.moveCounter = 0;
        this.coordinate = null;

        this.image = rank + alignment;
    }

    getAlignment() {
        return this.alignment;
    }

    getRank() {
        return this.rank;
    }

    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }

    getMoveCounter() {
        return this.moveCounter;
    }

    incrementMoveCounter() {
        this.moveCounter++;
    }

    setCoordinate(col, row) {
        this.coordinate = [col, row];
    }

    getCoordinate() {
        return this.coordinate;
    }

    destroy() { }
}
jest.mock("../chess-piece", () => {
    return {ChessPiece: (scene, x, y, rank, alignment) => {
        return new MockChessPiece(scene, x, y, rank, alignment);
    }};
});

import { POINTER_OVER, POINTER_OUT, POINTER_DOWN, WHEEL } from "./test-constants.js";
import { LEFT, RIGHT, UP, DOWN } from "./test-constants.js";

import { HOVER_COLOR, WHITE_TILE_COLOR, BLACK_TILE_COLOR, NON_LETHAL_COLOR, LETHAL_COLOR, THREAT_COLOR, CHECKED_COLOR, STAGE_COLOR } from "../constants.js";
import { PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING } from "../constants.js";
import { PLAYER, COMPUTER } from "../constants.js";

describe("", () => {
    let scene;
    let tiles;
    let x, y;

    // ================================================================
    // Mocked Classes & Methods

    // Mock Scene
    class MockScene {
        constructor() {}

        // Mock the add.rectangle & add.text & add.existing methods
        add = {
            rectangle: jest.fn((x, y, width, height, color) => {
                return new MockRectangle(x, y, width, height, color);
            }),
            text: jest.fn((x, y, text, style) => {
                return new MockText(x, y, text, style);
            }),
            existing: jest.fn(),
        }
    }

    // Mock Rectangle class
    class MockRectangle {
        constructor(x, y, width, height, color) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
            this.fillColor = color;
        }

        setInteractive() { }
        on() { }

        setFillStyle(color) {
            this.fillColor = color;
        }
    }

    // Mock Text class
    class MockText {
        constructor(x, y, text, style) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.style = style;
            this.origin = 0;
        }

        setInteractive() { }
        on() { }

        setFillStyle(color) {
            this.fillColor = color;
        }

        setOrigin(origin) {
            this.origin = origin;
        }
    }

    // Mock Event Listener
    function mockTileEvent(event) {
        switch (event) {
            case POINTER_OVER:
                tiles.pointerOver(x, y);
                break;
            case POINTER_OUT:
                tiles.pointerOut(x, y);
                break;
            case POINTER_DOWN:
                tiles.pointerSelect(x, y);
                break;
        }
    }

    // ================================================================
    // Simulated Pointer Interaction

    // Simulate Pointer Movement (1 tile)
    function move(direction, repeat = 1) {
        for (let i = 0; i < repeat; i++)
        {
            mockTileEvent(POINTER_OUT);
            switch (direction) {
                case LEFT:
                    x -= 1;
                    break;
                case RIGHT:
                    x += 1;
                    break;
                case UP:
                    y -= 1;
                    break;
                case DOWN:
                    y += 1;
                    break;
            }
            mockTileEvent(POINTER_OVER);
        }
    }

    // Simulate Pointer Movement (multiple tiles)
    function shift(col, row) {
        col -= x;
        row -= y;

        move(col < 0 ? LEFT : RIGHT, Math.abs(col));
        move(row < 0 ? UP: DOWN, Math.abs(row));
    }

    // Simulate Pointer Click
    function click(col = null, row = null) {
        if (col !== null && row !== null)
            shift(col, row);
        mockTileEvent(POINTER_DOWN);
    }

    // ================================================================
    // Preparation for Testing

    // Prepare fresh ChessTiles before each test
    beforeEach(() => {
        // Create mock scene
        scene = new MockScene();

        // Create ChessTiles object
        tiles = new ChessTiles(scene);

        // Trigger hover event where 'Start Game' button is
        x = y = 4;
        mockTileEvent("pointerover");
    });



    // Tests
    test("Test Functions Functionality", () => {
        expect(scene).toBeDefined();
        expect(tiles).toBeDefined();
        shift(0, 0);
        click();
        click(0, 0);
    });

    test("Highlight Possible Moves", () => {
        click(4, 6);
        expect(tiles.chessTiles[4][5].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[4][4].fillColor).toBe(NON_LETHAL_COLOR);
        click(4, 4);
        expect(tiles.chessTiles[4][5].fillColor).toBe(tiles.getTileColor([4, 5]));
        click(7, 1);
        expect(tiles.chessTiles[7][2].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[7][3].fillColor).toBe(NON_LETHAL_COLOR);
        click(7, 3);
        expect(tiles.chessTiles[7][2].fillColor).toBe(tiles.getTileColor([7, 2]));
        click(4, 7);
        click(3, 7);
        expect(tiles.chessTiles[4][6].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[5][5].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[6][4].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[7][3].fillColor).toBe(LETHAL_COLOR);
        click(7, 3);
        expect(tiles.chessTiles[5][5].fillColor).toBe(tiles.getTileColor([5, 5]));
        click(4, 0);
        click(6, 0);
        expect(tiles.chessTiles[7][2].fillColor).toBe(NON_LETHAL_COLOR);
        click(7, 2);
        click(7, 3);
        expect(tiles.chessTiles[7][2].fillColor).toBe(LETHAL_COLOR);
        expect(tiles.chessTiles[5][1].fillColor).toBe(LETHAL_COLOR);
        expect(tiles.chessTiles[0][3].fillColor).toBe(NON_LETHAL_COLOR);
    });

    test("Highlight Hover", () => {
        shift(1, 4);
        expect(tiles.chessTiles[1][4].fillColor).toBe(HOVER_COLOR);
        shift(7, 2);
        expect(tiles.chessTiles[1][4].fillColor).toBe(tiles.getTileColor([1, 4]));
        expect(tiles.chessTiles[7][2].fillColor).toBe(HOVER_COLOR);
        shift(0, 0);
        expect(tiles.chessTiles[7][2].fillColor).toBe(tiles.getTileColor([7, 2]));
        expect(tiles.chessTiles[0][0].fillColor).toBe(HOVER_COLOR);
    });

    test("Make Valid & Invalid Moves", () => {
        click(7, 7);
        expect(tiles.xy).toEqual([7, 7]);
        click(3, 3);
        expect(tiles.xy).toEqual([7, 7]);
        click(5, 7);
        expect(tiles.xy).toEqual([5, 7]);
        click(4, 7);
        expect(tiles.xy).toEqual([4, 7]);
        click(4, 7);
        expect(tiles.xy).toBe(null);
        click(3, 3);
        expect(tiles.xy).toBe(null);
        click(1, 7);
        expect(tiles.xy).toEqual([1, 7]);
        click(6, 1);
        expect(tiles.xy).toEqual([1, 7]);
        click(2, 5);
        expect(tiles.xy).toBe(null);
        click(3, 0);
        expect(tiles.xy).toEqual([3, 0]);
    });

    test("En Passant", () => {
        click(4, 6);
        click(4, 4);
        click(3, 1);
        click(3, 3);
        click(4, 4);
        click(3, 3);
        click(4, 1);
        click(4, 3);
        expect(tiles.boardState.isEnPassant(4, 2)).toBe(true);
        click(3, 3);
        expect(tiles.chessTiles[4][2].fillColor).toBe(LETHAL_COLOR);
        click(4, 2);
        expect(tiles.boardState.isOccupied(4, 3)).toBeFalsy();
    });

    test("Castling", () => {
        for (let i = 0; i<8; i++)
            if (i != 0 && i != 4 && i != 7)
                tiles.boardState.destroyPiece(i, 7);
        click(4, 7);
        expect(tiles.chessTiles[2][7].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[6][7].fillColor).toBe(NON_LETHAL_COLOR);
        click(2, 7);
        expect(tiles.boardState.getRank(2, 7)).toBe(KING);
        expect(tiles.boardState.getRank(3, 7)).toBe(ROOK);
        for (let i = 0; i<8; i++)
            if (i != 0 && i != 4 && i != 7)
                tiles.boardState.destroyPiece(i, 0);
        click(4, 0);
        expect(tiles.chessTiles[2][0].fillColor).toBe(NON_LETHAL_COLOR);
        expect(tiles.chessTiles[6][0].fillColor).toBe(NON_LETHAL_COLOR);
        click(6, 0);
        expect(tiles.boardState.getRank(6, 0)).toBe(KING);
        expect(tiles.boardState.getRank(5, 0)).toBe(ROOK);
        tiles.boardState.movePiece([2, 7], [4, 7]);
        click(4, 7);
        expect(tiles.chessTiles[2][7].fillColor).toBe(tiles.getTileColor([4, 7]));
        expect(tiles.chessTiles[6][7].fillColor).toBe(tiles.getTileColor([2, 7]));
    });

    test("Threat Detection", () => {
        tiles.boardState.addPiece(6, 5, KING, COMPUTER);
        click(6, 6);
        expect(tiles.chessTiles[6][5].fillColor).toBe(THREAT_COLOR);
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++)
                if (tiles.boardState.isOccupied(i, j))
                    tiles.boardState.destroyPiece(i, j);
        tiles.boardState.addPiece(3, 3, QUEEN, PLAYER);
        click(3, 3);
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++)
                if ((Math.abs(i - 3) == 2 && Math.abs(j - 3) == 1) || (Math.abs(i - 3) == 1 && Math.abs(j - 3) == 2))
                    tiles.boardState.addPiece(i, j, KNIGHT, COMPUTER);
                else if (i < 2 || i > 4 || j < 2 || j > 4)
                    tiles.boardState.addPiece(i, j, QUEEN, COMPUTER);
        click(3, 3);
        shift(0, 0);
        shift(3, 3);
        for (let i = 0; i < 8; i++)
            for (let j = 0; j < 8; j++)
                if ((Math.abs(i - 3) == 2 && j >=1 && j <= 5) || (i >=1 && i <= 5 && Math.abs(j - 3) == 2))
                    expect(tiles.chessTiles[i][j].fillColor).toBe(THREAT_COLOR);
                else if (i < 2 && i > 4 && j < 2 && j > 4)
                    expect(tiles.chessTiles[i][j].fillColor).toBe(tiles.getTileColor([i, j]));
        shift(7, 7);
        tiles.boardState.addPiece(2, 3, KING, COMPUTER);
        shift(3, 3);
        expect(tiles.chessTiles[2][3].fillColor).toBe(THREAT_COLOR);
    });

    test("King is Royal", () => {
        click(4, 6);
        click(4, 4);
        click(4, 1);
        click(4, 3);
        click(5, 6);
        click(5, 4);
        click(5, 1);
        click(5, 3);
        click(3, 7);
        click(7, 3);
        expect(tiles.chessTiles[4][0].fillColor).toBe(CHECKED_COLOR);
        click(4, 0);
        expect(tiles.chessTiles[4][0].fillColor).toBe(HOVER_COLOR);
        expect(tiles.chessTiles[5][1].fillColor).toBe(tiles.getTileColor([5, 1]));
        expect(tiles.chessTiles[4][1].fillColor).toBe(NON_LETHAL_COLOR);
        click(4, 1);
        shift(0, 0);
        expect(tiles.chessTiles[4][0].fillColor).toBe(tiles.getTileColor([4, 0]));
        expect(tiles.chessTiles[4][1].fillColor).toBe(tiles.getTileColor([4, 1]));
        click(7, 3);
        click(5, 1);
        expect(tiles.chessTiles[4][1].fillColor).toBe(THREAT_COLOR);
        shift(0, 0);
        expect(tiles.chessTiles[4][1].fillColor).toBe(CHECKED_COLOR);
        click(4, 1);
        shift(0, 0);
        expect(tiles.chessTiles[4][0].fillColor).toBe(tiles.getTileColor([4, 0]));
        expect(tiles.chessTiles[5][1].fillColor).toBe(LETHAL_COLOR);
        expect(tiles.chessTiles[5][2].fillColor).toBe(tiles.getTileColor([5, 2]));
        expect(tiles.chessTiles[4][2].fillColor).toBe(tiles.getTileColor([4, 2]));
        expect(tiles.chessTiles[3][2].fillColor).toBe(NON_LETHAL_COLOR);
    });

    test("Miscellaneous", () => {
        expect(tiles.pieceCoordinates.moveCoordinate([4, 4], [4, 4], PAWN, PLAYER)).toBe(false);
        expect(tiles.pieceCoordinates.deleteCoordinate(4, 4, PAWN, PLAYER)).toBe(false);
    });
});

