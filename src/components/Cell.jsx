import Piece from './Piece';

function Cell({ index, piece, canEat, canMove, selectedPiece, setSelectedPiece, moveSelectedPiece }) {

    const handleClick = e => {
        if (canEat || canMove)
            moveSelectedPiece(index);
        else if (piece != null)
            setSelectedPiece(index);
    };

    const rowOfCell = Math.floor(index / 8);
    const cellType =  rowOfCell % 2 ? (index % 2 ? 'white' : 'black') : (index % 2 ? 'black' : 'white');

    return (
        <div className={'cell ' + cellType + (selectedPiece === index ? ' active' : '') + (canEat ? ' canEat' : (canMove ? ' canMove' : ''))} onClick={handleClick}>
            {
                piece != null ?
                <Piece type={piece.type} team={piece.team} />
                : null
            }
        </div>
    );
}

export default Cell;