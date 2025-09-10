document.addEventListener("DOMContentLoaded", () => {
  const gridDisplay = document.querySelector(".grid");
  const scoreDisplay = document.getElementById("score");
  const resultDisplay = document.getElementById("result");

  // 🎵 Audio Elements
  const bgMusic = document.getElementById("bg-music");
  const mergeSound = document.getElementById("merge-sound");
  const winSound = document.getElementById("win-sound");
  const loseSound = document.getElementById("lose-sound");

  // Start background music
  bgMusic.volume = 0.3;
  bgMusic.play().catch(() => {
    // if browser blocks autoplay, play on first key press
    document.addEventListener(
      "keydown",
      () => {
        bgMusic.play();
      },
      { once: true }
    );
  });

  let squares = [];
  const width = 4;
  let score = 0;

  //create the playing board
  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      let square = document.createElement("div");
      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  //generate a new number
  function generate() {
    let randomNumber = Math.floor(Math.random() * squares.length);
    if (squares[randomNumber].innerHTML == 0) {
      squares[randomNumber].innerHTML = 2;
      checkForGameOver();
    } else generate();
  }

  // -------- Movement Functions --------
  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML),
        ];
        let filteredRow = row.filter((num) => num);
        let zeros = Array(4 - filteredRow.length).fill(0);
        let newRow = zeros.concat(filteredRow);
        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        let row = [
          parseInt(squares[i].innerHTML),
          parseInt(squares[i + 1].innerHTML),
          parseInt(squares[i + 2].innerHTML),
          parseInt(squares[i + 3].innerHTML),
        ];
        let filteredRow = row.filter((num) => num);
        let zeros = Array(4 - filteredRow.length).fill(0);
        let newRow = filteredRow.concat(zeros);
        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveUp() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter((num) => num);
      let zeros = Array(4 - filteredColumn.length).fill(0);
      let newColumn = filteredColumn.concat(zeros);
      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      let column = [
        parseInt(squares[i].innerHTML),
        parseInt(squares[i + width].innerHTML),
        parseInt(squares[i + width * 2].innerHTML),
        parseInt(squares[i + width * 3].innerHTML),
      ];
      let filteredColumn = column.filter((num) => num);
      let zeros = Array(4 - filteredColumn.length).fill(0);
      let newColumn = zeros.concat(filteredColumn);
      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + width * 2].innerHTML = newColumn[2];
      squares[i + width * 3].innerHTML = newColumn[3];
    }
  }

  // -------- Combine Functions --------
  function combineRow() {
    for (let i = 0; i < 15; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;

        // 🔊 play merge sound
        mergeSound.currentTime = 0;
        mergeSound.play();
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        let combinedTotal =
          parseInt(squares[i].innerHTML) +
          parseInt(squares[i + width].innerHTML);
        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = 0;
        score += combinedTotal;
        scoreDisplay.innerHTML = score;

        // 🔊 play merge sound
        mergeSound.currentTime = 0;
        mergeSound.play();
      }
    }
    checkForWin();
  }

  // -------- Controls --------
  function control(e) {
    if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }
  document.addEventListener("keyup", control);

  function keyRight() {
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  // -------- Win / Lose --------
  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 2048) {
        resultDisplay.innerHTML = "You WIN";
        document.removeEventListener("keyup", control);

        // 🔊 play win sound
        winSound.play();

        setTimeout(() => clear(), 3000);
      }
    }
  }

  function checkForGameOver() {
    let zeros = 0;
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0) zeros++;
    }
    if (zeros === 0) {
      resultDisplay.innerHTML = "You LOSE";
      document.removeEventListener("keyup", control);

      // 🔊 play lose sound
      loseSound.play();

      setTimeout(() => clear(), 3000);
    }
  }

  function clear() {
    clearInterval(myTimer);
  }

  // -------- Colors --------
  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == 0)
        squares[i].style.backgroundColor = "#afa192";
      else if (squares[i].innerHTML == 2)
        squares[i].style.backgroundColor = "#eee4da";
      else if (squares[i].innerHTML == 4)
        squares[i].style.backgroundColor = "#ede0c8";
      else if (squares[i].innerHTML == 8)
        squares[i].style.backgroundColor = "#f2b179";
      else if (squares[i].innerHTML == 16)
        squares[i].style.backgroundColor = "#ffcea4";
      else if (squares[i].innerHTML == 32)
        squares[i].style.backgroundColor = "#e8c064";
      else if (squares[i].innerHTML == 64)
        squares[i].style.backgroundColor = "#ffab6e";
      else if (squares[i].innerHTML == 128)
        squares[i].style.backgroundColor = "#fd9982";
      else if (squares[i].innerHTML == 256)
        squares[i].style.backgroundColor = "#ead79c";
      else if (squares[i].innerHTML == 512)
        squares[i].style.backgroundColor = "#76daff";
      else if (squares[i].innerHTML == 1024)
        squares[i].style.backgroundColor = "#beeaa5";
      else if (squares[i].innerHTML == 2048)
        squares[i].style.backgroundColor = "#d7d4f0";
    }
  }
  addColours();

  var myTimer = setInterval(addColours, 50);
});
