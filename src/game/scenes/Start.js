import { Scene } from "phaser";
import { EventBus } from "../EventBus";
import { RulesButton } from "./RulesButton";

import { configureButtons, paddingTexts, fontsizeTexts } from "../../game-objects/constants";
import { resize_constants } from "../../game-objects/constants";
import {
	WINDOW_WIDTH,
	CENTER_WIDTH,
	DOZEN_WIDTH,
	DOZEN_HEIGHT,
	UNIT_WIDTH,
	UNIT_HEIGHT,
} from "../../game-objects/constants";

export class Start extends Scene {
	constructor() {
		super("Game");
		this.fontLoaded = false;
	}

	preload() {
		this.load.setPath("assets");
		this.load.audio("backgroundMusic", "../assets/music/SurvivalChess-Menu.mp3");
	}

	async create() {
		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;

				// === Play Music ===
				this.backgroundMusic = this.sound.add("backgroundMusic", { loop: true, volume: 0.5 });
				if (!this.backgroundMusic.isPlaying) {
					this.backgroundMusic.play();
					this.backgroundMusicPlaying = true;
				}

				this.input.on("pointerdown", () => {
					if (!this.backgroundMusic.isPlaying) {
						this.backgroundMusic.play();
						this.backgroundMusicPlaying = true;
					}
				});

				// === Color Themes ===
				const selectedPalette = localStorage.getItem("selectedPalette") || "default";
				const themeColors = {
					default: { background: 0xe5aa70, panel: 0xc04000, stroke: 0xc04000 },
					dark: { background: 0x222222, panel: 0xbbb8b1, stroke: 0x222222 },
					light: { background: 0xffffff, panel: 0x3b3b3b, stroke: 0x3b3b3b },
				}[selectedPalette];

				this.themeColors = themeColors;

				this.cameras.main.setBackgroundColor(themeColors.background);

				// === Title ===
				this.titleText = this.add.text(0, 0, "Survival Chess", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fontSize: 130,
					color: "#FFFFFF",
					stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
					strokeThickness: 8,
					align: "center",
				}).setOrigin(0.5);

				// === Intro ===
				this.introText = this.add.text(0, 0,
					"Survival Chess is an arcade style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!", {
						fontFamily: "'Pixelify Sans', sans-serif",
						color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						backgroundColor: "#FFFFFF",
						stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						strokeThickness: 0,
						align: "center",
						padding: 15,
						wordWrap: { width: 4 * DOZEN_WIDTH },
					}).setOrigin(0.5);

				// === Credits ===
				this.creditText = this.add.text(0, 0,
					"Credits: Riana Therrien, Marley Higbee, David Goh, Kaydee Ferrel, Hope Heck, Durva Kadam, Mohamad Tiba, Ritu Ghosh", {
						fontFamily: "'Pixelify Sans', sans-serif",
						color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						backgroundColor: "#FFFFFF",
						stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						strokeThickness: 0,
						align: "center",
						fixedWidth: WINDOW_WIDTH,
					}).setOrigin(0.5);

				// === Start Button ===
				this.startButton = this.add.text(0, 0, "Start Game", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
					padding: { left: 20, right: 20, top: 10, bottom: 10 },
				});
				this.startButton.setInteractive().on("pointerdown", () => {
					import("./Game").then((module) => {
						this.backgroundMusic.stop();
						this.backgroundMusicPlaying = false;
						if (!this.scene.get("MainGame")) {
							this.scene.add("MainGame", module.Game);
						}
						this.scene.start("MainGame");
					});
				});

				// === Settings Button ===
				this.settingsButton = this.add.text(0, 0, "Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
				});
				this.settingsButton.setInteractive().on("pointerdown", () => {
					import("./Settings").then((module) => {
						if (!this.scene.get("Settings")) {
							this.scene.add("Settings", module.Settings);
						}
						this.scene.launch("Settings");
						this.scene.moveAbove("MainGame", "Settings");
					});
				});

				// === Rules Button ===
				this.rulesButton = this.add.text(0, 0, "Rules", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
				});
				this.rulesButton.setInteractive();
				this.rulesButton.on("pointerdown", new RulesButton(this).click, this);
				this.rulesButton.on("pointerover", () => this.rulesButton.setScale(1.2));
				this.rulesButton.on("pointerout", () => this.rulesButton.setScale(1));

				// === Final Setup ===
				configureButtons(this.startButton, this.settingsButton, this.rulesButton);
				window.addEventListener("resize", () => this.resize(), false);

				this.resize();
				EventBus.emit("current-scene-ready", this);

				// === Handle Theme Change ===
				EventBus.on("PaletteChanged", () => {
					if (this.backgroundMusic && this.backgroundMusic.isPlaying) {
						this.backgroundMusic.stop();
						this.backgroundMusicPlaying = false;
					}
					this.scene.restart();
				});
			},
		});
	}

	resize() {
		const { themeColors } = this;

		resize_constants(this);

		this.titleText.setPosition(CENTER_WIDTH, 3 * DOZEN_HEIGHT);
		this.introText.setPosition(CENTER_WIDTH, 8 * DOZEN_HEIGHT);
		this.creditText.setPosition(CENTER_WIDTH, 11 * DOZEN_HEIGHT);
		this.startButton.setPosition(CENTER_WIDTH, 5 * DOZEN_HEIGHT);
		this.settingsButton.setPosition(10.5 * DOZEN_WIDTH, 1.5 * DOZEN_HEIGHT);
		this.rulesButton.setPosition(10.5 * DOZEN_WIDTH, 9.5 * DOZEN_HEIGHT);

		this.titleText.setStroke(
			Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
			2 * UNIT_HEIGHT
		);

		this.introText.setColor(Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba);
		this.introText.setStroke(themeColors.stroke, 0);
		this.creditText.setColor(Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba);

		this.introText.setWordWrapWidth(6 * DOZEN_WIDTH);
		this.creditText.setFixedSize(WINDOW_WIDTH, 0);

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
	}
}
