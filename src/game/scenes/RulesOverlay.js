import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import {
    RULES_BACKGROUND_COLOR,
    RULES_TEXT_ONE,
    RULES_TEXT_TWO,
    RULES_BACKGROUND_COLOR_TWO,
    BACKGROUND_COLOR,
    RULES_TEXT_THREE,
} from "../../game-objects/constants";

export class RulesOverlay extends Scene {
    constructor() {
        super("Rules");
    }

    preload() {
        this.load.setPath("assets");
        this.load.image("star", "star.png");
        this.load.image("background", "bg.png");

        // Load the pixel font
        WebFont.load({
            google: {
                families: ["Pixelify Sans"],
            },
            active: () => {
                // Once the font is loaded, we can start the scene
                this.fontLoaded = true; // Flag to indicate that the font is loaded
            },
        });
    }

    create() {
        // put Rules over game screen
        this.scene.moveAbove("MainGame", "Rules");
        // Creates a visual background that also blocks input on the scene underneath
        const bg = this.add.rectangle(
            625,
            384,
            1250,
            768,
            RULES_BACKGROUND_COLOR,
            0.5,
        );
        bg.setDepth(50);

        // Creates a visual background that also blocks input on the scene underneath
        const square = this.add.rectangle(
            625,
            384,
            800,
            400,
            RULES_BACKGROUND_COLOR_TWO,
            0.9, // Opacity
        );
        square.setDepth(50);

        // Rules text
        this.add
            .text(625, 215, "RULES", {
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 38,
                color: RULES_TEXT_TWO,
                stroke: RULES_TEXT_ONE,
                strokeThickness: 5,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                615,
                400,
                "- Pieces move the same as in regular chess\n\n" +
                    "- To move, click on the piece you want to move, and then click on the square\n   you want to move it to\n\n" +
                    "- The enemy pieces spawn in waves that will increase in dificulty in later rounds\n\n" +
                    "- Enemy pieces spawn in the top two rows (rows 7&8)\n\n" +
                    "- Your goal is to capture enemy pieces while avoiding checkmate\n\n" +
                    "- The more pieces you capture the more points you will gain\n\n" +
                    "- A new wave of pieces will spawn every 8 rounds\n\n" +
                    "- Capturing all the enemy pieces will progress you to the next round early",
                {
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontSize: 20,
                    color: RULES_TEXT_TWO,
                    stroke: RULES_TEXT_ONE,
                    strokeThickness: 0,
                    align: "left",
                },
            )
            .setOrigin(0.5)
            .setDepth(100);

        // Button for closing out (this should stay unlike the above)
        const closeButton = this.add.text(100, 100, "Close Rules", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fontSize: 25,
            backgroundColor: RULES_TEXT_THREE,
            color: RULES_TEXT_TWO,
            stroke: RULES_TEXT_ONE,
            strokeThickness: 5,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        closeButton.setOrigin(0.5);
        closeButton.setPosition(625, 625);
        closeButton.setInteractive();
        closeButton.on(
            "pointerdown",
            function () {
                this.scene.stop("Rules");
            },
            this,
        );
        closeButton.setDepth(100);

        // When the pointer hovers over the button, scale it up
        closeButton.on("pointerover", () => {
            closeButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        closeButton.on("pointerout", () => {
            closeButton.setScale(1); // Reset to original size
        });

        bg.setInteractive();
        square.setInteractive();

        EventBus.emit("current-scene-ready", this);
    }
}

