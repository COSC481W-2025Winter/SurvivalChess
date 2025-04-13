import {Scene} from "phaser";
import {EventBus} from "../EventBus";

import {SettingsButton} from "./SettingsButton";
import {RulesButton} from "./RulesButton";

import {ChessTiles} from "../../game-objects/chess-tiles";

import {RIGHT_X_CENTER} from "../../game-objects/constants";
import {DOZEN_HEIGHT, UNIT_HEIGHT} from "../../game-objects/constants";
import {configureButtons, paddingTexts, fontsizeTexts} from "../../game-objects/constants";
import {getPieceStyle} from "./PieceStyle";
import {globalMuteSound} from "../../game-objects/global-stats";

import {
	PAWN,
	ROOK,
	KNIGHT,
	BISHOP,
	QUEEN,
	KING,
	CREAMHEX,
	ONYXHEX,
	PLAYER,
	COMPUTER,
} from "../../game-objects/constants";

export class Game extends Scene {
	endButton;
	settingsButton;
	rulesButton;
	chessTiles;

	constructor() {
		super("MainGame");
	}

	preload() {
		this.load.audio("gameMusic", "../assets/music/SurvivalChess-Game.mp3");

		this.load.setPath("assets");
		// Load Chess piece pngs
		this.load.setPath("assets/ourChessPieces");
		for (const rank of [PAWN, ROOK, KNIGHT, BISHOP, QUEEN, KING]) {
			for (const alignment of [PLAYER, COMPUTER]) {
				this.load.image(rank + alignment, rank + alignment + getPieceStyle() + ".png");
			}
		}

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
		// Setup music
		this.gameMusic = this.sound.add("gameMusic", {loop: false, volume: 0.5});
		this.gameMusicPlaying = false;

		this.startMusic();

		// Manually loop specific part of the song
		const loopStartTime = 44; // in seconds
		const loopEndTime = 116; // in seconds

		// Track the current time of the music and restart the loop when necessary
		this.time.addEvent({
			delay: 10, // Check every 100 ms
			loop: true,
			callback: () => {
				const currentTime = this.gameMusic.seek;

				// If the current time is past the loopEndTime, restart from loopStartTime
				if (currentTime >= loopEndTime) {
					this.gameMusic.seek = loopStartTime;
				}
			},
		});

		const savedPalette = localStorage.getItem("selectedPalette") || "default";

		const themeColors = {
			default: {background: 0x3b3b3b, panel: 0xc04000, stroke: 0xc04000},
			dark: {background: 0x222222, panel: 0xbbb8b1, stroke: 0x222222},
			light: {background: 0xffffff, panel: 0x3b3b3b, stroke: 0x3b3b3b},
		}[savedPalette];

		this.cameras.main.setBackgroundColor(themeColors.background);

		// Add Chessboard & Chess Piece Images
		this.chessTiles = new ChessTiles(this);

		this.chessTiles.updateColorTheme(savedPalette);

		this.endButton = this.add.text(0, 0, "End Game!", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
		});
		this.endButton.on(
			"pointerdown",
			function () {
				import("./GameOver") //
					.then((module) => {
						// Stop background music
						this.stopMusic();

						// Only add the scene if it's not already registered
						if (!this.scene.get("GameOver")) {
							this.scene.add("GameOver", module.GameOver); // Add the MainGame scene dynamically
						}
						// Start the MainGame scene
						this.scene.launch("GameOver"); // Use launch to run scene in parallel to current
					});
			},
			this
		);

		this.settingsButton = this.add.text(0, 0, "Settings", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
		});
		this.settingsButton.on("pointerdown", new SettingsButton(this).click, this);

		this.rulesButton = this.add.text(0, 0, "Rules", {
			fill: CREAMHEX,
			backgroundColor: ONYXHEX,
			fontFamily: "'Pixelify Sans', sans-serif",
		});
		this.rulesButton.on("pointerdown", new RulesButton(this).click, this);

		const scene = this;
		configureButtons(this.endButton, this.settingsButton, this.rulesButton);
		window.addEventListener(
			"resize",
			function (event) {
				scene.resize();
			},
			false
		);

		this.resize();
		EventBus.emit("current-scene-ready", this);
	}

	resize() {
		this.settingsButton.setPosition(RIGHT_X_CENTER, 9 * DOZEN_HEIGHT);
		this.rulesButton.setPosition(RIGHT_X_CENTER, 10 * DOZEN_HEIGHT);
		this.endButton.setPosition(RIGHT_X_CENTER, 11 * DOZEN_HEIGHT);
		fontsizeTexts(6 * UNIT_HEIGHT, this.endButton, this.settingsButton, this.rulesButton);
		paddingTexts(4 * UNIT_HEIGHT, 2 * UNIT_HEIGHT, this.endButton, this.settingsButton, this.rulesButton);
		this.chessTiles.resize();
	}
	changeBackground() {
		const selectedPalette = localStorage.getItem("selectedPalette") || "default";

		const themeColors = {
			default: {background: 0x3b3b3b, panel: 0xc04000, stroke: 0xc04000},
			dark: {background: 0x222222, panel: 0xbbb8b1, stroke: 0x222222},
			light: {background: 0xffffff, panel: 0x3b3b3b, stroke: 0x3b3b3b},
		}[selectedPalette];

		// Check if camera exists
		if (this.cameras && this.cameras.main) {
			this.cameras.main.setBackgroundColor(themeColors.background);
		} else {
			console.error("Main camera not available.");
		}
	}
	// Function to stop the background music
	stopMusic() {
		if (this.gameMusicPlaying) {
			this.gameMusic.stop();
			this.gameMusicPlaying = false;
		}
	}

	startMusic() {
		// Play the music (if not muted)
		if (globalMuteSound == false) {
			this.gameMusic.play();
			if (this.gameMusic.isPlaying) {
				this.gameMusicPlaying = true;
			}
		}
	}
}
