import os
from kokoro import KPipeline
import soundfile as sf

# ===== 設定 =====

INPUT_FILE = "english_words_clean.txt"

OUTPUT_DIR = "en/audio"
JS_FILE = "en/words.js"

VOICE = "af_heart"
SPEED = 0.9
SAMPLE_RATE = 24000

# =================


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    os.makedirs(os.path.dirname(JS_FILE), exist_ok=True)

    # 単語一覧を読み込み
    with open(INPUT_FILE, "r", encoding="utf-8") as f:
        words = [
            line.strip()
            for line in f
            if line.strip()
        ]

    print(f"{len(words)} words found.")

    # Kokoro初期化
    print("Loading Kokoro...")
    pipeline = KPipeline(lang_code="a")  # American English
    print("Kokoro loaded.")

    js_entries = []

    for i, word in enumerate(words, start=1):
        filename = f"{i:04d}.wav"
        wav_path = os.path.join(OUTPUT_DIR, filename)

        # words.js用データは、音声生成をスキップしても必ず追加
        escaped_word = (
            word
            .replace("\\", "\\\\")
            .replace('"', '\\"')
        )

        js_entries.append(
            f'  {{ word: "{escaped_word}", file: "{filename}" }}'
        )

        # 既存ファイルがあればスキップ
        if os.path.exists(wav_path) and os.path.getsize(wav_path) > 0:
            print(
                f"[{i}/{len(words)}] SKIP: {word}"
            )
            continue

        print(
            f"[{i}/{len(words)}] Generate: {word}"
        )

        try:
            generator = pipeline(
                word,
                voice=VOICE,
                speed=SPEED
            )

            audio_generated = False

            for _, _, audio in generator:
                sf.write(
                    wav_path,
                    audio,
                    SAMPLE_RATE
                )
                audio_generated = True
                break

            if not audio_generated:
                print(
                    f"  WARNING: No audio generated for '{word}'"
                )

        except Exception as e:
            print(
                f"  ERROR: {word}: {e}"
            )

    # words.js生成
    with open(JS_FILE, "w", encoding="utf-8") as f:
        f.write("const words = [\n")
        f.write(",\n".join(js_entries))
        f.write("\n];\n")

    print()
    print("==============================")
    print("Complete!")
    print(f"Audio: {OUTPUT_DIR}/")
    print(f"Words: {JS_FILE}")
    print("==============================")


if __name__ == "__main__":
    main()