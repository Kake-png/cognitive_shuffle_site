const startButton =
  document.getElementById("start-button");

const wordDisplay =
  document.getElementById("word-display");

let timerId = null;
let isPlaying = false;

let shuffledWords = [];
let currentIndex = 0;


// Audioは1個だけ作る
const audio = new Audio();
audio.preload = "auto";


// 単語をシャッフル
function shuffleWords() {
  shuffledWords = [...words];

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

  if (currentIndex >= shuffledWords.length) {
    shuffleWords();
  }

  const item = shuffledWords[currentIndex];

  currentIndex++;

  wordDisplay.textContent = item.word;


  // 同じAudio要素の中身だけ入れ替える
  audio.pause();

  audio.src = `audio/${item.file}`;

  audio.currentTime = 0;

  audio.play().catch(error => {
    console.error("音声再生エラー:", error);
  });
}


// 開始
function start() {

  if (shuffledWords.length === 0) {
    shuffleWords();
  }

  // これはボタンを押した直後なので
  // スマホでも再生許可を取りやすい
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

  audio.pause();
  audio.currentTime = 0;

  isPlaying = false;

  startButton.textContent = "はじめる";
}


startButton.addEventListener("click", () => {

  if (isPlaying) {
    stop();
  } else {
    start();
  }

});