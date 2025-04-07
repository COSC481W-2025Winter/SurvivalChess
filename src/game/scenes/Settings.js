import Phaser from "phaser";
import {COLOR_THEMES} from "../../game-objects/constants.js";
import WebFont from "webfontloader";

export class Settings extends Phaser.Scene {
	constructor() {
		super({key: "Settings"});
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("star", "star.png");
		this.load.image("background", "bg.png");

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
		if (!this.fontLoaded) {
			this.time.delayedCall(100, () => this.create(), [], this);
			return;
		}

		const overlay = this.add.rectangle(
			this.cameras.main.width / 2,
			this.cameras.main.height / 2,
			this.cameras.main.width * 0.8,
			this.cameras.main.height * 0.7,
			0xffffff,
			0.9
		);
		overlay.setOrigin(0.5, 0.5);

		this.add
			.text(this.cameras.main.width / 2, 100, "SETTINGS", {
				fontSize: "32px",
				fill: "#f28d3e",
				fontFamily: "Pixelify Sans",
				stroke: "#000000",
				strokeThickness: 6,
			})
			.setOrigin(0.5);

		this.add.text(200, 170, "Color Palette:", {
			fontSize: "20px",
			fill: "#f28d3e",
			fontFamily: "Pixelify Sans",
		});

		const palettes = ["default", "dark", "light"];
		let yOffset = 220;

		palettes.forEach((palette) => {
			this.add
				.text(220, yOffset, palette, {
					fontSize: "18px",
					fill: "#fff",
					backgroundColor: "#333",
					padding: {x: 15, y: 10},
					fontFamily: "Pixelify Sans",
					stroke: "#f28d3e",
					strokeThickness: 2,
				})
				.setInteractive()
				.on("pointerdown", () => {
					localStorage.setItem("selectedPalette", palette);
					this.applyColorTheme(palette);
					this.updateChessPieceMode(palette);
					this.scene.restart();
				});

			yOffset += 50;
		});

		this.add
			.text(this.cameras.main.width / 2, this.cameras.main.height - 100, "Close Settings", {
				fontSize: "20px",
				fill: "#fff",
				backgroundColor: "#f28d3e",
				padding: {x: 20, y: 10},
				fontFamily: "Pixelify Sans",
				stroke: "#000000",
				strokeThickness: 4,
			})
			.setOrigin(0.5)
			.setInteractive()
			.on("pointerdown", () => {
				this.scene.stop("Settings");
			});

		const savedPalette = localStorage.getItem("selectedPalette") || "default";
		this.applyColorTheme(savedPalette);
	}

	applyColorTheme(selectedPalette) {
		const colors = COLOR_THEMES[selectedPalette];
		if (!colors) return;

		document.documentElement.style.setProperty("--primary-chess-color", colors.primary);
		document.documentElement.style.setProperty("--secondary-chess-color", colors.secondary);
	}

	updateChessPieceMode(selectedPalette) {
		localStorage.setItem("mode", selectedPalette);
		window.dispatchEvent(new Event("storage"));
	}
}
