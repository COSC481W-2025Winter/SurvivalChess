import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {
	GAMEOVER_BACKGROUND_COLOR,
	GAMEOVER_TEXT_ONE,
	GAMEOVER_TEXT_TWO,
	GAMEOVER_BACKGROUND_COLOR_TWO,
} from "../../game-objects/constants";
import {globalMoves, globalPieces, globalWaves} from "../../game-objects/global-stats";

export class GameOver extends Scene {
	constructor() {
		super({key: "GameOver"}); // Scene identifier
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
		// put GAMEOVER over game screen
		this.scene.moveAbove("MainGame", "GameOver");
		// Creates an invisible background that also blocks input on the scene underneath
		const bg = this.add.rectangle(625, 384, 1250, 768, GAMEOVER_BACKGROUND_COLOR, 0);
		bg.setDepth(50);

		// Creates a visual background that also blocks input on the scene underneath
		const square = this.add.rectangle(
			625,
			375,
			800,
			600,
			GAMEOVER_BACKGROUND_COLOR_TWO,
			0.95 // Opacity
		);
		square.setDepth(50);

		// Creates a visual background that also blocks input on the scene underneath
		const square2 = this.add.rectangle(
			625,
			330,
			450,
			275,
			GAMEOVER_BACKGROUND_COLOR,
			0.9 // Opacity
		);
		square2.setDepth(50);
		// GAMEOVER text
		const gameOverText = this.add
			.text(625, 140, "Game Over!", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 75,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 5,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		var textWidth = 185; // Variable to offset numbers
		const numberOfMovesLabel = this.add
			.text(610, 220, "Number of Moves Made: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "left",
			})
			.setOrigin(0.5)
			.setDepth(100);
		const numberOfMovesCount = this.add
			.text(625 + textWidth, 220, globalMoves + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const numberOfCapturedPiecesLabel = this.add
			.text(610, 250, "Number of Captured Pieces: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "left",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const numberOfCapturedPiecesCount = this.add
			.text(625 + textWidth, 250, globalPieces + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const numberOfWavesSurvivedLabel = this.add
			.text(610, 280, "Number of Waves Survived: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "left",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const numberOfWavesSurvivedCount = this.add
			.text(625 + textWidth, 280, globalWaves + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// Final score calculation
		const finalScoreLabel = this.add
			.text(625, 330, "Final Score:", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 50,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		// Final score calculation

		// Idea #1: "efficiency" (pieces captured / moves) as a measurement of performance
		let efficiency = globalMoves == 0 ? 0 : globalPieces / globalMoves;
		let score = Math.ceil(efficiency * globalWaves * 1000);

		const finalScoreCount = this.add
			.text(625, 400, score + "", {
				fontSize: 80,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		const restartGameButton = this.createButton(625, 615, "Restart Game", () => {
			console.log("Restarting game...");
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset game state
			this.scene.start("MainGame");
		});

		const mainMenuButton = this.createButton(625, 540, "Main Menu", () => {
			console.log("Returning to main menu...");
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset main game before menu
			this.scene.start("Game"); // can change if needed
		});

		// Minimize button
		const minimizeButton = this.createButton(825, 615, "▼", () => {
			bg.setAlpha(0);
			square.setAlpha(0);
			square2.setAlpha(0);
			gameOverText.setAlpha(0);
			numberOfCapturedPiecesLabel.setAlpha(0);
			numberOfCapturedPiecesCount.setAlpha(0);
			numberOfMovesLabel.setAlpha(0);
			numberOfMovesCount.setAlpha(0);
			numberOfWavesSurvivedLabel.setAlpha(0);
			numberOfWavesSurvivedCount.setAlpha(0);
			finalScoreLabel.setAlpha(0);
			finalScoreCount.setAlpha(0);
			restartGameButton.setAlpha(0);
			mainMenuButton.setAlpha(0);
			minimizeButton.setAlpha(0);
		});

		bg.setInteractive();
		square.setInteractive();
		square2.setInteractive();
		EventBus.emit("current-scene-ready", this); // notify event system
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
	}
}
