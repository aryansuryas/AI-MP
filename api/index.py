"""
Vercel Python Serverless Entry Point
------------------------------------
Vercel picks up any Python file in api/ and runs it as a serverless function.
This file imports the Flask app from server.py and exposes it so
Vercel's WSGI adapter can call it on each request.

Routes handled (all via vercel.json rewrite -> /api/index):
  GET  /api/health
  GET  /api/model-performance
  POST /api/predict
"""
import sys
import os

# Make sure the project root is on sys.path so local imports work
_ROOT = os.path.join(os.path.dirname(__file__), "..")
if _ROOT not in sys.path:
    sys.path.insert(0, os.path.abspath(_ROOT))

# Import the Flask app — Vercel's WSGI layer picks up the name `app`
from server import app  # noqa: F401  (re-exported for Vercel)
