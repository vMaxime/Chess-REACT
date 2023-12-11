import Cell from "./Cell";
import chess from "../chess";
import Piece from "./Piece";

function Board() {

    let defaultPieces = {
        // blacks
        0: chess.PieceType.ROOK,
        1: chess.PieceType.KNIGHT,
        2: chess.PieceType.BISHOP,
        3: chess.PieceType.QUEEN,
        4: chess.PieceType.KING,
        5: chess.PieceType.BISHOP,
        6: chess.PieceType.KNIGHT,
        7: chess.PieceType.ROOK,
        // whites
        56: chess.PieceType.ROOK,
        57: chess.PieceType.KNIGHT,
        58: chess.PieceType.BISHOP,
        59: chess.PieceType.QUEEN,
        60: chess.PieceType.KING,
        61: chess.PieceType.BISHOP,
        62: chess.PieceType.KNIGHT,
        63: chess.PieceType.ROOK,
    };

    for (let y = 0; y <= 40; y += 40) {
        for (let x = 8; x < 16; x++) {
            defaultPieces[x + y] = chess.PieceType.PAWN;
        }
    }

    return (
        <div className="board">
            {
                Array(64).fill().map((ignore, index) => {
                    const pieceType = defaultPieces[index];
                    return <Cell key={index} index={index}>
                        {pieceType ? <Piece type={pieceType} team={index < 16 ? 'black' : 'white'} /> : null}
                    </Cell>
                })
            }
        </div>
    );
}

export default Board;