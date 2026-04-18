# from brain import thinking
from brain import generate_reply
# import api
# from database.services.service import save_message
if __name__ == "__main__":
    while True:
        user_input = input("you: ")
        if user_input.lower() == "exit":
            break
        reply = generate_reply(user_input)
        print("Bot: ",reply)
        # save_message("Assistant", reply)

        
