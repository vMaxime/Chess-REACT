export default {
    PieceType: {
        ROOK: 'ROOK',
        KNIGHT: 'KNIGHT',
        BISHOP: 'BISHOP',
        QUEEN: 'QUEEN',
        KING: 'KING',
        PAWN: 'PAWN'
    },

    getDefaultBoard: function() { return [
        // blacks
        [this.PieceType.ROOK, 0], [this.PieceType.KNIGHT, 0], [this.PieceType.BISHOP, 0], [this.PieceType.QUEEN, 0], [this.PieceType.KING, 0], [this.PieceType.BISHOP, 0], [this.PieceType.KNIGHT, 0], [this.PieceType.ROOK, 0],
        ...Array(8).fill([this.PieceType.PAWN, 0]),
        // middle
        ...Array(8).fill([null, null]),
        ...Array(8).fill([null, null]),
        ...Array(8).fill([null, null]),
        ...Array(8).fill([null, null]),
        // whites
        ...Array(8).fill([this.PieceType.PAWN, 1]),
        [this.PieceType.ROOK, 1], [this.PieceType.KNIGHT, 1], [this.PieceType.BISHOP, 1], [this.PieceType.QUEEN, 1], [this.PieceType.KING, 1], [this.PieceType.BISHOP, 1], [this.PieceType.KNIGHT, 1], [this.PieceType.ROOK, 1],
    ]},

    safeGetPieceAt: (board, pos) => (pos < 0 || pos >= board.length ? [null, null] : board[pos]),
    safeGetPieceInRowAt: (board, row, index) => (row < 0 || row > 7 || index < 0 || index > 7 ? [null, null, null] : [...board[row*8+index], row*8+index]),
    safeAddPos: (board, pos, array) => {
        if (pos > 0 && pos < board.length)
            array.push(pos);
    },

    getUseableCells: function (board, piecePosition, currentTeam) {
        const useableCells = [];
        const [pieceType, team] = board[piecePosition];
        if (!pieceType)
            return useableCells;
        if (team != currentTeam)
            return useableCells;
        
        const pieceRow = Math.floor(piecePosition / 8);
        const piecePositionInRow = piecePosition % 8;
        const isWhite = team === 1;

        const frontPos = isWhite ? piecePosition - 8 : piecePosition + 8;
        const [pieceTypeAtFrontPos, pieceTeamAtFrontPos] = this.safeGetPieceAt(board, frontPos);

        switch (pieceType) {
            case this.PieceType.KNIGHT:
                // knight has parallel moves
                for (let side = 1; side >= -1; side -=2) {
                    const row1 = isWhite ? pieceRow - (1 * side) : pieceRow + (1 * side);
                    const row2 = isWhite ? pieceRow - (2 * side) : pieceRow + (2 * side);

                    const [pieceTypeAtLeft1, pieceTeamAtLeft1, piecePosAtLeft1] = this.safeGetPieceInRowAt(board, row1, piecePositionInRow - 2);
                    const [pieceTypeAtLeft2, pieceTeamAtLeft2, piecePosAtLeft2] = this.safeGetPieceInRowAt(board, row2, piecePositionInRow - 1);
                    const [pieceTypeAtRight1, pieceTeamAtRight1, piecePosAtRight1] = this.safeGetPieceInRowAt(board, row1, piecePositionInRow + 2);
                    const [pieceTypeAtRight2, pieceTeamAtRight2, piecePosAtRight2] = this.safeGetPieceInRowAt(board, row2, piecePositionInRow + 1);

                    if (pieceTypeAtLeft1 === null || pieceTeamAtLeft1 != team)
                        this.safeAddPos(board, piecePosAtLeft1, useableCells);
                    if (pieceTypeAtLeft2 === null || pieceTeamAtLeft2 != team)
                        this.safeAddPos(board, piecePosAtLeft2, useableCells);
                    if (pieceTypeAtRight1 === null || pieceTeamAtRight1 != team)
                        this.safeAddPos(board, piecePosAtRight1, useableCells);
                    if (pieceTypeAtRight2 === null || pieceTeamAtRight2 != team)
                        this.safeAddPos(board, piecePosAtRight2, useableCells);
                }
                break;
            case this.PieceType.PAWN:
                if (pieceTypeAtFrontPos === null)
                    this.safeAddPos(board, frontPos, useableCells, useableCells);

                const topLeftPos = isWhite ? piecePosition - 7 : piecePosition + 7;
                const topRightPos = isWhite ? piecePosition - 9 : piecePosition + 9;

                const [pieceTypeAtTopLeftPos, pieceTeamAtTopLeftPos] = this.safeGetPieceAt(board, topLeftPos);
                const [pieceTypeAtTopRightPos, pieceTeamAtTopRightPos] = this.safeGetPieceAt(board, topRightPos);

                if (pieceTypeAtTopLeftPos != null && pieceTeamAtTopLeftPos != team)
                    this.safeAddPos(board, topLeftPos, useableCells);
                if (pieceTypeAtTopRightPos != null && pieceTeamAtTopRightPos != team)
                    this.safeAddPos(board, topRightPos, useableCells);
                break;
            case this.PieceType.ROOK:
            case this.PieceType.QUEEN:
            case this.PieceType.KING:
            case this.PieceType.BISHOP:
                if (pieceType === this.PieceType.KING || pieceType === this.PieceType.QUEEN)
                    for (const cell of this.getUseableCellsAround(board, piecePosition, team))
                        useableCells.push(cell);
                if (pieceType === this.PieceType.ROOK || pieceType === this.PieceType.QUEEN) {
                    // Add cell to useable cells array if it's avalaible and returns true if a piece is on the cell
                    const safeAddPos = this.safeAddPos;
                    const safeAddCellForRook = (row, pos) => {
                        const [pieceType2, pieceTeam2, piecePos2] = this.safeGetPieceInRowAt(board, row, pos);

                        if (pieceType2 === null)
                            safeAddPos(board, piecePos2, useableCells);
                        else {
                            if (pieceTeam2 != team)
                                safeAddPos(board, piecePos2, useableCells);
                            return true;
                        }
                        return false;
                    }
                    // front line
                    for (let row = pieceRow - 1; row >= 0; row--) {
                        if (safeAddCellForRook(row, piecePositionInRow))
                            break;
                    }
                    // back line
                    for (let row = pieceRow + 1; row < 8; row++) {
                        if (safeAddCellForRook(row, piecePositionInRow))
                            break;
                    }
                    // line on piece's left
                    for (let col = piecePositionInRow - 1; col >= 0; col--) {
                        if (safeAddCellForRook(pieceRow, col))
                            break;
                    }
                    // line on piece's right
                    for (let col = piecePositionInRow + 1; col < 8; col++) {
                        if (safeAddCellForRook(pieceRow, col))
                            break;
                    }
                }
                if (pieceType === this.PieceType.QUEEN || pieceType === this.PieceType.BISHOP)
                    for (const cell of this.getUseableDiagonalCells(board, pieceRow, piecePositionInRow, team))
                        useableCells.push(cell);
                break;
            default:
                break;
        }

        return useableCells;
    },

    getCellsByTeam: (board, team=null) => {
        const cells = {};
        for (let pos = 0; pos < board.length; pos++) {
            const [pieceType, pieceTeam] = board[pos];
            if (pieceTeam === team)
                cells[pos] = pieceType;
        }
        return cells;
    }, 

    getKingPosition: function (board, team) {
        return board.find(([type, currentTeam]) => type === this.PieceType.KING && currentTeam === team);
    },

    isKingAttacked: function (board, team) {
        const kingPos = this.getKingPosition(board, team);
    },

    getUseableDiagonalCells: function(board, pieceRow, piecePositionInRow, team) {
        const useableCells = [];
        let someting1OnDiagonal = false;
        let someting2OnDiagonal = false;
        let space = 1;
        for (let row = pieceRow - 1; row >= 0; row--) {
            const [pieceType1OnDiagonal, pieceTeam1OnDiagonal, piecePos1OnDiagonal] = this.safeGetPieceInRowAt(board, row, piecePositionInRow - space);
            const [pieceType2OnDiagonal, pieceTeam2OnDiagonal, piecePos2OnDiagonal] = this.safeGetPieceInRowAt(board, row, piecePositionInRow + (space++));
            
            if (!someting1OnDiagonal && (pieceType1OnDiagonal === null || pieceTeam1OnDiagonal != team))
                this.safeAddPos(board, piecePos1OnDiagonal, useableCells)
            if (!someting2OnDiagonal && (pieceType2OnDiagonal === null || pieceTeam2OnDiagonal != team))
                this.safeAddPos(board, piecePos2OnDiagonal, useableCells)

            if (pieceType1OnDiagonal != null)
                someting1OnDiagonal = true;
            if (pieceType2OnDiagonal != null)
                someting2OnDiagonal = true;
        }
        space = 1;
        someting1OnDiagonal = false;
        someting2OnDiagonal = false;
        for (let row = pieceRow + 1; row < 8; row++) {
            const [pieceType1OnDiagonal, pieceTeam1OnDiagonal, piecePos1OnDiagonal] = this.safeGetPieceInRowAt(board, row, piecePositionInRow - space);
            const [pieceType2OnDiagonal, pieceTeam2OnDiagonal, piecePos2OnDiagonal] = this.safeGetPieceInRowAt(board, row, piecePositionInRow + (space++));
            
            if (!someting1OnDiagonal && (pieceType1OnDiagonal === null || pieceTeam1OnDiagonal != team))
                this.safeAddPos(board, piecePos1OnDiagonal, useableCells)
            if (!someting2OnDiagonal && (pieceType2OnDiagonal === null || pieceTeam2OnDiagonal != team))
                this.safeAddPos(board, piecePos2OnDiagonal, useableCells)

            if (pieceType1OnDiagonal != null)
                someting1OnDiagonal = true;
            if (pieceType2OnDiagonal != null)
                someting2OnDiagonal = true;
        }
        return useableCells;
    },

    getCellsAround: (piecePosition) => {
        const cells = [];
        const pieceRow = Math.floor(piecePosition / 8);
        const piecePosInRow = piecePosition % 8;
        for (let i = 0; i < 3; i++) {
            const row = (pieceRow + 1) - i;
            if (row < 0 || row > 7)
                continue;
            for (let x = 0; x < 3; x++) {
                const pos = piecePosInRow - 1 + x;
                if (pos >= 0 && pos < 8)
                    cells.push((row % 8) * 8 + (pos));
            }
        }
        return cells;
    },

    getUseableCellsAround: function(board, piecePosition, team) {
        return this.getCellsAround(piecePosition).filter(pos => {
            const [pieceType, pieceTeam] = this.safeGetPieceAt(board, pos)
            return pieceType === null || pieceTeam != team;
        });
    },

    getLastPiecePosition: function (boards, currentBoardIndex, piecePosition) {
        // for (let i = currentBoardIndex - 1; i >= 0; i--) {
        //     if (boards[i][])
        // }
        // return piecePosition;
    }
}