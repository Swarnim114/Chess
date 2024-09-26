var Queen = function(config, board) {
    this.type = 'queen';
    this.board = board;
    this.constructor(config);
};

Queen.prototype = new Piece({});

// Validate Queen's move (combining rook and bishop movement logic)
Queen.prototype.isValidMove = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    let colDiff = Math.abs(currentCol.charCodeAt(0) - targetCol.charCodeAt(0));
    let rowDiff = Math.abs(currentRow - targetRow);

    // Queen can move either straight (like a rook) or diagonally (like a bishop)
    if (currentCol !== targetCol && currentRow !== targetRow && colDiff !== rowDiff) {
        console.warn("Invalid move for queen: Neither straight nor diagonal");
        return false;
    }

    // Horizontal (like a rook)
    if (currentRow === targetRow) {
        let step = (targetCol.charCodeAt(0) > currentCol.charCodeAt(0)) ? 1 : -1;
        for (let col = currentCol.charCodeAt(0) + step; col !== targetCol.charCodeAt(0); col += step) {
            let pieceOnPath = this.board.getPieceAt({
                col: String.fromCharCode(col),
                row: currentRow.toString()
            });
            if (pieceOnPath) {
                console.warn("Invalid move for queen: Piece blocking horizontal path");
                return false;
            }
        }
    }

    // Vertical (like a rook)
    else if (currentCol === targetCol) {
        let step = (targetRow > currentRow) ? 1 : -1;
        for (let row = currentRow + step; row !== targetRow; row += step) {
            let pieceOnPath = this.board.getPieceAt({
                col: currentCol,
                row: row.toString()
            });
            if (pieceOnPath) {
                console.warn("Invalid move for queen: Piece blocking vertical path");
                return false;
            }
        }
    }

    // Diagonal (like a bishop)
    else if (colDiff === rowDiff) {
        let colStep = (targetCol.charCodeAt(0) > currentCol.charCodeAt(0)) ? 1 : -1;
        let rowStep = (targetRow > currentRow) ? 1 : -1;

        for (let i = 1; i < colDiff; i++) {
            let pieceOnPath = this.board.getPieceAt({
                col: String.fromCharCode(currentCol.charCodeAt(0) + i * colStep),
                row: (currentRow + i * rowStep).toString()
            });
            if (pieceOnPath) {
                console.warn("Invalid move for queen: Piece blocking diagonal path");
                return false;
            }
        }
    }

    // Check if the target position is occupied by an opponent's piece
    let pieceAtTarget = this.board.getPieceAt(targetPosition);
    if (pieceAtTarget && pieceAtTarget.color === this.color) {
        console.warn("Invalid move for queen: Cannot capture own piece");
        return false;
    } else if (pieceAtTarget && pieceAtTarget.color !== this.color) {
        return 'capture';
    }

    return true;
};

// Move the queen to a target position
Queen.prototype.moveTo = function(targetPosition) {
    const result = this.isValidMove(targetPosition);
    if (result === true) {
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    } else if (result === 'capture') {
        let pieceToCapture = this.board.getPieceAt(targetPosition);
        if (pieceToCapture) {
            pieceToCapture.kill();
        }
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    }
    return false;
};

// Handle the capture of a piece
Queen.prototype.kill = function() {
    if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
    }
    this.position = null;
};
