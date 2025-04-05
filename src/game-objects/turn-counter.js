// turn-counter.js
export class TurnCounter {
	constructor(scene) {
		this.scene = scene;
		this.turnCount = 0;

		// Add the turn counter text element
		this.turnCounterText = this.scene.add.text(910, 500, `Turn: ${this.turnCount}`, {
			fontFamily: "'Pixelify Sans', sans-serif",
			fontSize: 28,
			color: "#ffffff", // Replace with your color
		});
	}

	// Method to update the turn counter display
	updateTurnCounter() {
		this.turnCounterText.setText(`Turn: ${this.turnCount}`);
	}

	// Method to increment the turn counter
	incrementTurnCounter() {
		this.turnCount++;
		this.updateTurnCounter();
	}
}
