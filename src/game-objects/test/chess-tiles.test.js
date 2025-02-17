import "phaser";
import { ChessTiles } from "../chess-tiles";
import { ChessPiece } from "../chess-piece";
jest.mock("../chess-piece");

import { POINTER_OVER, POINTER_OUT, POINTER_DOWN, WHEEL } from "./test-constants.js";
import { LEFT, RIGHT, UP, DOWN } from "./test-constants.js";

describe("", () => {
    let scene;
    let tiles;
    let x, y;

    // ================================================================
    // Mocked Classes & Methods

    // Mock Scene
    class MockScene {
        constructor() {}

        // Mock the add.rectangle & add.existing methods
        add = {
            rectangle: jest.fn((x, y, width, height, color) => {
                return new MockRectangle(x, y, width, height, color);
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

    // Mock ChessPiece class
    class MockChessPiece {
        constructor(x, y, rank, alignment) {
            this.x = x;
            this.y = y;
            this.rank = rank;
            this.alignment = alignment;
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

        destroy() { }
    }

    // Replace ChessPiece constructor
    ChessPiece.constructor = jest.fn((scene, x, y, rank, alignment) => {
        return new MockChessPiece(scene, x, y, rank, alignment);
    })

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
                tiles.pointerSelect(x, y, true);
                break;
            case WHEEL:
                tiles.pointerSelect(x, y, false);
                break;
        }
    }

    // ================================================================
    // Simulated Pointer Interaction

    // Simulate Pointer Movement (1 tile)
    function move(direction, repeat = 1) {
        for (let i = 0; i < repeat; i++)
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

    // Simulate Pointer Movement (multiple tiles)
    function shift(col, row) {
        col -= x;
        row -= y;

        move(col < 0 ? LEFT : RIGHT, Math.abs(col));
        move(row < 0 ? UP: DOWN, Math.abs(row));
    }

    // Simulate Pointer Click
    function click(col = null, row = null) {
        if (col && row)
            shift(col, row);
        mockTileEvent(POINTER_DOWN);
    }

    // Simulate Pointer Scroll
    function scroll(col = null, row = null) {
        if (col && row)
            shift(col, row);
        mockTileEvent(WHEEL);
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

    /*

    TODO LIST

    ::: MACRO :::
    X. Do all of the following for when a piece is selected & not
    1. Move pointer & check if colors highlight & un-highlight properly
    2. Click/scroll tile where non-response is expected & check if nothing happened (as intended)
    3. Click/scroll tile where response is expected & check if said response happened (as intended)
        a. selection
        b. re-selection
        c. un-selection
        d. non-lethal move
        e. lethal move

    ::: MICRO :::
    1. Check Pointer Events methods
    2. Check Tile Highlight & Restoration methods
    3. Check Miscellaneous methods

    */



    // Test Template
    test("", () => {
        expect(scene).toBeDefined();
        expect(tiles).toBeDefined();
        shift(0, 0);
        click();
        scroll();
        click(0, 0);
        scroll(0, 0);
    });
});

