import {Scene} from "phaser";
import {EventBus} from "../EventBus";

import {START_TEXT_ONE, START_TEXT_TWO} from "../../game-objects/constants";

import {configureButtons, paddingTexts, fontsizeTexts} from "../../game-objects/constants";
import {resize_constants} from "../../game-objects/constants";
import {
	WINDOW_WIDTH,
	CENTER_WIDTH,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_WIDTH,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

export class Start extends Scene {
	titleText;
	introText;
	creditText;
	startButton;
	settingsButton;
	rulesButton;

	constructor() {
		super("Game");
		this.fontLoaded = false;
	}

	preload() {
		this.load.setPath("assets");

		this.load.audio("backgroundMusic", "../assets/music/SurvivalChess-Menu.mp3");
	}

	async create() {
		// Load the pixel font
		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;

				// Play music
				this.backgroundMusic = this.sound.add("backgroundMusic", {loop: true, volume: 0.5});
				this.backgroundMusicPlaying = false;

				// Try to play music without user click
				this.backgroundMusic.play();
				if (this.backgroundMusic.isPlaying) {
					this.backgroundMusicPlaying = true;
				}

				// If it is not playing it will wait for user click
				// This is necessary for most browsers settings
				this.input.on("pointerdown", () => {
					if (!this.backgroundMusicPlaying) {
						// Play only if not already playing
						this.backgroundMusic.play();
						this.backgroundMusicPlaying = true;
					}
				});

				// Get selected color palette
				const selectedPalette = localStorage.getItem("selectedPalette") || "default";

				const themeColors = {
					default: {background: 0xe5aa70, panel: 0xc04000, stroke: 0xc04000},
					dark: {background: 0x222222, panel: 0xbbb8b1, stroke: 0x222222},
					light: {background: 0xffffff, panel: 0x3b3b3b, stroke: 0x3b3b3b},
				}[selectedPalette];

				// Set background
				this.cameras.main.setBackgroundColor(themeColors.background);

				// === Title: Survival Chess ===
				this.titleText = this.add
					.text(0, 0, "Survival Chess", {
						fontFamily: "'Pixelify Sans', sans-serif",
						fontSize: 130,
						color: "#FFFFFF", // Always white fill
						stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba, // Theme-based border
						strokeThickness: 8,
						align: "center",
					})
					.setOrigin(0.5);
				// === Description Panel ===
				this.introText = this.add
					.text(
						0,
						0,
						"Survival Chess is an arcade style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!",
						{
							fontFamily: "'Pixelify Sans', sans-serif",
							color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
							backgroundColor: "#FFFFFF", // Always white
							stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
							strokeThickness: 0,
							align: "center",
							padding: 15,
							wordWrap: {width: 4 * DOZEN_WIDTH}, // Explicitly enable word wrap
						}
					)
					.setOrigin(0.5);
				// === Credits Panel ===
				this.creditText = this.add
					.text(
						0,
						0,
						"Credits: Riana Therrien, Marley Higbee, David Goh, Kaydee Ferrel, Hope Heck, Durva Kadam, Mohamad Tiba, Ritu Ghosh",
						{
							fontFamily: "'Pixelify Sans', sans-serif",
							color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
							backgroundColor: "#FFFFFF", // Always white
							stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
							strokeThickness: 0,
							align: "center",
							fixedWidth: WINDOW_WIDTH,
						}
					)
					.setOrigin(0.5);

				// === Start Button ===
				this.startButton = this.add.text(0, 0, "Start Game", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: START_TEXT_ONE,
					backgroundColor: START_TEXT_TWO,
				});
				this.startButton.on(
					"pointerdown",
					function () {
						import("./Game") // Dynamically import the Game scene
							.then((module) => {
								// Stop background music
								this.backgroundMusic.stop();
								this.backgroundMusicPlaying = false;
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

				// === Settings Button ===
				this.settingsButton = this.add.text(0, 0, "Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF", // Always white text
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
				});
				this.settingsButton.on(
					"pointerdown",
					function () {
						import("./Settings") // Dynamically import the Settings scene
							.then((module) => {
								// Only add the scene if it's not already registered
								if (!this.scene.get("Settings")) {
									this.scene.add("Settings", module.Settings); // Add the scene dynamically
								}

								// Start the scene
								this.scene.launch("Settings");
								this.scene.moveAbove("MainGame", "Settings");
							});
					},
					this
				);

				// === Rules Button ===
				this.rulesButton = this.add.text(0, 0, "Rules", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
				});
				this.rulesButton.on(
					"pointerdown",
					function () {
						import("./Rules") // Dynamically import the Rules scene
							.then((module) => {
								// Only add the scene if it's not already registered
								if (!this.scene.get("Rules")) {
									this.scene.add("Rules", module.Rules); // Add the scene dynamically
								}

								// Start the scene
								this.scene.launch("Rules");
								this.scene.moveAbove("MainGame", "Rules");
							});
					},
					this
				);

				const scene = this;
				configureButtons(this.startButton, this.settingsButton, this.rulesButton);
				window.addEventListener(
					"resize",
					function (event) {
						scene.resize();
					},
					false
				);

				this.resize();
				EventBus.emit("current-scene-ready", this);

				EventBus.on("PaletteChanged", () => {
					this.scene.restart();
				});
			},
		});
	}

	resize() {
		resize_constants(this);
		this.titleText.setPosition(CENTER_WIDTH, 3 * DOZEN_HEIGHT);
		this.introText.setPosition(CENTER_WIDTH, 8 * DOZEN_HEIGHT);
		this.creditText.setPosition(CENTER_WIDTH, 11 * DOZEN_HEIGHT);
		this.startButton.setPosition(CENTER_WIDTH, 5 * DOZEN_HEIGHT);
		this.settingsButton.setPosition(10.5 * DOZEN_WIDTH, 1.5 * DOZEN_HEIGHT);
		this.rulesButton.setPosition(10.5 * DOZEN_WIDTH, 9.5 * DOZEN_HEIGHT);
		paddingTexts(
			4 * UNIT_HEIGHT,
			2 * UNIT_HEIGHT,
			this.titleText,
			this.introText,
			this.creditText,
			this.startButton,
			this.settingsButton,
			this.rulesButton
		);
		fontsizeTexts(2 * DOZEN_HEIGHT, this.titleText);
		fontsizeTexts(2.5 * UNIT_WIDTH, this.creditText);
		fontsizeTexts(6 * UNIT_HEIGHT, this.introText, this.startButton, this.settingsButton, this.rulesButton);
		this.titleText.setStroke(START_TEXT_TWO, 2 * UNIT_HEIGHT);
		this.introText.setWordWrapWidth(6 * DOZEN_WIDTH);
		this.creditText.setFixedSize(WINDOW_WIDTH, 0);
	}
}
