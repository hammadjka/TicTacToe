function Player (){
    let score = 0;
    let character = "";
    const incrementScore = () => score++; 
    const getScore = () => score;
    const getCharacter = () => character;
    const setCharacter = (ch) => character  = ch;
    const playerReset = () => {
        score = 0;
        character = "";
    }
    return {incrementScore, getCharacter, setCharacter, getScore, playerReset};
}
const gameBoard = (function(){
    let boardArr = [" "," "," "," "," "," "," "," "," "];

    const updateBoardArray = (pos, char) => {
        if(pos < 9 && pos >= 0 && boardArr[pos] == " " ){
            boardArr[pos] = char;
            return 1;
        }
        return 0;
    }
    const printBoardArray = () => {
        let line = ""
        for(let i=1; i<10; i++){
            if(boardArr[i-1]==" "){
                line += i;
            }
            else{
                line += boardArr[i-1];
            }
            if(i%3 == 0){
                console.log(line);
                line = "";
            }
        }
    }
    const resetBoardArr = () => {
        for(let i=0; i<9; i++){
            boardArr[i] = " ";
        }
    }
    const getRows = () => [[boardArr[0],boardArr[1],boardArr[2]], [boardArr[3],boardArr[4],boardArr[5]], [boardArr[6],boardArr[7],boardArr[8]]];
    const getColumns = () => [[boardArr[0],boardArr[3],boardArr[6]], [boardArr[1],boardArr[4],boardArr[7]], [boardArr[2],boardArr[5],boardArr[8]]];
    const getDiagnols = () => [[boardArr[0],boardArr[4],boardArr[8]], [boardArr[2],boardArr[4],boardArr[6]], [boardArr[2],boardArr[4],boardArr[6]]];
    const getBoardArr = () => boardArr;
    return{updateBoardArray, getColumns, getRows, getDiagnols, resetBoardArr};
        
})();
const game = (function(){
    const p1 = Player();
    const p2 = Player();
    let currPlayer = p1;
    const selectPlayer = (char, playerNumber)=>{
        if(playerNumber == 1 && p1.getCharacter() != char && p2.getCharacter() != char){
            p1.setCharacter(char);
            display.selection(char, playerNumber);
        }
        else if(playerNumber == 2 && p2.getCharacter() != char && p1.getCharacter() != char){ 
            p2.setCharacter(char);
            display.selection(char, playerNumber);
        }
    }
    const makeMove = (move) =>{
        let [seq, end] = results();
        if(end != 0 || p1.getCharacter() == "" || p2.getCharacter() == "" || !gameBoard.updateBoardArray(move - 1, currPlayer.getCharacter())){
            return;
        };
        [seq, end] = results();
        console.log(currPlayer.getCharacter());
        display.board(move, currPlayer.getCharacter());

        if (currPlayer == p1){
            currPlayer = p2;
        }
        else{
            currPlayer = p1;
        }

        if(end == 1){
            p1.incrementScore();
            display.winScreen(seq, p1.getCharacter(), p1.getScore(), p2.getScore());
        }
        else if(end == 2){
            p2.incrementScore();
            display.winScreen(seq, p2.getCharacter(), p1.getScore(), p2.getScore());
        }
        else if(end == 3){
            display.endScreen();
        }
    }

    const checkWin = (tiles, character) => {
        return tiles.every(element => element === character);
    }
    const winSequence = (direction, skip) => {
        if(direction == "row"){
            return [1,2,3].map(num => num + skip*3);
        }
        else if(direction == "col"){
            return [1,4,7].map(num => num + skip);
        }
        else{
            if(skip < 1){
                return [1,5,9];
            }
            return [3,5,7];
        }
    }
    const results = () => {
        let drawnRowCount = 0;
        for(let i =0; i<3; i++){
            let row = gameBoard.getRows()[i];
            let col = gameBoard.getColumns()[i];
            let diag = gameBoard.getDiagnols()[i];

            if(checkWin(row, p1.getCharacter())) {return [winSequence("row", i), 1];}
            else if(checkWin(col, p1.getCharacter())) {return [winSequence("col", i), 1];} 
            else if(checkWin(diag, p1.getCharacter())){return [winSequence("diag", i), 1];}

            else if(checkWin(row, p2.getCharacter())) {return [winSequence("row", i), 2];}
            else if(checkWin(col, p2.getCharacter())) {return [winSequence("col", i), 2];} 
            else if(checkWin(diag, p2.getCharacter())){return [winSequence("diag", i), 2];}

            else if(!row.includes(" ")){drawnRowCount++;}
        }
        if (drawnRowCount == 3){
            return [null, 3]
        }
        return [null, 0];
    }
    const cont = () => {
        currPlayer = p1;
        gameBoard.resetBoardArr();
        display.continueGame();
    }
    const quit = ()=>{
        p1.playerReset();
        p2.playerReset();
        currPlayer = p1;
        gameBoard.resetBoardArr();
        display.quitGame();
    }
    return{makeMove, selectPlayer, cont, quit};

})();

const display = (function(){
    const selection = (id, dataValue) => {
        let buttons = document.querySelectorAll('.character');
        buttons.forEach((button) => {
            if (button.id != id && button.getAttribute("data-value") == dataValue ||
                button.id == id && button.getAttribute("data-value") != dataValue) {
                button.style.opacity = 0.5;
            }
            if(button.getAttribute("data-value") == dataValue || button.id == id){
                button.classList.remove("hover");   
            }
        });
    }
    const board = (cellValue, character) => {
        let cell = document.querySelector('.cell' + '[data-value="' + cellValue + '"]');
        cell.classList.remove("clickable");
        cell.style.background = "transparent url(Resources/Chars/" + character + ".svg)"
    }

    const winScreen = (sequence, character, p1Score, p2Score)=>{
        if(sequence == null){
            return;
        }
        let cells = document.querySelectorAll('.cell');
        cells.forEach((cell) =>{
            cell.classList.remove("clickable");
            if(sequence.includes(parseInt(cell.getAttribute("data-value")))){
                cell.style.background = "black url(Resources/Chars/" + character + "-end.svg)"
            }
        })
        document.getElementById("player1Wins").textContent = "Wins: " + p1Score;
        document.getElementById("player2Wins").textContent = "Wins: " + p2Score;
        endScreen();
    }
    const endScreen = ()=>{
        let endBtns = document.querySelector("#endButtons");
        endBtns.style.display = 'flex';
    }

    const continueGame = ()=>{
        let cells = document.querySelectorAll('.cell');
        cells.forEach((cell) =>{
            cell.classList.add("clickable");
            cell.style.background = "transparent";
        })
        let endBtns = document.querySelector("#endButtons");
        endBtns.style.display = 'none';
    }
    const quitGame = ()=>{
        document.getElementById("player1Wins").textContent = "Wins: 0";
        document.getElementById("player2Wins").textContent = "Wins: 0";
        let buttons = document.querySelectorAll('.character');
        buttons.forEach((button) => {
            button.style.opacity = 1;
            button.classList.add("hover");   
        });
        continueGame();
    }

    return{selection, board, winScreen, endScreen, continueGame, quitGame};
})();

document.querySelectorAll(".character").forEach(function(element) {
    element.addEventListener('click', function(e) {
        game.selectPlayer(e.target.id, e.target.getAttribute("data-value"));
    });
});

document.querySelectorAll(".cell").forEach(function(element) {
    element.addEventListener('click', function(e) {
        console.log("sending movedata");
        game.makeMove(e.target.getAttribute("data-value"));
    });
});

document.querySelector("#continue").addEventListener('click', game.cont);
document.querySelector("#quit").addEventListener('click', game.quit);
