from kokoro import KPipeline
import soundfile as sf

pipeline = KPipeline(lang_code="a")  # American English

generator = pipeline(
    "apple",
    voice="af_heart",
    speed=0.9
)

for _, _, audio in generator:
    sf.write("apple.wav", audio, 24000)