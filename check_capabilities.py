import os
from google import genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='server/.env')
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("Checking model capabilities...")
try:
    for m in client.models.list():
        print(f"Model: {m.name}")
        print(f" - Methods: {m.supported_generation_methods}")
except Exception as e:
    print(f"Error: {e}")
