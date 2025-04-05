// turn-counter.js
export class TurnCounter {
	constructor(scene) {
		this.scene = scene;
		this.turnCount = 0;

		this.turnCounterText = this.scene.add.text(910, 500, `Turn: ${this.turnCount}`, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 28,
			color: "#ffffff",
		});
	}

	updateTurnCounter() {
		this.turnCounterText.setText(`Turn: ${this.turnCount}`);
	}

	incrementTurnCounter() {
		this.turnCount++;
		this.updateTurnCounter();
	}
}
