import Cell from "./Cell";
import chess from "../chess";
import Piece from "./Piece";
import { useEffect, useRef, useState } from "react";

function Board() {
    
    const [boards, setBoards] = useState([chess.getDefaultBoard()]);
    const [currentBoard, setCurrentBoard] = useState(0);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const boardElement = useRef();

    const board = boards[currentBoard];
    const currentTeam = currentBoard % 2 === 0 ? 1 : 0;
    const enemyTeam = currentTeam === 0 ? 1 : 0;
    const [selectedPieceType, selectedPieceTeam] = selectedPiece != null ? board[selectedPiece] : [null, null];

    let cellsCanMove = [];
    let cellsCanEat = [];

    if (selectedPieceTeam != null && selectedPieceTeam != enemyTeam) {
        let useableCells = chess.getUseableCells(board, selectedPiece, currentTeam);
        if (selectedPieceType === chess.PieceType.KING) {
            const tempBoard = [...board];
            tempBoard[selectedPiece] = [null, null]; // avoid diagonal checks blocking
            // TODO : remove pieces mating king
            for (const piecePos of Object.keys(chess.getCellsByTeam(board, enemyTeam))) {
                const tempBoardUseableCells = chess.getUseableCells(tempBoard, parseInt(piecePos), enemyTeam);
                useableCells = useableCells.filter(cell => !tempBoardUseableCells.includes(cell));
            }
        }
        cellsCanMove = useableCells.filter(cell => board[cell][0] === null);
        cellsCanEat = useableCells.filter(cell => board[cell][1] != null && board[cell][1] != selectedPieceTeam);
    }

    const moveSelectedPiece = to => {
        let useableCells = chess.getUseableCells(board, selectedPiece, currentTeam);
        if (!useableCells.includes(to))
            return false;
        // TODO checkmate
        const newBoard = [...board];
        newBoard[selectedPiece] = [null, null];
        newBoard[to] = board[selectedPiece];
        setBoards([...boards, newBoard]);
        setSelectedPiece(null);
        setCurrentBoard(currentBoard + 1);
        return true;
    }

    // TODO show last move by highlighting the two cells

    return (
        <div className="board" ref={boardElement}>
            {
                board.map(([pieceType, team], index) => {
                    const piece = pieceType != null ? {type: pieceType, team} : null;
                    const canEat = cellsCanEat.includes(index);
                    let canMove = false;
                    if (!canEat)
                        canMove = cellsCanMove.includes(index);
                    return (
                        <Cell key={index} index={index} piece={piece} canEat={canEat} canMove={canMove} selectedPiece={selectedPiece} setSelectedPiece={setSelectedPiece} moveSelectedPiece={moveSelectedPiece} />
                    );
                })
            }
        </div>
    );
}

export default Board;