import requests
import sys

# Change this if your FastAPI server is running on a different port/host
CHAT_URL = "http://127.0.0.1:8000/chat"

def main():
    print("=========================================")
    print("       AI Chatbot Terminal Tester        ")
    print("=========================================")
    print("Type 'quit' or 'exit' to stop the chat.\n")

    while True:
        try:
            # 1. Take user input
            user_input = input("You: ")
            
            # Check for exit commands
            if user_input.lower() in ['quit', 'exit']:
                print("Exiting chat. Goodbye!")
                break
            
            # Prevent empty messages
            if not user_input.strip():
                continue

            # 2. Prepare payload
            payload = {"message": user_input}
            
            # 3. Send POST request to FastAPI backend
            response = requests.post(CHAT_URL, json=payload)

            # 4. Handle response
            if response.status_code == 200:
                data = response.json()
                print(f"\nAI: {data.get('reply', '')}\n")
            else:
                print(f"\nError ({response.status_code}): {response.text}\n")

        except requests.exceptions.ConnectionError:
            print(f"\nError: Could not connect to {CHAT_URL}.")
            print("Please make sure your FastAPI server is running!\n")
            sys.exit(1)
        except KeyboardInterrupt:
            print("\n\nExiting chat. Goodbye!")
            sys.exit(0)

if __name__ == "__main__":
    main()
