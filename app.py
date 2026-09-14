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
    subreddit = request.args.get('sub', '').strip()
    limit = request.args.get('limit', '100')
    client_id = request.args.get('clientId') or os.getenv('REDDIT_CLIENT_ID')
    client_secret = request.args.get('clientSecret') or os.getenv('REDDIT_CLIENT_SECRET')
    
    if not query:
        return jsonify({'error': 'Missing query parameter'}), 400
    if not subreddit:
        return jsonify({'error': 'Missing subreddit parameter'}), 400
    
    try:
        if client_id and client_secret:
            token_res = requests.post(
                'https://www.reddit.com/api/v1/access_token',
                data={'grant_type': 'client_credentials'},
                auth=(client_id, client_secret),
                headers={'User-Agent': 'SocialListeningDashboard/1.0 (Flask OAuth Proxy)'}
            )
            if token_res.status_code >= 400:
                return jsonify({'error': 'OAuth token request failed', 'details': token_res.text[:180]}), token_res.status_code

            token = token_res.json().get('access_token')
            if not token:
                return jsonify({'error': 'OAuth token missing in Reddit response'}), 500

            url = f'https://oauth.reddit.com/r/{subreddit}/search?q={query}&sort=new&limit={limit}&t=month&restrict_sr=true'
            headers = {
                'User-Agent': 'SocialListeningDashboard/1.0 (Flask OAuth Proxy)',
                'Authorization': f'Bearer {token}'
            }
            response = requests.get(url, headers=headers)
            data = response.json()
            data['_mode'] = 'oauth'
            return jsonify(data)
        else:
            url = f'https://www.reddit.com/r/{subreddit}/search.json?q={query}&sort=new&limit={limit}&t=month&restrict_sr=true'
            headers = {'User-Agent': 'SocialListeningDashboard/1.0 (Flask Public Proxy)'}
            response = requests.get(url, headers=headers)
            data = response.json()
            data['_mode'] = 'public'
            return jsonify(data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# News proxy
@app.route('/api/news')
def news_proxy():
    query = request.args.get('q', '')
    api_key = request.args.get('apiKey') or os.getenv('NEWSAPI_KEY')
    
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
