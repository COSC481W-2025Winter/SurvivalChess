let globalStatus = null;
let globalMoves = 0;
let globalPieces = 0;
let globalWaves = 0;

const CHECKMATE = "Checkmate!";
const STALEMATE = "Stalemate!";

export function setGlobalStatus(status) {
	globalStatus = status;
}
export function incrementGlobalMoves() {
	globalMoves++;
}
export function incrementGlobalPieces() {
	globalPieces++;
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
}
export function resetGlobalWaves() {
	globalWaves = 0;
}

export {globalStatus, globalMoves, globalPieces, globalWaves};
export {CHECKMATE, STALEMATE};
