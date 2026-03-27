import requests
import json

BASE_URL = "http://127.0.0.1:8000"

def run_tests():
    try:
        print("1. Testing GET /portfolio/assets")
        resp_assets = requests.get(f"{BASE_URL}/portfolio/assets")
        print("Status:", resp_assets.status_code)
        if resp_assets.status_code == 200:
            print(json.dumps(resp_assets.json()[:2], indent=2), "...\n")
        else:
            print(resp_assets.text, "\n")
        
        print("2. Testing POST /portfolio/create")
        payload = {
            "user_id": "test_user_123",
            "assets": [
                {
                    "type": "stock",
                    "name": "TCS",
                    "symbol": "TCS.NS",
                    "quantity": 10,
                    "buy_price": 3800.0
                },
                {
                    "type": "mutual_fund",
                    "name": "Axis Bluechip Fund",
                    "quantity": 1, # quantity is basically unused, we use buy_price as total investment
                    "buy_price": 50000.0
                }
            ]
        }
        resp_create = requests.post(f"{BASE_URL}/portfolio/create", json=payload)
        print("Status:", resp_create.status_code)
        if resp_create.status_code == 200:
            data = resp_create.json()
            print("Total Value:", data.get("total_value"))
            print("Profit/Loss:", data.get("profit_loss"))
            print("Allocation:", data.get("allocation"))
            print("Bar Chart (Sectors):", data.get("bar_chart"))
            print(f"Line Chart Data Points: {len(data.get('line_chart', []))}")
            print(f"Candlestick Data Points for TCS.NS: {len(data.get('candlestick', {}).get('TCS.NS', []))}\n")
        else:
            print(resp_create.text, "\n")
            
        print("3. Testing GET /portfolio/{user_id}")
        resp_get = requests.get(f"{BASE_URL}/portfolio/test_user_123")
        print("Status:", resp_get.status_code)
        if resp_get.status_code == 200:
            data_get = resp_get.json()
            print("Total Value:", data_get.get("total_value"))
            print("Profit/Loss:", data_get.get("profit_loss"))
            print("\nPortfolio tests completed successfully!")
        else:
            print(resp_get.text, "\n")
            
    except requests.exceptions.ConnectionError:
        print("Could not connect to the server. Make sure it's running!")

if __name__ == "__main__":
    run_tests()
