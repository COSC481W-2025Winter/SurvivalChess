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
		this.load.audio("backgroundMusic", "../assets/music/file_example_MP3_700KB.mp3");
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
		// Play music
		this.backgroundMusic = this.sound.add("backgroundMusic", {loop: true, volume: 0.5});
		this.backgroundMusicPlaying = false;

		// Try to play music without user click
		this.backgroundMusic.play();
		if (this.backgroundMusic.isPlaying) {
			this.backgroundMusicPlaying = true;
		}

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
			350,
			450,
			225,
			GAMEOVER_BACKGROUND_COLOR,
			0.9 // Opacity
		);
		square2.setDepth(50);
		// GAMEOVER text
		this.add
			.text(625, 175, "Game Over!", {
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
		this.add
			.text(625, 275, "Number of Moves Made: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);
		this.add
			.text(625 + textWidth, 275, globalMoves + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.add
			.text(625, 350, "Number of Captured Pieces: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.add
			.text(625 + textWidth, 350, globalPieces + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.add
			.text(625, 425, "Number of Waves Survived: ", {
				fontFamily: "'Pixelify Sans', sans-serif",
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.add
			.text(625 + textWidth, 425, globalWaves + "", {
				fontSize: 25,
				color: GAMEOVER_TEXT_TWO,
				stroke: GAMEOVER_TEXT_ONE,
				strokeThickness: 4,
				align: "center",
			})
			.setOrigin(0.5)
			.setDepth(100);

		this.createButton(625, 600, "Restart Game", () => {
			console.log("Restarting game...");
			// Stop background music
			this.backgroundMusic.stop();
			this.backgroundMusicPlaying = false;
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset game state
			this.scene.start("MainGame");
		});

		this.createButton(625, 525, "Main Menu", () => {
			console.log("Returning to main menu...");
			// Stop background music
			this.backgroundMusic.stop();
			this.backgroundMusicPlaying = false;
			this.scene.stop("GameOver");
			this.scene.stop("MainGame"); // Reset main game before menu
			this.scene.start("Game"); // can change if needed
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
