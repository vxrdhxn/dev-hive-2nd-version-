import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Models
EMBEDDING_MODEL = "models/text-embedding-004"
CHAT_MODEL = "gemini-1.5-flash"

def get_embedding(text):
    """
    Generate embedding for the given text using Gemini's text-embedding-004 model.
    Returns a list of floats (dimension 768).
    """
    if not text:
        return []
    
    try:
        result = genai.embed_content(
            model=EMBEDDING_MODEL,
            content=text,
            task_type="retrieval_document"
        )
        return result['embedding']
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return []

def get_chat_completion(messages):
    """
    Generate a chat completion using Gemini 1.5 Flash.
    Converts OpenAI-style messages format to Gemini format.
    """
    try:
        model = genai.GenerativeModel(CHAT_MODEL)
        
        # Convert messages to Gemini history format
        # OpenAI format: [{"role": "system", "content": "..."}, {"role": "user", "content": "..."}]
        # Gemini format: history=[{"role": "user", "parts": ["..."]}, {"role": "model", "parts": ["..."]}]
        # System instruction is set at model initialization (not fully supported in same way as openai in simple calls,
        # but we can prepend it or use system_instruction arg if using latest SDK)
        
        system_instruction = None
        gemini_history = []
        last_user_message = ""
        
        for msg in messages:
            role = msg["role"]
            content = msg["content"]
            
            if role == "system":
                system_instruction = content
            elif role == "user":
                last_user_message = content
                # If there are previous messages, add to history
            elif role == "assistant":
                if gemini_history or last_user_message: 
                     # Gemini requires strictly alternating user/model turns in history
                     # This is a simplified conversion; a robust one handles edge cases
                     pass

        # For simple RAG usage (System + User Question), we can just construct a prompt
        # because Gemini doesn't strictly adhere to the "messages" list in the same way for single-turn generation
        
        prompt_parts = []
        if system_instruction:
            prompt_parts.append(f"System: {system_instruction}\n")
        
        # Add conversation history if needed, but for now RAG is usually single turn
        for msg in messages:
            if msg["role"] == "user":
                prompt_parts.append(f"User: {msg['content']}")
            elif msg["role"] == "assistant":
                prompt_parts.append(f"Model: {msg['content']}")
                
        full_prompt = "\n".join(prompt_parts)
        
        response = model.generate_content(full_prompt)
        return response.text
        
    except Exception as e:
        print(f"Error generating chat completion: {e}")
        return "I apologize, but I encountered an error while processing your request."
