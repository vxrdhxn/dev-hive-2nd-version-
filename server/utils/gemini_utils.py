import os
from google import genai
from google.genai import types
from pathlib import Path
from dotenv import load_dotenv

# Load .env from server directory (parent of utils)
env_path = Path(__file__).parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Configure Gemini Client
# The client automatically reads GOOGLE_API_KEY if not passed, 
# but we can pass api_key explicitly from GEMINI_API_KEY env var if needed.
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

# Models
EMBEDDING_MODEL = "text-embedding-004"
CHAT_MODEL = "gemini-1.5-flash"

def get_embedding(text):
    """
    Generate embedding for the given text using Gemini's text-embedding-004 model.
    Returns a list of floats (dimension 768).
    """
    if not text:
        return []
    
    try:
        # New SDK usage for embeddings
        result = client.models.embed_content(
            model=EMBEDDING_MODEL,
            contents=text,
            config=types.EmbedContentConfig(
                task_type="RETRIEVAL_DOCUMENT"
            )
        )
        # Result structure: result.embeddings[0].values
        if result.embeddings:
            return result.embeddings[0].values
        return []
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []

def get_chat_completion(messages):
    """
    Generate a chat completion using Gemini 1.5 Flash.
    Converts OpenAI-style messages format to Gemini format.
    """
    try:
        # Convert messages to string prompts or structured content
        # For simple RAG/Chat, we can concatenate or use the chat helper if we maintain history.
        # Since this function seems to receive a full list of messages each time (stateless wrapper),
        # we can construct the prompt.

        system_instruction = None
        contents = []

        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                system_instruction = content
            elif role == "user":
                contents.append(types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=content)]
                ))
            elif role == "assistant":
                contents.append(types.Content(
                    role="model",
                    parts=[types.Part.from_text(text=content)]
                ))
        
        # Determine config
        config = types.GenerateContentConfig(
            system_instruction=system_instruction
        )

        response = client.models.generate_content(
            model=CHAT_MODEL,
            contents=contents,
            config=config
        )
        
        return response.text
        
    except Exception as e:
        print(f"Error generating chat completion: {e}")
        return "I apologize, but I encountered an error while processing your request."
