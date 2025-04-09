import { Scene } from "phaser";
import { EventBus } from "../EventBus";
// import {
//     GAMEOVER_BACKGROUND_COLOR,
//     GAMEOVER_TEXT_ONE,
//     GAMEOVER_TEXT_TWO,
//     GAMEOVER_BACKGROUND_COLOR_TWO,
// } from "../../game-objects/constants";
import { globalMoves, globalPieces, globalWaves } from "../../game-objects/global-stats";

import { paddingTexts, fontsizeTexts } from "../../game-objects/constants";
import {
	WINDOW_WIDTH,
	WINDOW_HEIGHT,
	CENTER_WIDTH,
	CENTER_HEIGHT,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

export class GameOver extends Scene {
	GAMEOVER_TEXT_ONE;
	constructor() {
		super({ key: "GameOver" });
	}

	preload() {
		this.load.audio("endMusic", "../assets/music/SurvivalChess-End.mp3");
		this.load.setPath("assets");

		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;
			},
		});
	}

	create() {
		// Theme logic
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";
		const themeColors = {
			default: { text: 0xe5aa70, background: 0xc04000 },
			dark: { text: 0xbbb8b1, background: 0x222222 },
			light: { text: 0x3b3b3b, background: 0xffffff },
		}[selectedPalette];
		// Access the Game scene
		const gameScene = this.scene.get("MainGame");
		this.buttonTextColor = themeColors.text;
		this.buttonBgColor = themeColors.background;
		let GAMEOVER_BACKGROUND_COLOR = Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba;
		this.GAMEOVER_TEXT_ONE = Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba;
		let GAMEOVER_TEXT_TWO = Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba;
		let GAMEOVER_BACKGROUND_COLOR_TWO = Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba;
		// Call the stopMusic method of the Game scene
		if (gameScene) {
			gameScene.stopMusic();
		}

		// Play music
		this.endMusic = this.sound.add("endMusic", {loop: false, volume: 0.5});
		this.endMusicPlaying = false;


		// Music
		this.endMusic = this.sound.add("endMusic", { loop: false, volume: 0.5 });
		this.endMusic.play();

		// Scene layering
		this.scene.moveAbove("MainGame", "GameOver");

		// Background layers
		this.bg = this.add.rectangle(CENTER_WIDTH, CENTER_HEIGHT, WINDOW_WIDTH, WINDOW_HEIGHT, 0xffffff, 0);
		this.bg.setDepth(50);

		this.square = this.add.rectangle(CENTER_WIDTH, CENTER_HEIGHT, 800, 600, 0xffffff, 0.95);
		this.square.setDepth(50);

		// Title
		this.titleText = this.add.text(CENTER_WIDTH, 2 * DOZEN_HEIGHT, "Game Over!", {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 50,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			//stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			//strokeThickness: 5,
			align: "center",
		}).setOrigin(0.5).setDepth(100);

		this.wordsText = this.add
			.text(0, 0, "Number of Moves Made: \nNumber of Captured Pieces: \nNumber of Waves Survived: \nFinal Score: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: GAMEOVER_TEXT_TWO,
				backgroundColor: this.GAMEOVER_TEXT_ONE,
				//stroke: GAMEOVER_TEXT_ONE,
				align: "left",
			})
			.setOrigin(0.5)
			.setDepth(100)
			.setLineSpacing(50);

		// Calculate final score
		// Idea #1: "efficiency" (pieces captured / moves) as a measurement of performance
		let efficiency = globalMoves == 0 ? 0 : globalPieces / globalMoves;
		let score = Math.ceil(efficiency * globalWaves * 1000);

		this.numbersText = this.add
			.text(0, 0, globalMoves + "\n" + globalPieces + "\n" + globalWaves + "\n" + score, {
				color: GAMEOVER_TEXT_TWO,
				//stroke: GAMEOVER_TEXT_ONE,
				align: "right",
			})
			.setOrigin(0.5)
			.setDepth(100)
			.setLineSpacing(50);

		this.menuButton = this.createButton(0, 0, "Main Menu", () => {
			console.log("Returning to main menu...");
			this.endMusic.stop();
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("Game"); // ← Go to Start screen
		});

		this.restartButton = this.createButton(CENTER_WIDTH, 600, "Restart Game", () => {
			console.log("Restarting game...");
			this.endMusic.stop();
			this.scene.stop("GameOver");
			this.scene.stop("MainGame");
			this.scene.start("MainGame");
		});

		// Minimize button
		this.createMinimize();

		this.bg.setInteractive();
		this.square.setInteractive();

		const scene =this;
		window.addEventListener(
			"resize",
			function(event) {
				scene.resize();
			}
		);

		this.resize();


		EventBus.emit("current-scene-ready", this);
	}

	createStatText(x, y, label, value) {
		const labelText = this.add.text(x, y, label, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			//stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			//strokeThickness: 4,
			align: "center",
		}).setOrigin(0.5).setDepth(100);

		const valueText = this.add.text(x + 200, y, value.toString(), {
			fontSize: 25,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			//stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			//strokeThickness: 4,
			align: "center",
		}).setOrigin(0.5).setDepth(100);
	}

	createMinimize() {
		this.currentButton?.destroy();

		// Minimize button
		this.currentButton = this.createButton(0, 0, "▼", () => {
			for (let element of [this.bg, this.square, this.titleText, this.wordsText, this.numbersText,
				this.menuButton, this.restartButton])
				element.setAlpha(0);

			this.createMaximize();
		});

		this.resize();
	}

	createMaximize() {
		this.currentButton?.destroy();
		// Creates a visual background that also blocks input on the scene underneath
		this.bg = this.add.rectangle(1, 1, 1, 1, 0x3b3b3b, 0.0001);
		this.bg.setOrigin(0.5);
		this.bg.setInteractive();


		// Maximize button
		this.currentButton = this.createButton(0, 0, "▲", () => {
			for (let element of [this.bg, this.square, this.titleText, this.wordsText, this.numbersText,
				this.menuButton, this.restartButton])
				element.setAlpha(1);

			this.createMinimize();
		});

		this.resize();
	}

	resize() {
		this.bg.setPosition(CENTER_WIDTH, CENTER_HEIGHT);
		this.bg.setSize(WINDOW_WIDTH, WINDOW_HEIGHT);
		this.square.setPosition(CENTER_WIDTH, CENTER_HEIGHT);
		this.square.setSize(10 * DOZEN_HEIGHT, 10 * DOZEN_HEIGHT);
		this.titleText.setPosition(CENTER_WIDTH, 2 * DOZEN_HEIGHT);
		fontsizeTexts(1.5 * DOZEN_HEIGHT, this.titleText);

		this.wordsText.setPosition(6 * DOZEN_WIDTH, 5 * DOZEN_HEIGHT);
		this.numbersText.setPosition(6 * DOZEN_WIDTH + 3.45 * DOZEN_HEIGHT, 5 * DOZEN_HEIGHT);
		fontsizeTexts(6 * UNIT_HEIGHT, this.wordsText, this.numbersText);
		this.wordsText.setPadding(4 * UNIT_HEIGHT, 2.5 * UNIT_HEIGHT, DOZEN_HEIGHT, 2.5 * UNIT_HEIGHT);
		this.wordsText.setLineSpacing(6 * UNIT_HEIGHT);
		this.numbersText.setLineSpacing(6 * UNIT_HEIGHT);

		this.menuButton.setPosition(CENTER_WIDTH, 8 * DOZEN_HEIGHT);
		this.restartButton.setPosition(CENTER_WIDTH, 10 * DOZEN_HEIGHT);
		this.currentButton.setPosition(9 * DOZEN_WIDTH, 10 * DOZEN_HEIGHT);
		paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.menuButton, this.restartButton, this.currentButton);
		fontsizeTexts(9 * UNIT_HEIGHT, this.menuButton, this.restartButton, this.currentButton);

		for (let text of [
            this.titleText,
            this.wordsText,
            this.numbersText,
            this.restartButton,
            this.menuButton,
            this.currentButton,
        ])
            text.setStroke(this.GAMEOVER_TEXT_ONE, UNIT_HEIGHT);
﻿

	}
	
	createButton(x, y, text, callback) {
		const button = this.add.text(x, y, text, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 20,
			backgroundColor: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			color: Phaser.Display.Color.IntegerToColor(this.buttonTextColor).rgba,
			//stroke: Phaser.Display.Color.IntegerToColor(this.buttonBgColor).rgba,
			//strokeThickness: 5,
			padding: { left: 20, right: 20, top: 10, bottom: 10 },
		})
		.setOrigin(0.5)
		.setDepth(150)
		.setInteractive();

		button.on("pointerdown", callback);
		button.on("pointerover", () => button.setScale(1.1));
		button.on("pointerout", () => button.setScale(1));
		return button;
	}
}
