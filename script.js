const Player = (name, symbol, isHuman) => {
    const getName = () => name;
    const getSymbol = () => symbol;


    return { getName };
}

const Ai = (symbol) => {

}

const GameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];
    const getBoard = () => board;
    const createBoard = () => {
        const boardDisplay = document.querySelector(".board");
        //boardDisplay.innerHTML = "";
        for (let i = 0; i < 9; i++) {
            var cell = document.createElement("div");
            cell.className = "cell";
            cell.id = i;
            cell.gridArea = String.fromCharCode(97 + i);
            boardDisplay.appendChild(cell)
        }
    }
    const displayChoice = (cellId, symbol) => {
        const cell = document.getElementById(cellId);
        cell.textContent = symbol;
    };

    return { getBoard, createBoard, displayChoice }
})();


const Game = (() => {
    const startGame = () => {
        GameBoard.createBoard();
    }
    function makeChoice(cell) {
        console.log(cell.target)
    }

    const p1 = Player("","X",true);
    console.log()
    const cells = Array.from(document.getElementsByClassName("cell"));
    cells.forEach(cell => cell.addEventListener("click", makeChoice()))

    return { startGame }
})();

Game.startGame();