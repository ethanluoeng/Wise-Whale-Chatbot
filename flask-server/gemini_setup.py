import logging

from dotenv import load_dotenv
import os
from google import genai

# Setup logging to capture and record errors/info
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# Load enviroinment variables from .env file
try: 
    load_dotenv()
    logging.info("Environment variables from .env file loaded successfully.") 
except Exception as e:
    logging.error(f"Error loading .env file: {e}")

# Configure Gemini AI API as client (Global configuration no longer supported)
try:
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        logging.error("GOOGLE_API_KEY not found.")
    else:
        # THE FIX: Use 'Client' instead of 'configure'
        client = genai.Client(api_key=api_key)
        logging.info("Google Gemini Client connected successfully.")
except Exception as e:
    logging.error(f"Error connecting to Whale: {e}")

# Function to get response from Gemini AI model using a prompt
def get_gemini_response(prompt):
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents= "You are a whale. Answer the following prompt as a wise and helpful whale: " + prompt
        )
        return response.text.strip()
    except Exception as e:
        logging.error(f"Error generating Gemini response: {e}")
        return "Sorry, Whale couldn't process your request."