let statusText = document.querySelector("#status");
let restartBtn = document.querySelector("#restartBtn")
let container = document.getElementById('CellContainer');
let close = document.getElementById('close');
let play = document.getElementById('play');
let form = document.getElementById("header");
let currentPlayer = "X";
let running = false;
let options = [];
let winConditions = [];
let sizeValue;
let timerInterval;
let seconds = 0;
let minutes = 0;
let order = 1;
let story = '';


form.addEventListener("submit", function (evt) {
    evt.preventDefault();
    order = 1;
    story = '';
    sizeValue = document.getElementById("size").value;
    restartGame()
    for (let i = 0; i < (sizeValue * sizeValue); ++i) { // initialising options
        options.push("");
    }
    createBorder(sizeValue);
    initializeGame()

})

function setTimer() {
    timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
    clearInterval(timerInterval)
}

function updateTimer() {
    seconds++;
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    if (seconds >= sizeValue) {
        stopTimer();
        running = false;
        statusText.textContent = `${currentPlayer == "O" ? "Time out 🕑, X wins!" : "Time out 🕑, O wins!"}`
        setTimeout(() => results(), 2000)
    }
    let updateTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (currentPlayer === "X") {
        document.getElementById('timer1').textContent = `X | ${updateTime}`;
    } else {
        document.getElementById('timer2').textContent = `${updateTime} | O`;
    }
}

function createBorder(size) {
    let res = []; // initialising win conditions
    let rows = [];
    let columns = [];
    let diagonals = [];
    let step = [];
    let count = 0;
    for (let i = 0; i < size * size; ++i) {
        step.push(i);
        ++count;
        if (count == size) {
            rows.push(step);
            step = [];
            count = 0;
        }
    }
    for (let i = 0; i < rows.length; ++i) {
        for (let j = 0; j < rows.length; ++j) {
            step.push(rows[j][i]);
        }
        columns.push(step);
        step = [];
    }
    for (let i = 0; i < rows.length; ++i) {
        step.push(rows[i][i]);
    }
    diagonals.push(step);
    step = [];
    for (let i = 0; i < rows.length; ++i) {
        step.push(rows[i][rows.length - 1 - i]);
    }
    diagonals.push(step);
    winConditions.push(...rows, ...columns, ...diagonals);

    container.style = `grid-template-columns: repeat(${size}, auto)`; // getting border's style
    if (size < 2 || size > 8) {               // checking validiation of input number
        alert("size must be more than 2 and less than 8");
    } else {
        for (let i = 0; i < size * size; ++i) {
            const div = document.createElement('div');
            div.className = "cell";
            div.setAttribute('cellIndex', `${i}`);
            container.appendChild(div);
        }
    }
}

function initializeGame() {
    setTimer();
    const cells = document.querySelectorAll(".cell");
    cells.forEach(cell => cell.addEventListener("click", cellClicked));
    restartBtn.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    let cellIndex = this.getAttribute('cellIndex');
    let letter;
    let number;
    let mat = [];
    let count = 0;
    for (let i = 0; i < sizeValue; ++i) {
        let step = [];
        for (let j = 0; j < sizeValue; ++j) {
            step.push(count++);
        }
        mat.push(step);
    }
    for (let i = 0; i < mat.length; ++i) {
        for (let j = 0; j < mat.length; ++j) {
            if (mat[i][j] == cellIndex) {
                number = i;
                switch (j) {
                    case 0: letter = 'A'; break;
                    case 1: letter = 'B'; break;
                    case 2: letter = 'C'; break;
                    case 3: letter = 'D'; break;
                    case 4: letter = 'E'; break;
                    case 5: letter = 'F'; break;
                    case 6: letter = 'G'; break;
                    case 7: letter = 'H'; break;
                }
            }
        }
    }
    if (options[cellIndex] != "" || !running) { // ete tvyal cell-um exav arjeq kam running-y exav false, ban mi ara
        return;
    }
    story += `${order++}📌 ${currentPlayer} | ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} | ${letter} ${number}<br>`;
    stopTimer();
    seconds = 0;
    minutes = 0;
    setTimer();
    updateCell(this, cellIndex);
    checkWinner();
}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s turn`;
}

function checkWinner() {
    let smbWon = false;
    lable: for (let i = 0; i < winConditions.length; ++i) {
        let currentCells = [];
        for (let j = 0; j < winConditions[i].length; ++j) {
            currentCells.push(options[winConditions[i][j]]);
        }
        if (currentCells.some((el) => el === "")) {
            continue;
        }
        if ((currentCells.every((el) => el === "X")) || (currentCells.every(el => el === 'O'))) {
            smbWon = true;
            break lable;
        }
    }
    if (smbWon) {

        statusText.textContent = `${currentPlayer} wins!`;
        running = false;
        stopTimer();
        // setTimeout(function() {
        //     location.reload();
        // }, 4000)
        // running = false;
        setTimeout(() => results(), 2000);
    } else if (!options.includes("")) {
        statusText.textContent = `Draw!`;
        running = false;
        stopTimer();
        setTimeout(() => results(), 2000);
    } else {
        changePlayer();
    }
}

function restartGame() {
    history = '';
    order = 1;
    currentPlayer = "X";
    winConditions = [];
    options = [];
    container.innerHTML = "";
    statusText.textContent = "";
    running = true;
    stopTimer();
    seconds = 0;
    minutes = 0;
    document.getElementById('timer1').textContent = `X | 00:00`;
    document.getElementById('timer2').textContent = `00:00 | O`;
}

function results() {
    let result = document.getElementById('resultDiv');
    result.style = 'display: block';
    let head = document.querySelector('#head');
    head.textContent = `${statusText.textContent}🏆`;
    let info = document.querySelector('#info');
    info.innerHTML = story;
}
function hideResulst() {
    let result = document.getElementById('resultDiv');
    result.style = 'display: none';
}
close.addEventListener('click', hideResulst);
play.addEventListener('click', hideResulst)
play.addEventListener('click', restartGame)

