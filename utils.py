from dotenv import load_dotenv
import os

load_dotenv()

def get_key(key_name):
    value = os.getenv(key_name)
    if value == None:
        print("value not found")
    else:
        return value
    

if __name__ == "__main__":
    result = get_key("GROQ_API_KEY")
    print(result)
