const style1 = 1;
const style2 = 2;
var pieceStyleValue = null;

export function setPieceStyle(number) {
	if (number == 1) {
		pieceStyleValue = style1;
	}
	if (number == 2) {
		pieceStyleValue = style2;
	}
}

export {pieceStyleValue};
