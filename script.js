const startButton =
  document.getElementById("start-button");

const wordDisplay =
  document.getElementById("word-display");


let timerId = null;
let isPlaying = false;


// -------------------------
// 音声
// -------------------------

// スマホ対策のため
// Audioは毎回作らず1個を使い回す
const audio = new Audio();

audio.preload = "auto";


// -------------------------
// シャッフル
// -------------------------

let shuffledWords = [];

let currentIndex = 0;


function shuffleWords() {

  // 元のwordsを壊さないようにコピー
  shuffledWords = [...words];


  // Fisher-Yates shuffle
  for (
    let i = shuffledWords.length - 1;
    i > 0;
    i--
  ) {

    const j =
      Math.floor(Math.random() * (i + 1));


    [
      shuffledWords[i],
      shuffledWords[j]
    ] = [
      shuffledWords[j],
      shuffledWords[i]
    ];
  }


  currentIndex = 0;
}


// -------------------------
// 次の単語を再生
// -------------------------

function playNextWord() {

  // 全部使い切ったら再シャッフル
  if (
    currentIndex >= shuffledWords.length
  ) {
    shuffleWords();
  }


  const item =
    shuffledWords[currentIndex];


  currentIndex++;


  // 画面表示
  wordDisplay.textContent = item.word;


  // 現在の音声を停止
  audio.pause();


  // 次のVOICEVOX音声を設定
  audio.src =
    `audio/${item.file}`;


  audio.currentTime = 0;


  // 再生
  audio.play().catch(error => {

    console.error(
      "音声再生エラー:",
      error
    );

  });
}


// -------------------------
// Wake Lock
// -------------------------

let wakeLock = null;


async function enableWakeLock() {

  // ブラウザがWake Lockに対応しているか確認
  if (!("wakeLock" in navigator)) {

    console.log(
      "このブラウザはWake Lockに対応していません"
    );

    return;
  }


  try {

    wakeLock =
      await navigator.wakeLock.request(
        "screen"
      );


    console.log(
      "Wake Lockを取得しました"
    );


    // OSなどによって解除された場合
    wakeLock.addEventListener(
      "release",
      () => {

        console.log(
          "Wake Lockが解除されました"
        );

        wakeLock = null;

      }
    );


  } catch (error) {

    console.error(
      "Wake Lock取得エラー:",
      error
    );

  }
}


async function disableWakeLock() {

  if (wakeLock !== null) {

    try {

      await wakeLock.release();

    } catch (error) {

      console.error(
        "Wake Lock解除エラー:",
        error
      );

    }


    wakeLock = null;
  }
}


// -------------------------
// 再生開始
// -------------------------

function start() {

  // 初回だけシャッフル
  if (shuffledWords.length === 0) {
    shuffleWords();
  }


  /*
   * まず音声を再生する。
   *
   * スマホではユーザーがボタンを押した直後に
   * play()することが重要。
   */
  playNextWord();


  // 8秒ごとに次へ
  timerId =
    setInterval(
      playNextWord,
      8000
    );


  isPlaying = true;


  // 再生画面用CSSを有効化
  document.body.classList.add(
    "playing"
  );


  startButton.textContent =
    "しずかにする";


  // 画面が自動で消えないようにする
  enableWakeLock();
}


// -------------------------
// 停止
// -------------------------

function stop() {

  clearInterval(timerId);

  timerId = null;


  // 現在の音声を停止
  audio.pause();

  audio.currentTime = 0;


  isPlaying = false;


  // 普通の画面に戻す
  document.body.classList.remove(
    "playing"
  );


  wordDisplay.textContent =
    "おやすみなさい";


  startButton.textContent =
    "はじめる";


  // Wake Lock解除
  disableWakeLock();
}


// -------------------------
// ボタン
// -------------------------

startButton.addEventListener(
  "click",
  () => {

    if (isPlaying) {

      stop();

    } else {

      start();

    }

  }
);


// -------------------------
// Wake Lock再取得
// -------------------------

/*
 * 別アプリへ移動したりしたとき、
 * Wake LockがOSによって解除される場合がある。
 *
 * ページへ戻ってきたとき、
 * まだ再生中なら再取得する。
 */

document.addEventListener(
  "visibilitychange",
  () => {

    if (
      document.visibilityState === "visible" &&
      isPlaying &&
      wakeLock === null
    ) {

      enableWakeLock();

    }

  }
);