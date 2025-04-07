import {Scene} from "phaser";
import {EventBus} from "../EventBus";
import {RulesButton} from "./RulesButton";

export class Start extends Scene {
	constructor() {
		super("Game");
		this.fontLoaded = false;
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("logo", "logo.png");
	}

	async create() {
		WebFont.load({
			google: {
				families: ["Pixelify Sans"],
			},
			active: () => {
				this.fontLoaded = true;

				// Get selected color palette
				const selectedPalette = localStorage.getItem("selectedPalette") || "default";

				const themeColors = {
					default: { background: 0xe5aa70, panel: 0xc04000, stroke: 0xc04000 },
					dark: { background: 0xbbb8b1, panel: 0x222222, stroke: 0x222222 },
					light: { background: 0xffffff, panel: 0x3b3b3b, stroke: 0x3b3b3b },
				}[selectedPalette];

				// Set background
				this.cameras.main.setBackgroundColor(themeColors.background);

				// === Title: Survival Chess ===
				this.add.text(630, 230, "Survival Chess", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fontSize: 130,
					color: "#FFFFFF", // Always white fill
					stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba, // Theme-based border
					strokeThickness: 8,
					align: "center",
				})
				.setOrigin(0.5)
				.setDepth(100);

				// === Description Panel ===
				this.add.text(
					630,
					525,
					"Survival Chess is an arcade style chess game. In this game, you play chess against a computer while trying to survive waves of incoming pieces. Capture as many pieces as you can while avoiding checkmate. Good Luck!",
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						fontSize: 20,
						color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						backgroundColor: "#FFFFFF", // Always white
						stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						strokeThickness: 0,
						align: "center",
						padding: 15,
						fixedWidth: 570,
						wordWrap: {width: 560},
					}
				)
				.setOrigin(0.5)
				.setDepth(100);

				// === Credits Panel ===
				this.add.text(
					625,
					710,
					"Credits: Riana Therrien, Marley Higbee, David Goh, Kaydee Ferrel, Hope Heck, Durva Kadam, Mohamad Tiba, Ritu Ghosh",
					{
						fontFamily: "'Pixelify Sans', sans-serif",
						fontSize: 20,
						color: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						backgroundColor: "#FFFFFF", // Always white
						stroke: Phaser.Display.Color.IntegerToColor(themeColors.stroke).rgba,
						strokeThickness: 0,
						align: "center",
						padding: 10,
						fixedWidth: 1500,
					}
				)
				.setOrigin(0.5)
				.setDepth(100);

				// === Start Button ===
				const startButton = this.add.text(550, 370, "Start Game", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF", // Always white text
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
					padding: {left: 20, right: 20, top: 10, bottom: 10},
				});
				startButton.setInteractive();
				startButton.on("pointerdown", () => {
					import("./Game").then((module) => {
						if (!this.scene.get("MainGame")) {
							this.scene.add("MainGame", module.Game);
						}
						this.scene.start("MainGame");
					});
				});

				// === Settings Button ===
				const settingsButton = this.add.text(1100, 70, "Settings", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
					padding: {left: 20, right: 20, top: 10, bottom: 10},
				});
				settingsButton.setInteractive();
				settingsButton.on("pointerdown", () => {
					import("./Settings").then((module) => {
						if (!this.scene.get("Settings")) {
							this.scene.add("Settings", module.Settings);
						}
						this.scene.launch("Settings");
						this.scene.moveAbove("MainGame", "Settings");
					});
				});

				// === Rules Button ===
				const rulesButton = this.add.text(1100, 600, "Rules", {
					fontFamily: "'Pixelify Sans', sans-serif",
					fill: "#FFFFFF",
					backgroundColor: Phaser.Display.Color.IntegerToColor(themeColors.panel).rgba,
					padding: {left: 20, right: 20, top: 10, bottom: 10},
				});
				rulesButton.setInteractive();
				rulesButton.on("pointerdown", new RulesButton(this).click, this);
				rulesButton.on("pointerover", () => rulesButton.setScale(1.2));
				rulesButton.on("pointerout", () => rulesButton.setScale(1));

				EventBus.emit("current-scene-ready", this);
			},
		});
	}
}
