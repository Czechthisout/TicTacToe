const displayController = (() => {
    const renderMessage = (message) => {
        document.querySelector("#message").innerHTML = message;
    }
    return {
        renderMessage
    }
})();

const Gameboard = (() => {
    let gameboard = ["","","","","","","","",""]

    const render = () => {
        let boardHTML = "";
        gameboard.forEach((square, index)=> {
            boardHTML += `<div class="square" id="square-${index}">${square}</div>`
        })
        document.querySelector("#gameboard").innerHTML = boardHTML;
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", Game.handleClick);
        })
    } 

    const update = (index, value) => {
        gameboard[index] = value;
        render();
    };

    const getGameboard = () => gameboard;

    return {
        render,
        update,
        getGameboard,
    }
})();

const createPlayer = (name, emoji) => {
    return {
        name,
        mark: emoji
    }
}

const Game = (() => {
    let players = [];
    let currentPlayerIndex;
    let gameOver;

    const start = () => {
        const playerOneEmoji = document.querySelector("#emojiOne").value;
        const playerTwoEmoji = document.querySelector("#emojiTwo").value;
        
        if (playerOneEmoji === playerTwoEmoji) {
            alert("Each player must choose a unique emoji.");
            return;
        }
        
        players = [
            createPlayer(document.querySelector("#playerOne").value, playerOneEmoji),
            createPlayer(document.querySelector("#playerTwo").value, playerTwoEmoji)
        ]
        currentPlayerIndex = 0;
        gameOver = false;
        Gameboard.render();
        const squares = document.querySelectorAll(".square");
        squares.forEach((square) => {
            square.addEventListener("click", handleClick);
        })
        document.querySelector("#playerOne").classList.add("green-text");
    }

    const restart = () => {
        for (let i=0; i<9; i++){
            Gameboard.update(i,"");
        }
        Gameboard.render();
        gameOver=false;
        displayController.renderMessage(`""`)

    }

    const handleClick = (event) => {
        if (gameOver) {
            alert("The game is over. Please restart the game to play again.");
            return;
        }
        
        let index = parseInt(event.target.id.split("-")[1]);
        if(Gameboard.getGameboard()[index] !== "")
            return;
    
        Gameboard.update(index, players[currentPlayerIndex].mark);

        if (checkForWin(Gameboard.getGameboard(), players[currentPlayerIndex].mark)) {
            gameOver = true;
            displayController.renderMessage(`${players[currentPlayerIndex].name} won`)
        } else if (checkForTie(Gameboard.getGameboard())){
            gameOver = true;
            displayController.renderMessage(`Its a tie!`)
        }

        if (currentPlayerIndex === 0) {
            document.querySelector("#playerOne").classList.add("green-text");
            document.querySelector("#playerTwo").classList.remove("green-text");
        } else {
            document.querySelector("#playerTwo").classList.add("green-text");
            document.querySelector("#playerOne").classList.remove("green-text");
        }

        currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
    }

    return{
        start,
        handleClick,
        restart
    }
})();

function checkForWin(board) {
    const winningCombinations = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [0,4,8],
        [1,4,7],
        [2,5,8],
        [2,4,6]
    ]
    for(let i=0; i<winningCombinations.length; i++) {
        const [a, b, c] = winningCombinations[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]){
            return true;
        }
    }
    return false;
}

function checkForTie(board) {
    return board.every(cell => cell !== "");
}

const restartButton = document.querySelector("#restart-button");
restartButton.addEventListener("click", () => {
    Game.restart();
})

const startButton = document.querySelector("#start-button");
startButton.addEventListener("click", () => {
    Game.start();
})