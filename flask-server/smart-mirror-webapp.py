import logging
from flask import Flask, render_template, request, jsonify
from gemini_setup import get_gemini_response

# Setup logging to capture and record errors/info
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[logging.StreamHandler()]
)

# An object that represents the Flask web application
app = Flask(__name__)

# Route for the main page
@app.route('/')
def index():
    logging.info("Rendering main page.")
    try:
        return render_template('index.html')
    except Exception as e:
        logging.error(f"Error rendering index page: {e}")
        return "An error occurred while loading the page.", 500

# Route to handle chat messages
@app.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        logging.info(f"Received user message: {user_message}")
        response = get_gemini_response(user_message)
        return jsonify({'response': response})
    except Exception as e:
        logging.error(f"Error processing chat request: {e}")
        return jsonify({'response': "Sorry, an error occurred while processing your request."}), 500

#------------------------RUN THE APP------------------------#
if __name__ == '__main__':
    try:
        logging.info("Starting Flask application...")
        app.run(debug=True)
    except Exception as e:
        logging.error(f"Error starting Flask application: {e}")

