// counter.js
import {globalMoves, globalWaves} from "./global-stats";
import {
	RIGHT_X_CENTER,
	RIGHT_UNIT,
	fontsizeTexts,
	paddingTexts,
	START_TEXT_ONE,
	START_TEXT_TWO,
	DOZEN_HEIGHT,
	UNIT_HEIGHT,
} from "./constants";

export class Counter {
	scene;
	turnCount;
	waveCount;

	constructor(scene) {
		this.scene = scene;
		this.turnCount = 0;
		this.waveCount = 0;

		if (this.scene?.add?.text) {
			this.turnCounterText = this.scene.add
				.text(0, 0, `Turn: ${this.turnCount}`, {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: START_TEXT_ONE,
				})
				.setOrigin(0.5);

			this.waveCounterText = this.scene.add
				.text(0, 0, `Wave: ${this.waveCount}`, {
					fontFamily: "'Pixelify Sans', sans-serif",
					color: START_TEXT_TWO,
				})
				.setOrigin(0.5);

			this.resize();
			if (this.scene.scale?.on) {
				this.scene.scale.on("resize", this.resize, this);
			}
		} else {
			console.warn("TurnCounter initialized without valid scene — skipping text setup");
		}
	}

	resize() {
		if (this.turnCounterText?.active && this.waveCounterText?.active) {
			// ensure counter ui respects bounds imposed by pieces taken box above it and game buttons below
			const capturedBottomY = 3.875 * RIGHT_UNIT;
			const buttonHeight = 12 * UNIT_HEIGHT;
			const buttonTopY = this.scene.buttonTopY || 9 * DOZEN_HEIGHT - buttonHeight / 2;

			const availableHeight = buttonTopY - capturedBottomY;
			const yOffset = availableHeight / 4;

			const maxFontSize = availableHeight / 4;
			const desiredFontSize = RIGHT_UNIT * 0.75;
			const finalFontSize = Math.min(desiredFontSize, maxFontSize);

			this.turnCounterText.setPosition(RIGHT_X_CENTER, capturedBottomY + yOffset);
			this.waveCounterText.setPosition(RIGHT_X_CENTER, buttonTopY - yOffset);

			fontsizeTexts(finalFontSize, this.turnCounterText, this.waveCounterText);
			paddingTexts(finalFontSize * 0.5, finalFontSize / 3, this.turnCounterText, this.waveCounterText);
		}
	}

	updateTurnCounter() {
		if (this.turnCounterText && this.turnCounterText.setText) {
			this.turnCount = globalMoves;
			this.turnCounterText.setText(`Turn: ${this.turnCount}`);
		} else {
			console.error("turnCounterText is not a valid Phaser Text object");
		}
	}

	updateWaveCounterText() {
		if (this.waveCounterText && this.waveCounterText.setText) {
			this.waveCount = globalWaves;
			this.waveCounterText.setText(`Wave: ${this.waveCount}`);
		} else {
			console.error("waveCounterText is not a valid Phaser Text object");
		}
	}
}
