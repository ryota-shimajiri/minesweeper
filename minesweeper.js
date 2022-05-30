let data = [];
let h, w, b, count;
let startTime;
let timerId;
let s = 0;
const bombCount = document.querySelector(".bombCount");
const gameField = document.getElementById("gameField");
const time = document.getElementById("time");
const result = document.getElementById("result");
const startBtn = document.getElementById("startBtn");
const beginnerBtn = document.getElementById("beginnerBtn");
const intermediateBtn = document.getElementById("intermediateBtn");
const advancedBtn = document.getElementById("advancedBtn");

startBtn.addEventListener("click", start, "false");
beginnerBtn.addEventListener("click", setBeginnerDifficulty, "false");
intermediateBtn.addEventListener("click", setIntermediateDifficulty, "false");
advancedBtn.addEventListener("click", setAdvancedDifficulty, "false");

let carrent = this.textContent

function start() {
    
    // 初期化
    init();

    // タイマー処理
    clearInterval(timerId);
    timerId = setInterval("timer()",1000);

    for (let i = 0; i < h; i++) {
        // 縦の要素の数だけtrを追加
        const tr = document.createElement("tr");
        for (let j = 0; j < w; j++) {
            // 横の要素の数だけtdを追加
            const td = document.createElement("td");
            td.addEventListener("click", leftClicked);
            td.addEventListener("contextmenu", rightClicked);
            tr.appendChild(td);
        }
        gameField.appendChild(tr);
    }
}

function init() {
    // 初期化
    w = Number(document.getElementById("w").value);
    h = Number(document.getElementById("h").value);
    b = Number(document.getElementById("b").value);
    data = [];
    s = 0;
    gameField.innerHTML = "";
    gameField.style.pointerEvents = "auto";
    count = b;
    bombCount.textContent = count;
    time.textContent = "0000";
    result.textContent = "";
}

function setBeginnerDifficulty() {
    w = document.getElementById("w");
    h = document.getElementById("h");
    b = document.getElementById("b");
    w.value = 9;
    h.value = 9;
    b.value = 10;
}

function setIntermediateDifficulty() {
    w = document.getElementById("w");
    h = document.getElementById("h");
    b = document.getElementById("b");
    w.value = 16;
    h.value = 16;
    b.value = 40;
}

function setAdvancedDifficulty() {
    w = document.getElementById("w");
    h = document.getElementById("h");
    b = document.getElementById("b");
    w.value = 30;
    h.value = 16;
    b.value = 99;
}

function leftClicked() {
    if (this.className === "open" || this.className === "flag") {
        return;
    }
    const y = this.parentNode.rowIndex;
    const x = this.cellIndex;

    // 一手目か確認
    if (!data.length) {
        for (let i = 0; i < h; i++) {
            data[i] = Array(w).fill(0);
        }
        for (let i = y - 1; i <= y + 1; i++) {
            for (let j = x - 1; j <= x + 1; j++) {
                if (i >= 0 && i < h && j >= 0 && j < w) {
                    data[i][j] = -1;
                }
            }
        }
        putBomb();
    }

    // 爆弾を踏んだか判定
    if (data[y][x] === 1) {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (data[i][j] === 1) {
                    gameField.rows[i].cells[j].classList.add("bomb");
                }
            }
        }
        clearInterval(timerId);
        gameField.style.pointerEvents = "none";
        setTimeout(() => alert("GAME OVER!!"), 2);
        return;
    }

    let bombs = countBomb(y, x);
    if (bombs === 0) {
        open(y, x);
    } else {
        this.innerHTML = bombs;
        this.classList.add("open");
    }

    // クリア判定
    if (countOpenCell()) {
        for (let i = 0; i < h; i++) {
            for (let j = 0; j < w; j++) {
                if (data[i][j] === 1) {
                    gameField.rows[i].cells[j].classList.add("clear");
                }
            }
        }
        clearInterval(timerId);
        gameField.style.pointerEvents = "none";
        setTimeout(() => alert("CLEAR!!"), 2);
        return;
    }
}

function countBomb(y, x) {
    let bombs = 0;
    for (let i = y - 1; i <= y + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
            if (i >= 0 && i < h && j >= 0 && j < w) {
                if (data[i][j] === 1) {
                    bombs++;
                }
            }
        }
    }
    return bombs;
}

function rightClicked(e) {
    e.preventDefault();
    if (this.className === "open") {
        return;
    }
    this.classList.toggle("flag");
    if (this.className === "flag") {
        count--;
        bombCount.textContent = count;
    } else {
        count++;
        bombCount.textContent = count;
    }
}

function putBomb() {
    for (let i = 0; i < b; i++) {
        while (true) {
            const y = Math.floor(Math.random() * h);
            const x = Math.floor(Math.random() * w);
            if (data[y][x] === 0) {
                data[y][x] = 1;
                break;
            }
        }
    }
}

function open(y, x) {
    for (let i = y - 1; i <= y + 1; i++) {
        for (let j = x - 1; j <= x + 1; j++) {
            if (i >= 0 && i < h && j >= 0 && j < w) {
                let bombs = countBomb(i, j);
                if (
                    gameField.rows[i].cells[j].className === "open" ||
                    gameField.rows[i].cells[j].className === "flag"
                ) {
                    continue;
                }
                if (bombs === 0) {
                    gameField.rows[i].cells[j].classList.add("open");
                    open(i, j);
                } else {
                    gameField.rows[i].cells[j].textContent = bombs;
                    gameField.rows[i].cells[j].classList.add("open");
                }
            }
        }
    }
}

function countOpenCell() {
    let openCell = 0;
    for (let i = 0; i < h; i++) {
        for (let j = 0; j < w; j++) {
            if (gameField.rows[i].cells[j].className === "open") {
                openCell++;
            }
        }
    }
    if (h * w - openCell === b) {
        return true;
    }
}

function timer() {
    s++;
    s = ( '0000' + s ).slice( -4 );
    time.innerHTML = String(s);
}