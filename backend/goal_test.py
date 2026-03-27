import requests
import sys

# Change this if your FastAPI server is running on a different port/host
BASE_URL = "http://127.0.0.1:8000"

def main():
    print("=========================================")
    print("       Goal Investment Terminal Tester    ")
    print("=========================================")
    print("Let's project some live investments without writing to the DB!")
    
    try:
        years_input = input("Enter investment timeframe in years (e.g. 5): ")
        years = int(years_input) if years_input.strip() else 5
        
        risk = input("Enter risk level (Low/Medium/High) [Medium]: ").capitalize()
        if risk not in ["Low", "Medium", "High"]:
            risk = "Medium"
            
        investments = []
        while True:
            add = input("\nAdd an investment? (y/n) [y]: ").lower()
            if add == 'n':
                break
                
            inv_type = input("Type (stock/mutual_fund) [stock]: ").lower()
            if inv_type not in ["stock", "mutual_fund"]:
                inv_type = "stock"
                
            name = input("Asset Name (e.g., TCS): ")
            symbol = None
            if inv_type == "stock":
                symbol = input("Ticker Symbol for live price (e.g., TCS.NS): ")
                if not symbol.strip():
                    symbol = None
                
            amount_input = input(f"Amount to invest in {name}: ₹")
            amount = float(amount_input) if amount_input.strip() else 50000.0
            
            investments.append({
                "type": inv_type,
                "name": name,
                "symbol": symbol,
                "amount": amount
            })
            
        print("\n⏳ Calculating projection (fetching live stock prices from Yahoo Finance)...")
        
        payload = {
            "investments": investments,
            "years": years,
            "risk_level": risk
        }
        
        response = requests.post(f"{BASE_URL}/goals/calculate-investment", json=payload)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ Success! Projection Results:")
            for inv in data.get("investments", []):
                price_str = f" | Live Market Price: ₹{inv.get('current_price')}" if inv.get('current_price') else ""
                print(f" 🔹 {inv['name']}: Invested ₹{inv['amount']} -> Projected ₹{inv['projected_value']}{price_str}")
            print(f"\n 💰 Total Projected Portfolio Value: ₹{data.get('total_projected_value')}")
            print("=========================================\n")
        else:
            print(f"\n❌ Error ({response.status_code}): {response.text}\n")
            
    except requests.exceptions.ConnectionError:
        print(f"\n❌ Error: Could not connect to {BASE_URL}.")
        print("Please make sure your FastAPI server is running (`uvicorn app.main:app`)!\n")
    except ValueError:
        print("\n❌ Invalid number input. Exiting.")
    except KeyboardInterrupt:
        print("\nExiting.")

if __name__ == "__main__":
    main()
