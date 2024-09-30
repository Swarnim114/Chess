var Knight = function(config, board) {
    this.type = 'knight';
    this.board = board; // Store a reference to the board
    this.constructor(config);
};

Knight.prototype = new Piece({});

Knight.prototype.isValidMove = function(targetPosition) {
    let currentCol = this.position.charAt(0);
    let currentRow = parseInt(this.position.charAt(1));

    let colDiff = Math.abs(targetPosition.col.charCodeAt(0) - currentCol.charCodeAt(0));
    let rowDiff = Math.abs(parseInt(targetPosition.row) - currentRow);

    // Knight moves in an L-shape: 2 squares in one direction and 1 square perpendicular to that
    if ((colDiff === 2 && rowDiff === 1) || (colDiff === 1 && rowDiff === 2)) {
        let pieceAtTarget = this.board.getPieceAt(targetPosition);
        if (!pieceAtTarget) {
            return true; // Empty square, valid move
        } else if (pieceAtTarget.color !== this.color) {
            return 'capture'; // Capture opponent's piece
        }
    }

    console.warn("Invalid move for knight");
    return false;
};

Knight.prototype.moveTo = function(targetPosition) {
    const result = this.isValidMove(targetPosition);
    if (result === true) {
        // Move the knight to the new position
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    } else if (result === 'capture') {
        // Capture the piece and move
        let pieceToCapture = this.board.getPieceAt(targetPosition);
        if (pieceToCapture) {
            pieceToCapture.kill();
        }
        this.position = targetPosition.col + targetPosition.row;
        this.render();
        return true;
    }
    return false; // Invalid move
};

Knight.prototype.kill = function() {
    if (this.$el && this.$el.parentNode) {
        this.$el.parentNode.removeChild(this.$el);
    }
    this.position = null;
};
