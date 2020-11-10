const GameBoard = (() => {
    let gameBoard;
    const getBoard = () => gameBoard;
    const createBoard = () => {
        gameBoard = ["", "", "", "", "", "", "", "", ""];
        const boardDisplay = document.querySelector(".board");
        boardDisplay.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.id = i;
            cell.gridArea = String.fromCharCode(97 + i);
            boardDisplay.appendChild(cell);
        }
    }
    const displayChoice = (cellId, symbol) => {
        gameBoard[cellId] = symbol;
        const cell = document.getElementById(cellId);
        cell.textContent = symbol;
    };

    const checkTie = (board = gameBoard) => {
        let cellsOccupied = board.filter(cell => cell !== "");
        if (cellsOccupied.length >= 9) return true;
        return false;
    }

    const checkWin = (board = gameBoard) => {
        //check for win vertically
        for (let i = 0; i < 3; i++) {
            if (!!board[i] && board[i] === board[i + 3] && board[i] === board[i + 6]) {
                return board[i];
            }
        }
        //check for win horizontally
        for (let i = 0; i < 8; i += 3) {
            if (!!board[i] && board[i] === board[i + 1] && board[i] === board[i + 2]) {
                return board[i];
            }
        }
        //check for win on diagonals
        if (!!board[4] && board[0] === board[4] && board[8] === board[4]) {
            return board[4];
        }
        if (!!board[4] && board[6] === board[4] && board[2] === board[4]) {
            return board[4];
        }
    }

    const checkCell = (cellId) => {
        return gameBoard[cellId];
    }

    return { getBoard, createBoard, displayChoice, checkCell, checkTie, checkWin }
})();

//Game module
const Game = (() => {
    let gameState = "playing"
    //Player factory function
    const Player = (name, symbol) => {
        const getName = () => name;
        const getSymbol = () => symbol;


        return { getName, getSymbol };
    }

    //AI factory function
    const Ai = (symbol) => {
        const getName = () => "Computer";
        const getSymbol = () => symbol;
        const selectCell = () => {
            let bestScore = -Infinity;
            let bestMove;

            for (let i = 0; i < 9; i++) {
                if (GameBoard.checkCell(i) == "") {
                    const gameboard = GameBoard.getBoard();
                    gameboard[i] = "O";
                    let score = minimax(gameboard, 0, false);
                    gameboard[i] = "";
                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = i;
                    }
                }
            }
            setTimeout(function() {
                makeChoice(bestMove);
              }, 600);
        }
        function minimax(board, depth, isMaximizing) {
            let bestScore;
            let winner = GameBoard.checkWin(board);
            if (winner === "O") {
                return 100 - depth;
            }
            else if (winner === "X") {
                return -100 + depth;
            } else if (GameBoard.checkTie(board)) {
                return 0;
            }
            if (GameBoard.checkTie(board)) console.log("S");
            if (isMaximizing) {
                bestScore = -Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === "") {
                        board[i] = "O";
                        let score = minimax(board, depth + 1, false);
                        board[i] = "";
                        bestScore = Math.max(score, bestScore);
                    }
                }
                return bestScore;
            } else {
                bestScore = Infinity;
                for (let i = 0; i < 9; i++) {
                    if (board[i] === "") {
                        board[i] = "X";
                        let score = minimax(board, depth + 1, true);
                        board[i] = "";
                        bestScore = Math.min(score, bestScore);
                    }
                }
                return bestScore;
            }
        }
        return { getName, getSymbol, selectCell }
    };


    const playAi = true;
    const symbols = ["X", "O"];
    let currTurn = 0;
    const players = [];
    //players[0] = Player(prompt("Enter name"), symbols[0], true)
    players[0] = Player("Player", symbols[0], true)
    if (playAi) {
        players[1] = Ai("O");
    } else {
        players[1] = Player(prompt("Enter name"), symbols[1], true)
    }
    const startGame = () => {
        GameBoard.createBoard();
        const cells = Array.from(document.getElementsByClassName("cell"));
        cells.forEach(cell => cell.addEventListener("click", Game.makeChoice));
        const startBtn = document.getElementById("start");
        startBtn.textContent = "Restart";
        gameState = "playing"
    }
    function makeChoice(e) {
        let choice;
        if (Number.isInteger(e)) {
            choice = e;
        }
        else {
            if (playAi && currTurn == 1) return
            choice = e.target.id;
        }
        if (GameBoard.checkCell(choice) === "") {
            GameBoard.displayChoice(choice, symbols[currTurn]);
            currTurn = (currTurn + 1) % 2; //alternate between 0 and 1
            if (playAi && currTurn == 1) {
                players[currTurn].selectCell()
            };
        }
        if (gameState == "playing") checkStatus();
    }

    function checkStatus() {
        let winner = GameBoard.checkWin();
        if (!!winner) {
            alert(players[symbols.indexOf(winner)].getName() + " wins!")
            gameState = "ended";
        }
        else if
            (GameBoard.checkTie()) {
            alert("tie");
            gameState = "ended";
        }
    }
    return { startGame, makeChoice }
})();

function start() {
    Game.startGame();
}
