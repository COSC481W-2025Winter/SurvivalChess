import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {
	GAMEOVER_BACKGROUND_COLOR,
	GAMEOVER_TEXT_ONE,
	GAMEOVER_TEXT_TWO,
	GAMEOVER_BACKGROUND_COLOR_TWO,
} from "../../game-objects/constants";
import {globalMoves, globalPieces, globalWaves} from "../../game-objects/global-stats";

import {paddingTexts, fontsizeTexts} from "../../game-objects/constants";
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
	bg;
	square;
	titleText;
	wordsText;
	numbersText;
	restartButton;
	menuButton;

	constructor() {
		super({key: "GameOver"}); // Scene identifier
	}

	preload() {
		this.load.audio("endMusic", "../assets/music/SurvivalChess-End.mp3");
		this.load.setPath("assets");

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
		// Access the Game scene
		const gameScene = this.scene.get("MainGame");

		// Call the stopMusic method of the Game scene
		if (gameScene) {
			gameScene.stopMusic();
		}

		// Play music
		this.endMusic = this.sound.add("endMusic", {loop: false, volume: 0.5});
		this.endMusicPlaying = false;

		// Try to play music without user click
		this.endMusic.play();
		if (this.endMusic.isPlaying) {
			this.endMusicPlaying = true;
		}

		// put GAMEOVER over game screen
		this.scene.moveAbove("MainGame", "GameOver");
		// Creates an invisible background that also blocks input on the scene underneath
		this.bg = this.add.rectangle(1, 1, 1, 1, GAMEOVER_BACKGROUND_COLOR, 0);
		this.bg.setDepth(50);

		// Creates a visual background that also blocks input on the scene underneath
		this.square = this.add.rectangle(
			0,
			0,
			0,
			0,
			GAMEOVER_BACKGROUND_COLOR_TWO,
			0.95 // Opacity
		);
		this.square.setDepth(50);

		// GAMEOVER text
		this.titleText = this.add
			.text(0, 0, "Game Over!", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.wordsText = this.add
			.text(0, 0, "Number of Moves Made: \nNumber of Captured Pieces: \nNumber of Waves Survived: \nFinal Score: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				color: GAMEOVER_TEXT_TWO,
				backgroundColor: GAMEOVER_TEXT_ONE,
				stroke: GAMEOVER_TEXT_ONE,
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
				stroke: GAMEOVER_TEXT_ONE,
				align: "right",
			})
			.setOrigin(0.5)
			.setDepth(100)
			.setLineSpacing(50);

		this.menuButton = this.createButton(0, 0, "Main Menu", () => {
			console.log("Returning to main menu...");
			// Stop background music
			this.endMusic.stop();
			this.endMusicPlaying = false;
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset main game before menu
			this.scene.start("Game"); // can change if needed
		});

		this.restartButton = this.createButton(0, 0, "Restart Game", () => {
			console.log("Restarting game...");
			// Stop background music
			this.endMusic.stop();
			this.endMusicPlaying = false;
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset game state
			this.scene.start("MainGame");
		});

		// Minimize button
		this.createMinimize();

		this.bg.setInteractive();
		this.square.setInteractive();

		const scene = this;
		window.addEventListener(
			"resize",
			function (event) {
				scene.resize();
			},
			false
		);

		this.resize();
		EventBus.emit("current-scene-ready", this); // notify event system
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

		for (let text of [this.titleText, this.wordsText, this.numbersText, this.restartButton, this.menuButton, this.currentButton])
			text.setStroke(GAMEOVER_TEXT_ONE, UNIT_HEIGHT);
	}

	createButton(x, y, text, callback) {
		// Create a text-based button with styling
		const button = this.add
			.text(x, y, text, {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 20,
				backgroundColor: GAMEOVER_TEXT_ONE,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 5,
				padding: {left: 20, right: 20, top: 10, bottom: 10},
			})
			.setOrigin(0.5) // Center the button
			.setDepth(150)
			.setInteractive(); // Make it clickable

		// Set up button interactions
		button.on("pointerdown", callback); // Execute the callback on click
		button.on("pointerover", () => button.setScale(1.1)); // Slightly enlarge on hover
		button.on("pointerout", () => button.setScale(1)); // Reset scale when not hovered

		return button;
	}
}
