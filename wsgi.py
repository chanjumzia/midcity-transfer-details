import sys
from pathlib import Path

# Add the project directory to the sys.path
# This is necessary for PythonAnywhere to find the 'server' module.
project_home = str(Path(__file__).resolve().parent)
if project_home not in sys.path:
    sys.path.insert(0, project_home)

# Import the Flask app instance
from server import app as application
