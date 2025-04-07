const style1 = 1;
const style2 = 2;
var pieceStyleValue = null;
var tileStyleValue = null;

export function setPieceStyle(number) {
	if (number == 1) {
		pieceStyleValue = style1;
	}
	if (number == 2) {
		pieceStyleValue = style2;
	}
}

export function setTileStyle(number) {
	if (number == 1) {
		tileStyleValue = style1;
	}
	if (number == 2) {
		tileStyleValue = style2;
	}
}

export {pieceStyleValue, tileStyleValue};
