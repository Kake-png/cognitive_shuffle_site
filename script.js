const startButton =
  document.getElementById("start-button");

const wordDisplay =
  document.getElementById("word-display");

let timerId = null;
let isPlaying = false;
let currentAudio = null;

let shuffledWords = [];
let currentIndex = 0;


// 単語リストをシャッフル
function shuffleWords() {
  shuffledWords = [...words];

  // Fisher-Yates shuffle
  for (let i = shuffledWords.length - 1; i > 0; i--) {
    const j =
      Math.floor(Math.random() * (i + 1));

    [shuffledWords[i], shuffledWords[j]] =
      [shuffledWords[j], shuffledWords[i]];
  }

  currentIndex = 0;
}


// 次の単語を再生
function playNextWord() {

  // 全部使い切ったら、もう一度シャッフル
  if (currentIndex >= shuffledWords.length) {
    shuffleWords();
  }

  const item = shuffledWords[currentIndex];

  currentIndex++;


  wordDisplay.textContent = item.word;


  // 前の音声が残っていたら停止
  if (currentAudio !== null) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }


  currentAudio =
    new Audio(`audio/${item.file}`);

  currentAudio.play();
}


// 再生開始
function start() {

  // 初回だけシャッフル
  if (shuffledWords.length === 0) {
    shuffleWords();
  }

  playNextWord();

  timerId =
    setInterval(playNextWord, 8000);

  isPlaying = true;

  startButton.textContent = "しずかにする";
}


// 停止
function stop() {

  clearInterval(timerId);

  timerId = null;


  // 現在流れている音声も停止
  if (currentAudio !== null) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }


  isPlaying = false;

  startButton.textContent = "はじめる";
}


// ボタン操作
startButton.addEventListener("click", () => {

  if (isPlaying) {
    stop();
  } else {
    start();
  }

});