"""
Simple API test script
API簡単テストスクリプト
"""

import requests
from pathlib import Path
import json

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_health():
    """Test health endpoint"""
    print("Testing /health endpoint...")
    response = requests.get(f"{BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print()

def test_model_info():
    """Test model info endpoint"""
    print("Testing /model-info endpoint...")
    response = requests.get(f"{BASE_URL}/model-info")
    print(f"Status: {response.status_code}")
    print(json.dumps(response.json(), indent=2))
    print()

def test_predict(image_path: str):
    """Test prediction endpoint"""
    print(f"Testing /predict endpoint with {image_path}...")
    
    if not Path(image_path).exists():
        print(f"Error: Image not found at {image_path}")
        return
    
    with open(image_path, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{BASE_URL}/predict", files=files)
    
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"\n✅ Prediction: {result['predicted_class']}")
        print(f"   Japanese: {result['japanese_name']} ({result['hiragana']})")
        print(f"   English: {result['english_name']}")
        print(f"   Confidence: {result['confidence_percentage']}")
        print(f"   Collection: {result['collection_day_en']}")
        print(f"   Processing time: {result['processing_time_ms']:.2f}ms")
        print(f"\n   Preparation Steps:")
        for step in result['preparation_steps']:
            print(f"   - {step['english']}")
            print(f"     {step['japanese']}")
    else:
        print(f"Error: {response.json()}")
    print()

if __name__ == "__main__":
    print("="*60)
    print("Japanese Garbage Classifier API - Test Script")
    print("="*60)
    print()
    
    # Test endpoints
    test_health()
    test_model_info()
    
    # Test prediction (update path to your test image)
    # test_predict("test_images/bottle.jpg")
    
    print("="*60)
    print("Tests complete!")
    print("="*60)