import {Scene} from "phaser";
import {EventBus} from "../EventBus";

import {RulesButton} from "./RulesButton";

import {START_BACKGROUND_COLOR, START_TEXT_ONE, START_TEXT_TWO} from "../../game-objects/constants";

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
				// Once the font is loaded, we can start the scene
				this.fontLoaded = true; // Flag to indicate that the font is loaded

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

				this.cameras.main.setBackgroundColor(START_BACKGROUND_COLOR);

				this.titleText = this.add
					.text(0, 0, "Survival Chess", {
						fontFamily: "'Pixelify Sans', sans-serif",
						color: START_TEXT_ONE,
						stroke: START_TEXT_TWO,
						align: "center",
					})
					.setOrigin(0.5);
				this.introText = this.add
					.text(
						0,
						0,
						"Survival Chess is an arcade style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!",
						{
							fontFamily: "'Pixelify Sans', sans-serif",
							color: START_TEXT_TWO,
							backgroundColor: START_TEXT_ONE,
							stroke: START_TEXT_TWO,
							align: "center",
							wordWrap: {width: 4 * DOZEN_WIDTH}, // Explicitly enable word wrap
						}
					)
					.setOrigin(0.5);
				this.creditText = this.add
					.text(
						0,
						0,
						"Credits: Riana Therrien, Marley Higbee, David Goh, Kaydee Ferrel, Hope Heck, Durva Kadam, Mohamad Tiba, Ritu Ghosh",
						{
							fontFamily: "'Pixelify Sans', sans-serif",
							color: START_TEXT_TWO,
							backgroundColor: START_TEXT_ONE,
							stroke: START_TEXT_TWO,
							align: "center",
							fixedWidth: WINDOW_WIDTH,
						}
					)
					.setOrigin(0.5);

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

				this.settingsButton = this.add.text(0, 0, "Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: START_TEXT_ONE,
					backgroundColor: START_TEXT_TWO,
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

				this.rulesButton = this.add.text(0, 0, "Rules", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: START_TEXT_ONE,
					backgroundColor: START_TEXT_TWO,
				});
				this.rulesButton.on("pointerdown", new RulesButton(this).click, this);

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
