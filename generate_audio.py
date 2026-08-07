import requests
from pathlib import Path

# =========================
# 設定
# =========================

VOICEVOX_URL = "http://127.0.0.1:50021"

# 使いたいVOICEVOXのスタイルID
SPEAKER_ID = 14

# 単語リスト
INPUT_FILE = Path("shuffle_words_clean.txt")

# 音声の保存先
OUTPUT_DIR = Path("audio")


# =========================
# 準備
# =========================

OUTPUT_DIR.mkdir(exist_ok=True)

words = [
    line.strip()
    for line in INPUT_FILE.read_text(encoding="utf-8").splitlines()
    if line.strip()
]


# =========================
# 音声生成
# =========================

for i, word in enumerate(words, start=1):

    print(f"{i}/{len(words)}  {word}")

    # ① 読み上げ方のデータを作ってもらう
    query_response = requests.post(
        f"{VOICEVOX_URL}/audio_query",
        params={
            "text": word + "。",
            "speaker": SPEAKER_ID
        }
    )

    query_response.raise_for_status()

    query = query_response.json()


    # 必要ならここで読み上げ速度を変更できる
    query["speedScale"] = 0.9
    query["intonationScale"] = 0.7


    # ② 実際の音声を生成
    synthesis_response = requests.post(
        f"{VOICEVOX_URL}/synthesis",
        params={
            "speaker": SPEAKER_ID,
            "enable_interrogative_upspeak": False,
        },
        json=query
    )

    synthesis_response.raise_for_status()


    # 0001.wav、0002.wav……として保存
    filename = OUTPUT_DIR / f"{i:04}.wav"

    filename.write_bytes(synthesis_response.content)


print("音声生成完了！")