import os
from google import genai
from dotenv import load_dotenv

load_dotenv(dotenv_path='server/.env')
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

print("Checking models/text-embedding-004:")
try:
    m = client.models.get(model='models/text-embedding-004')
    print(f"Found: {m.name}")
except Exception as e:
    print(f"Error: {e}")

print("\nChecking models/gemini-1.5-flash:")
try:
    m = client.models.get(model='models/gemini-1.5-flash')
    print(f"Found: {m.name}")
except Exception as e:
    print(f"Error: {e}")
