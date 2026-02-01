
import requests
import os

# Token from environment (e.g., .env.local)
HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://api-inference.huggingface.co/models/Qwen/Qwen3-VL-Embedding-2B"
headers = {"Authorization": f"Bearer {HF_TOKEN}"}

def query(payload):
    print(f"Sending query to {API_URL}...")
    response = requests.post(API_URL, headers=headers, json=payload)
    return response.json()

# Test with a text query
try:
    data = query({"inputs": "Hello world"})
    print("Response:")
    print(data)
except Exception as e:
    print(f"Error: {e}")
