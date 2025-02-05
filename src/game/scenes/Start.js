import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { RulesOverlay } from "./RulesOverlay";

export class Start extends Scene {
    constructor() {
        super("Game");
    }

    preload() {
        this.load.setPath("assets");

        this.load.image("background", "bg.png");
        this.load.image("logo", "logo.png");
    }

    create() {
        this.add.image(512, 384, "background");
        this.add.image(512, 350, "logo").setDepth(100);
        this.add
            .text(512, 490, "Welcome to Survival Chess, play to lose!", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);
        const startButton = this.add.text(100, 100, "Chess Game!", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        startButton.setPosition(425, 600);
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

        // When the pointer hovers over the button, scale it up
        startButton.on("pointerover", () => {
            startButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        startButton.on("pointerout", () => {
            startButton.setScale(1); // Reset to original size
        });


        // For the time being, hard-coding the rules button
        // Will modularize for use on other scenes later
        const rulesButton = this.add.text(100, 100, "Rules", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });

        rulesButton.setPosition(425, 700);
        rulesButton.setInteractive();
        rulesButton.on(
            "pointerdown",
            function () {
                import("./RulesOverlay") // Dynamically import the Game scene
                    .then((module) => {
                        // Only add the scene if it's not already registered
                        if (!this.scene.get("Rules")) {
                            this.scene.add("Rules", module.RulesOverlay); // Add the MainGame scene dynamically
                        }

                        // Using launch instead of start preserves the current scene underneath it
                        this.scene.launch("Rules");
                    });
            },
            this
        );

        EventBus.emit("current-scene-ready", this);
    }
}

