
import os
from flask import Flask, send_from_directory

app = Flask(__name__, static_folder='dist')

@app.route('/')
def index():
    return send_from_directory('dist', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('dist', path)

if __name__ == '__main__':
    app.run(debug=True)
