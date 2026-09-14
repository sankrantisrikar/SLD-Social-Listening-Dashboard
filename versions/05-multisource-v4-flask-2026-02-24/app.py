from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__, static_folder='.')
CORS(app)

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'pilot.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Reddit proxy
@app.route('/api/reddit')
def reddit_proxy():
    query = request.args.get('q', '')
    limit = request.args.get('limit', '100')
    
    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400
    
    try:
        url = f'https://www.reddit.com/search.json?q={query}&limit={limit}&sort=relevance'
        headers = {'User-Agent': 'Mozilla/5.0 (compatible; SocialListening/1.0)'}
        response = requests.get(url, headers=headers)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# News proxy
@app.route('/api/news')
def news_proxy():
    query = request.args.get('q', '')
    api_key = os.getenv('NEWSAPI_KEY')
    
    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400
    
    if not api_key:
        return jsonify({'error': 'NewsAPI key not configured'}), 500
    
    try:
        url = f'https://newsapi.org/v2/everything?q={query}&language=en&sortBy=publishedAt&pageSize=20&apiKey={api_key}'
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
