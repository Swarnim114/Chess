var Rook = function(config, board) {
    this.type = 'rook';
    this.board = board; 
    this.constructor(config); 
};

Rook.prototype = new Piece({});

// Validate Rook's move
Rook.prototype.isValidMove = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    let targetCol = targetPosition.col;
    let targetRow = parseInt(targetPosition.row);

    if (currentRow !== targetRow && currentCol !== targetCol) {
        console.warn("Invalid move for rook: Not a straight line move");
        return false;
    }

    if (currentRow === targetRow) { // Horizontal movement
        let step = (targetCol.charCodeAt(0) > currentCol.charCodeAt(0)) ? 1 : -1;
        for (let col = currentCol.charCodeAt(0) + step; col !== targetCol.charCodeAt(0); col += step) {
            let pieceOnPath = this.board.getPieceAt({
                col: String.fromCharCode(col),
                row: currentRow.toString()
            });
            if (pieceOnPath) {
                console.warn("Invalid move for rook: Piece blocking path");
                return false;
            }
        }
    } else { // Vertical movement
        let step = (targetRow > currentRow) ? 1 : -1;
        for (let row = currentRow + step; row !== targetRow; row += step) {
            let pieceOnPath = this.board.getPieceAt({
                col: currentCol,
                row: row.toString()
            });
            if (pieceOnPath) {
                console.warn("Invalid move for rook: Piece blocking path");
                return false; 
            }
        }
    }

    // Check if the target position is occupied by an opponent's piece
    let pieceAtTarget = this.board.getPieceAt(targetPosition);
    if (pieceAtTarget && pieceAtTarget.color === this.color) {
        console.warn("Invalid move for rook: Cannot capture own piece");
        return false; 
    } else if (pieceAtTarget && pieceAtTarget.color !== this.color) {
        return 'capture'; 
    }

    return true; 
};

// Move the rook to a target position
Rook.prototype.moveTo = function(targetPosition) {
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
Rook.prototype.kill = function() {
    if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el); 
    }
    this.position = null;
};
