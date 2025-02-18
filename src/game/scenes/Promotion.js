import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import {QUEEN, BISHOP, ROOK, KNIGHT } from "../../game-objects/constants";
import {PLAYER, COMPUTER } from "../../game-objects/constants";
import { Game } from "./Game";
import { ChessTiles } from "../../game-objects/chess-tiles";

export class Promotion extends Scene {
    constructor() {
        super("Promotion");
        this.rank;
        this.alignment;
    }

    preload() {
        this.load.setPath("assets/drummyfish chess/");
        this.load.image("queen", "queenB.png");
        this.load.image("knight", "knightB.png");
        this.load.image("rook", "rookB.png");
        this.load.image("bishop", "bishopB.png");
    }

    create() {
        let bgX = this.cameras.main.width;
        let bgY = this.cameras.main.height;
        this.add
            .text(512, 490, "Select what piece to promote your pawn into", {
                fontFamily: "Arial Black",
                fontSize: 38,
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8,
                align: "center",
            })
            .setOrigin(0.5)
            .setDepth(100);

        const queen = this.add.image(bgX/2-150,bgY/2, "queen").setDepth(5).setScale(1.5);
        const bishop = this.add.image(bgX/2-50,bgY/2, "bishop").setDepth(5).setScale(1.5);
        const knight = this.add.image(bgX/2+50,bgY/2, "knight").setDepth(5).setScale(1.5);
        const rook = this.add.image(bgX/2+150,bgY/2, "rook").setDepth(5).setScale(1.5);
        const pieces = [queen, bishop, knight, rook];

        // Some sort of event listener maybe?
        // const promotionEvent = new CustomEvent("PawnPromoted", {detail: { rank: this.rank}});

        
        queen.setInteractive();
        queen.on(
            "pointerdown",
            function () {
                // sends event telling promotion happened
                EventBus.emit("PawnPromoted", QUEEN);
                this.scene.stop("Promotion");
                },
                this
            );
        
        rook.setInteractive();
        rook.on(
            "pointerdown",
            function () {
                // sends event telling promotion happened
                EventBus.emit("PawnPromoted", ROOK);
                this.scene.stop("Promotion");
                },
                this
        );

        bishop.setInteractive();
        bishop.on(
            "pointerdown",
            function () {
                // sends event telling promotion happened
                EventBus.emit("PawnPromoted", BISHOP);
                this.scene.stop("Promotion");
                },
                this
        );

        knight.setInteractive();
        knight.on(
            "pointerdown",
            function () {
                // sends event telling promotion happened
                EventBus.emit("PawnPromoted", KNIGHT);
                this.scene.stop("Promotion");
                },
                this
        );

        // Creates a visual background that also blocks input on the scene underneath

        const bg = this.add.rectangle(bgX / 2, bgY / 2, bgX, bgY, 0x00ff00, 0.5);
        bg.setOrigin(0.5);
        bg.setInteractive();


        const closeButton = this.add.text(100, 100, "Close", {
            fill: "#0099ff",
            backgroundColor: "#ffff",
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
        });
        closeButton.setPosition(425, 600);
        closeButton.setInteractive();
        closeButton.on(
            "pointerdown",
            function () {
                this.scene.stop("Promotion");
            },
            this
        );

        // When the pointer hovers over the button, scale it up
        closeButton.on("pointerover", () => {
            closeButton.setScale(1.2); // Increase the scale (grow the button by 20%)
        });

        // When the pointer moves away from the button, reset the scale to normal
        closeButton.on("pointerout", () => {
            closeButton.setScale(1); // Reset to original size
        });

        EventBus.emit("current-scene-ready", this);
    }
}