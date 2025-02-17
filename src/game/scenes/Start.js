import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import {
    START_BACKGROUND_COLOR,
    START_TEXT_ONE,
    START_TEXT_TWO,
} from "../../game-objects/constants";

export class Start extends Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");

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
        this.cameras.main.setBackgroundColor(START_BACKGROUND_COLOR);

        this.add
            .text(630, 230, "Survival Chess", {
                fontFamily: "'Pixelify Sans', sans-serif",
                fontSize: 130,
                color: START_TEXT_ONE,
                stroke: START_TEXT_TWO,
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                630,
                525,
                "Survival Chess is an arcade style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!",
                {
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontSize: 20,
                    color: START_TEXT_TWO,
                    backgroundColor: START_TEXT_ONE,
                    stroke: START_TEXT_TWO,
                    strokeThickness: 0,
                    align: "center",
                    padding: 15,
                    fixedWidth: 570,
                    wordWrap: { width: 560 }, // Explicitly enable word wrap
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                625,
                710,
                "Credits: Riana Therrien, Marley Higbee, David Goh, Kaydee Ferrel, Hope Heck, Durva Kadam, Mohamad Tiba, Ritu Ghosh",
                {
                    fontFamily: "'Pixelify Sans', sans-serif",
                    fontSize: 20,
                    color: START_TEXT_TWO,
                    backgroundColor: START_TEXT_ONE,
                    stroke: START_TEXT_TWO,
                    strokeThickness: 0,
                    align: "center",
                    padding: 10,
                    fixedWidth: 1500,
                }
            )
            .setOrigin(0.5)
            .setDepth(100);

        const startButton = this.add.text(100, 100, "Start Game", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        startButton.setPosition(550, 370);
        startButton.setInteractive();
        startButton.on(
            "pointerdown",
            function () {
                import("./Game") // Dynamically import the Game scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("MainGame")) {
                            this.scene.add("MainGame", module.Game); // Add the MainGame scene dynamically
                        }

                        // Start the MainGame scene
                        this.scene.start("MainGame");
                    });
            },
            this
        );

        const settingsButton = this.add.text(100, 100, "Settings", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        settingsButton.setPosition(1100, 70);
        settingsButton.setInteractive();
        settingsButton.on(
            "pointerdown",
            function () {
                import("./Game") // Dynamically import the Settings scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("Settings")) {
                            this.scene.add("Settings", module.Game); // Add the scene dynamically
                        }

                        // Start the scene
                        this.scene.start("Settings");
                    });
            },
            this
        );

        const rulesButton = this.add.text(100, 100, "See Rules", {
            fontFamily: "'Pixelify Sans', sans-serif",
            fill: START_TEXT_ONE,
            backgroundColor: START_TEXT_TWO,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        rulesButton.setPosition(1100, 625);
        rulesButton.setInteractive();

        rulesButton.on(
            "pointerdown",
            function () {
                import("./Game") // Dynamically import the rules scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("Rules")) {
                            this.scene.add("Rules", module.Game); // Add the scene dynamically
                        }

                        // Start the scene
                        this.scene.start("Rules");
                    });
            },
            this
        );

        // When the pointer hovers over the button, scale it up
        startButton.on("pointerover", () => {
            startButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        startButton.on("pointerout", () => {
            startButton.setScale(1); // Reset to original size
        });

        EventBus.emit("current-scene-ready", this);
    }
}

