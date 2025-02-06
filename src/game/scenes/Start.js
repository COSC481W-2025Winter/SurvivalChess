import { Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Start extends Scene {
    // // Color values

    // fawn = "#E5AA70"
    // mahogany = "#C04000"
    // onyx = "#3B3B3B"
    // cream = "#F4FFFD"
    // green = "#6E9075"

    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
    }

    create() {
        this.add
            .text(512, 200, "Survival Chess", {
                fontFamily: "serif",
                fontSize: 100,
                color: "#E5AA70",
                stroke: "#C04000",
                strokeThickness: 8,
                align: "center",
            })

            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                512,
                300,
                "Description of game: Survival Chess is a arcade style chess game. ",
                {
                    fontFamily: "serif",
                    fontSize: 20,
                    color: "#C04000",
                    backgroundColor: "#E5AA70",
                    stroke: "#C04000",
                    strokeThickness: 0,
                    align: "center",
                }
            )

            .setOrigin(0.5)
            .setDepth(100);

        this.add
            .text(
                512,
                600,
                "Credits: Riana Therrien, Marley Higbee, David Goh, \nKaydee Ferrel, Durva Kadam, Mohamad Tiba, Ritu Ghosh",
                {
                    fontFamily: "serif",
                    fontSize: 20,
                    color: "#C04000",
                    backgroundColor: "#E5AA70",
                    stroke: "#C04000",
                    strokeThickness: 0,
                    align: "center",
                }
            )

            .setOrigin(0.5)
            .setDepth(100);
        const startButton = this.add.text(100, 100, "Start Game", {
            fill: "#F4FFFD",
            backgroundColor: "#C04000",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        startButton.setPosition(440, 400);
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
            fill: "#F4FFFD",
            backgroundColor: "#C04000",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        settingsButton.setPosition(870, 70);
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
            fill: "#F4FFFD",
            backgroundColor: "#C04000",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        rulesButton.setPosition(870, 650);
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

