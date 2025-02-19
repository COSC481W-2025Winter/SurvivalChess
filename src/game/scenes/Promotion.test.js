import { Promotion } from "./Promotion";
import { COMPUTER, PAWN, ROOK, QUEEN, PLAYER} from "../../game-objects/constants";

describe("Promotion Scene Display Test", () => {
    let scene;

    beforeEach(() => {
        // Setup: Create a new instance of the Start scene for each test
        scene = new Promotion();
        
        // Mock the children array to simulate the scene objects like buttons and text.
        scene.children = {
            // Mock the getChildren method, which is responsible for fetching the scene's children objects (e.g., text, buttons)
            getChildren: jest.fn().mockReturnValue([
                // Mock the text instructions object with expected properties
                { text: "Select what piece to promote your pawn into", x: 500, y: 490 },
                // chess piece buttons
                {texture: "queen", Depth:5, Scale:1.5, input: { enabled: true }},
                {texture: "bishop", Depth:5, Scale:1.5, input: { enabled: true }},
                {texture: "rook", Depth:5, Scale:1.5, input: { enabled: true }},
                {texture: "knight", Depth:5, Scale:1.5, input: { enabled: true }},

            ]),
        };

        scene.add = {
            text: jest.fn().mockReturnValue({
                // Mock the method chaining typically used when creating Phaser text objects
                setOrigin: jest.fn(),
                setDepth: jest.fn(),
                setInteractive: jest.fn(),
                on: jest.fn(), // Mock event listener attachment
            }),
        };
    })

    test("text object should be created", () => {
        // Find the text object with the correct text value from the mocked children array
        const instructions = scene.children
            .getChildren()
            .find((child) => child.text === "Select what piece to promote your pawn into");

        // Assertions to check if the title text is created and its properties are correct
        expect(instructions).toBeDefined(); // Ensure the title text exists
        expect(instructions.x).toBe(500); // Ensure its x-position is correct
        expect(instructions.y).toBe(490); // Ensure its y-position is correct
    });

    test("chess pieces should be interactive an enabled", () => {
        // Find the settings button from the mocked children
        const queenPromotion = scene.children
            .getChildren()
            .find((child) => child.texture === "queen");

        // Assertions to check if the settings button exists and is interactive
        expect(queenPromotion).toBeDefined(); // Ensure the button exists
        expect(queenPromotion.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
        expect(queenPromotion.Depth).toBe(5); // depth set correctly
        expect(queenPromotion.Scale).toBe(1.5); // depth set correctly


        const knightPromotion = scene.children
            .getChildren()
            .find((child) => child.texture === "knight");

        // Assertions to check if the settings button exists and is interactive
        expect(knightPromotion).toBeDefined(); // Ensure the button exists
        expect(knightPromotion.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
        expect(knightPromotion.Depth).toBe(5); // depth set correctly
        expect(knightPromotion.Scale).toBe(1.5); // depth set correctly

        const bishopPromotion = scene.children
            .getChildren()
            .find((child) => child.texture === "bishop");

        // Assertions to check if the settings button exists and is interactive
        expect(bishopPromotion).toBeDefined(); // Ensure the button exists
        expect(bishopPromotion.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
        expect(bishopPromotion.Depth).toBe(5); // depth set correctly
        expect(bishopPromotion.Scale).toBe(1.5); // depth set correctly


        const rookPromotion = scene.children
            .getChildren()
            .find((child) => child.texture === "rook");

        // Assertions to check if the settings button exists and is interactive
        expect(rookPromotion).toBeDefined(); // Ensure the button exists
        expect(rookPromotion.input.enabled).toBe(true); // Ensure the button is interactive (enabled)
        expect(rookPromotion.Depth).toBe(5); // depth set correctly
        expect(rookPromotion.Scale).toBe(1.5); // depth set correctly
    });
});

describe("Promotion logic tests", () => {

    function __mockCheckPromotion([col,row], alignment, rank) {
        if (rank==PAWN && row==0 && alignment==PLAYER) {
            return [PLAYER, true];
        } else if (rank==PAWN && row==7 && alignment==COMPUTER) {
            return [COMPUTER, true, QUEEN];
        }
        return false;
    }


    
    test("test whether piece is promoted", () => {
        // Non-royal row, should be false
        expect(__mockCheckPromotion([5,5],COMPUTER,PAWN)).toBe(false);
        // own royal row, impossible but should be false
        expect(__mockCheckPromotion([0,0],COMPUTER,PAWN)).toBe(false);
        // non-pawn should be false
        expect(__mockCheckPromotion([7,7],COMPUTER,ROOK)).toBe(false);
        //black pawn promoted to black queen
        expect(__mockCheckPromotion([5,7],COMPUTER,PAWN)).toStrictEqual([COMPUTER, true, QUEEN]);  
        // white pawn should be promoted to something
        expect(__mockCheckPromotion([5,0],PLAYER,PAWN)).toStrictEqual([PLAYER, true]);        
    });
})