import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { CREAMHEX, ONYXHEX } from "../../game-objects/constants";


export class GameOver extends Scene {
    constructor() {
        super({ key: "GameOver" }); // Scene identifier
    }

    preload() {
        this.load.setPath("assets");  // set asset directory
        this.load.image("background", "bg.png"); // load background

    }

    create() {

        this.add.image(512, 384, "background");  //console.log("GameOver scene initialized.");
        console.log("GameOver scene preloaded.");
        console.log("GameOver scene created.");
        console.log("GameOver scene button created.");
        console.log("GameOver scene button clicked.");//add background

        this.add.text(512, 250, "Game Over", {
            fontFamily: "Arial Black",
            fontSize: 64,
            color: CREAMHEX,
            stroke: ONYXHEX,
            strokeThickness: 8,
            align: "center",
        }).setOrigin(0.5); // Center the text


        this.createButton(512, 400, "Restart Game", () => {
            console.log("Restarting game...");
            this.scene.stop("GameOver");
            this.scene.stop("MainGame"); // Reset game state
            this.scene.start("MainGame");
        });

        this.createButton(512, 450, "Main Menu", () => {
            console.log("Returning to main menu...");
            this.scene.stop("GameOver");
            this.scene.stop("MainGame"); // Reset main game before menu
            this.scene.start("Game"); // can change iff needed
        });


        EventBus.emit("current-scene-ready", this);  // notify event system


    }

    createButton(x, y, text, callback) {
        // Create a text-based button with styling
        const button = this.add.text(x, y, text, {
            fill: CREAMHEX,
            backgroundColor: ONYXHEX,
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        })
            .setOrigin(0.5) // Center the button
            .setInteractive(); // Make it clickable

        // Set up button interactions
        button.on("pointerdown", callback); // Execute the callback on click
        button.on("pointerover", () => button.setScale(1.1)); // Slightly enlarge on hover
        button.on("pointerout", () => button.setScale(1)); // Reset scale when not hovered
    }



}