let globalStatus = null;
let globalMoves = 0;
let globalPieces = 0;
let globalWaves = 0;
let globalMuteSound = false;
let globalPieceTakenTally = 0;

const CHECKMATE = "Checkmate!";
const STALEMATE = "Stalemate!";

export function toggleGlobalMute(scene) {
	globalMuteSound = !globalMuteSound;

	// manage scene sounds
	const gameScene = scene.scene.get("MainGame");
	const startScene = scene.scene.get("Game");
	const gameoverScene = scene.scene.get("GameOver");

	// Start music
	if (globalMuteSound == false) {
		if (scene.scene.isVisible("Game")) {
			startScene.startMusic();
		} else if (scene.scene.isVisible("MainGame")) {
			gameScene.startMusic();
		} else if (scene.scene.isVisible("GameOver")) {
			gameoverScene.startMusic();
		}
	} else {
		// Stop music for current scene
		if (startScene) startScene.stopMusic();
		if (gameScene) gameScene.stopMusic();
		if (gameoverScene) gameoverScene.stopMusic();
	}
}
export function setGlobalStatus(status) {
	globalStatus = status;
}
export function incrementGlobalMoves() {
	globalMoves++;
}
export function incrementGlobalPieces(added) {
	globalPieces++;
	globalPieceTakenTally += added;
}
export function incrementGlobalWaves() {
	globalWaves++;
}

export function resetGlobalStatus() {
	globalStatus = null;
}
export function resetGlobalMoves() {
	globalMoves = 0;
}
export function resetGlobalPieces() {
	globalPieces = 0;
	globalPieceTakenTally = 0;
}
export function resetGlobalWaves() {
	globalWaves = 0;
}

export {globalStatus, globalMoves, globalPieces, globalWaves, globalMuteSound, globalPieceTakenTally};
export {CHECKMATE, STALEMATE};
