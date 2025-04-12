// turn-counter.js
import {globalMoves, globalWaves} from "./global-stats";
import {
	RIGHT_X_CENTER,
	RIGHT_UNIT,
	CENTER_HEIGHT,
	fontsizeTexts,
	paddingTexts,
	START_TEXT_ONE,
	START_TEXT_TWO,
} from "./constants";

export class TurnCounter {
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
		} else {
			console.warn("TurnCounter initialized without valid scene — skipping text setup");
		}
	}

	resize() {
		const yOffset = RIGHT_UNIT * 0.75;

		this.turnCounterText.setPosition(RIGHT_X_CENTER, CENTER_HEIGHT - yOffset);
		this.waveCounterText.setPosition(RIGHT_X_CENTER, CENTER_HEIGHT + yOffset);

		fontsizeTexts(RIGHT_UNIT * 0.75, this.turnCounterText, this.waveCounterText);
		paddingTexts(RIGHT_UNIT / 3, RIGHT_UNIT / 6, this.turnCounterText, this.waveCounterText);
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
