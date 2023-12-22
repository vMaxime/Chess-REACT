import Cell from "./Cell";
import chess from "../chess";
import Modal from "./Modal";
import { useEffect, useRef, useState } from "react";

function Board() {
    const [boards, setBoards] = useState([chess.getLackOfEquipmentBoard()]);
    const [currentBoard, setCurrentBoard] = useState(0);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [winner, setWinner] = useState(null);
    const boardElement = useRef();

    const board = boards[currentBoard];
    const currentTeam = currentBoard % 2 === 0 ? 1 : 0;
    const enemyTeam = currentTeam === 0 ? 1 : 0;
    const [selectedPieceType, selectedPieceTeam] = selectedPiece != null ? board[selectedPiece] : [null, null];
    let cellsCanMove = [];
    let cellsCanEat = [];

    if (selectedPieceTeam != null && selectedPieceTeam === currentTeam && winner === null) {
        const kingPosition = chess.getKingPosition(board, currentTeam);
        let useableCells = chess.getUseableCells(board, selectedPiece, currentTeam);
        cellsCanMove = useableCells.filter(cell => board[cell][0] === null);
        cellsCanEat = useableCells.filter(cell => board[cell][1] != null && board[cell][1] != selectedPieceTeam);
        // for each useable cell, check if the king won't be attacked
        for (const pos of [...cellsCanMove, ...cellsCanEat]) {
            const tempBoard = [...board];
            tempBoard[pos] = [selectedPieceType, selectedPieceTeam];
            tempBoard[selectedPiece] = [null, null];
            if (
                chess.getUseableCellsByTeam(tempBoard, enemyTeam).includes(selectedPieceType === chess.PieceType.KING ? pos : kingPosition)
            ) {
                cellsCanMove = cellsCanMove.filter(pos2 => pos2 != pos);
                cellsCanEat = cellsCanEat.filter(pos2 => pos2 != pos);
            }
        }
    }

    const handleChangeCurrentBoard = e => {
        if (e.code === 'ArrowLeft' && currentBoard > 0) {
            setCurrentBoard(currentBoard - 1);
            setSelectedPiece(null);
        }
        else if (e.code === 'ArrowRight' && currentBoard < boards.length - 1) {
            setCurrentBoard(currentBoard + 1);
            setSelectedPiece(null);
        }
    }

    useEffect(() => {
        const board = boards[currentBoard];
        const currentTeam = currentBoard % 2 === 0 ? 1 : 0;
        const enemyTeam = currentTeam === 0 ? 1 : 0;

        const enemyUseableCells = chess.getUseableCellsByTeam(board, enemyTeam);
        const kingPosition = chess.getKingPosition(board, currentTeam);
        const kingAttacked = enemyUseableCells.includes(kingPosition);

        // for each move, if the king is not attacked then it's a useable cell for the current team.
        let useableCells = [];
        for (const [piecePos, pieceType] of Object.entries(chess.getCellsByTeam(board, currentTeam))) {
            for (const pieceUseableCell of chess.getUseableCells(board, piecePos, currentTeam)) {
                const tempBoard = [...board];
                tempBoard[piecePos] = [null, null];
                tempBoard[pieceUseableCell] = [pieceType, currentTeam];
                // not using variable kingPosition cause the current move could be the king and it avoids king moving on a protected cell
                if (!chess.getUseableCellsByTeam(tempBoard, enemyTeam).includes(chess.getKingPosition(tempBoard, currentTeam)))
                    useableCells = [...useableCells, pieceUseableCell];
            }
        }

        const alivePieces = chess.getAlivePieces(board, currentTeam);
        const enemyAlivePieces = chess.getAlivePieces(board, enemyTeam);
        if (kingAttacked && !useableCells.length) {
            setWinner(enemyTeam);
        } else if (
            // lack of equipment
            chess.lackOfEquipment(alivePieces, enemyAlivePieces)
            ||
            // pat
            (!useableCells.length && alivePieces.length === 1 && alivePieces[0] === chess.PieceType.KING)
        ) {
            // draw
            setWinner(-1);
        } else {
            // game still running
            setWinner(null);
        }
        
        document.addEventListener('keydown', handleChangeCurrentBoard);
        return () => document.removeEventListener('keydown', handleChangeCurrentBoard);
    }, [currentBoard]);

    const moveSelectedPiece = to => {
        if (!cellsCanMove.includes(to) && !cellsCanEat.includes(to))
            return false;
        const newBoard = [...board];
        newBoard[selectedPiece] = [null, null];
        newBoard[to] = board[selectedPiece];
        setBoards([...boards, newBoard]);
        setSelectedPiece(null);
        setCurrentBoard(currentBoard + 1);
        return true;
    }

    const lastMoves = chess.getLastMove(boards, currentBoard);

    return (
        <div className="board" ref={boardElement}>
            {
                board.map(([pieceType, team], index) => {
                    const piece = pieceType != null ? {type: pieceType, team} : null;
                    const canEat = cellsCanEat.includes(index);
                    let canMove = false;
                    if (!canEat)
                        canMove = cellsCanMove.includes(index);
                    const active = lastMoves.includes(index) || selectedPiece === index;
                    return (
                        <Cell key={index} index={index} piece={piece} canEat={canEat} canMove={canMove} active={active} setSelectedPiece={setSelectedPiece} moveSelectedPiece={moveSelectedPiece} />
                    );
                })
            }
            <Modal visible={winner != null} winner={winner} key={'modal'} />
        </div>
    );
}

export default Board;