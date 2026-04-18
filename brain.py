# from database.services.service import get_message, save_message
from utils import get_key
from groq import Groq
# from prompts import Base_personality
from memory import save_message, get_history, create_session
from web_search import get_web_results
from prompts.Base_personality import My_Own_Gpt

client = Groq(api_key=get_key("GROQ_API_KEY"))

def thinking(user_input, history="default"):
    prompt = f'''
    {My_Own_Gpt}

    You are a highly intelligent AI assistant.

Rules:
- Understand the user's intent first
- If it's a definition → give short clear answer
- If it's coding → give code first
- If it's explanation → give simple explanation
- DO NOT always include code unless needed
- Keep answers natural and human-like
- Avoid unnecessary headings and formatting

#advance tuning-->
If user asks simple question → short answer  
If user asks "explain" → detailed answer  
If user asks "code" → code first  

    conversation history:
    {history}

     user: {user_input}

    Generate a smart, concise, and relevant response:
    '''
    return prompt


    #   Old version------/

#GROQ call:

# def generate_reply(user_input, history=""):

#     # session_id = create_session()
#     session_id = 4
#     messages = get_history(session_id)[-10:]

#     history_text = ""
#     for msg in messages:
#         history_text += f"{msg['role']} : {msg['message']}\n"

#     save_message("user",user_input,session_id)

#     through_prompt = thinking(user_input, history)

#     chat_messages = []
#     chat_messages.append({
#         "role" : "system",
#         "content" : Base_personality
#     }) 
#     for msg in messages:
#         chat_messages.append({
#             "role" : msg["role"],
#             "content" : msg["message"]
#         })

#     chat_messages.append({
#         "role" : "user",
#         "content" : user_input
#     })

#     response = client.chat.completions.create(
#         # model= "llama-3.1-8b-instant",
#         model = "llama-3.3-70b-versatile",
#         # messages =[{
#         #     "role":"user","content" : through_prompt
#         # }]
#         messages=chat_messages
#     )
#     ai_reply = response.choices[0].message.content

#     save_message("assistant", ai_reply,session_id)

#     return ai_reply
   
    # For smart routing in web search-------/
def decide_routing(user_input):
    routing_prompt = f"""
          you are routing assistant. Your job is to decide if a user's question required real-time web search.

          user Question: "{user_input}"

          Rules:
          - Respond with only one word: "SEARCH", "IMAGE", or "NO_SEARCH".
          - Respond with only one word: "SEARCH" or "NO_SEARCH".
          - Use "SEARCH" for: current events,weather,stock prices,latest tech news, about companies,about actors and actresses or facts you might not know.
          - Use "NO_SEARCH" for: Greetings (Hi,Hello), coding help,math,general advice, or personal opinions.
          - Use "IMAGE" for: generate image, draw, create image, make a picture, show me image of, imagine, visualize.
          - If user asks "what is that" or "what is this" → NO_SEARCH
          - NEVER use IMAGE unless user explicitly asks to generate/create/draw an image

            Decision:"""
    response = client.chat.completions.create(
        model = "llama-3.1-8b-instant",
        messages = [{"role": "user","content": routing_prompt}],
        max_tokens = 5
    )
    decision = response.choices[0].message.content.strip().upper()
    print(f"DEBUG: Decision is {decision}")    #for debugging purpose---/
    return decision

    #  reply with ocr-----/
from ocr import handle_file_ocr
def reply_with_ocr(file_path: str, user_question: str = "summarize this"):
    extracted_text = handle_file_ocr(file_path)

    chat_messages = [{
        "role": "system",
        "content": f"{My_Own_Gpt}\n\nThe user has uploaded a file. Here is the extracted text:\n\n{extracted_text}"
    },
    {
        "role": "user",
        "content": user_question
    }]
    response = client.chat.completions.create(
        model = "llama-3.3-70b-versatile",
        message = chat_messages
    )
    return response.choices[0].message.content


    # New version-----/
# from image_gen import generate_image
def generate_reply(user_input):

    session_id = 4

    # save user message first
    save_message("user", user_input, session_id)

    #web-search functionality
    decision = decide_routing(user_input)
    print(f"DEBUG: Decision is {decision}")
    # search_data = get_web_results(user_input)
    context_text = ""

    if "IMAGE" in decision:
        print("Generating Image....")
        from image_gen import generate_image
        image_url = generate_image(user_input)
        if image_url:
            save_message("assistant", image_url,session_id)
            return f"Your Image is ready!\n{image_url}"
        else:
            return "Image generation is Failed, Pls try again... "

    if "SEARCH" in decision:
        print("Searching the web....")
        search_data = get_web_results(user_input + " 2026")
        if search_data:
            context_text = "\nWeb Search Results:\n"
            for i, res in enumerate(search_data):
                context_text += f"Source {i+1} : {res.get('title')}-{res.get('body')}\n"
# from image_gen import generate_image
        # elif "Image" in decision:
        #     print("Generating Image....")
        #     image_url = generate_image(user_input)
        #     if image_url:
        #         return {
        #             "type": "image",
        #             "reply": f"Your Image is ready.",
        #             "image_url": image_url
        #         }
        else :
            context_text = "\nNo Specific Web Results Found For This Query."


    # get updated history
    messages = get_history(session_id)
    messages = messages[-10:]

    chat_messages = []

    # decision system making
    chat_messages.append({
        "role": "system",
        "content": f"""{My_Own_Gpt}

##STRICT OVERRIDE — HIGHEST PRIORITY RULE:
Real-time web search has already been performed for you.
The results are below. You MUST use them to answer.
It is STRICTLY FORBIDDEN to say:
- "I don't have internet access"
- "My training data is limited"
- "I cannot browse the web"
You already have the data. Just use it naturally like a human would.

## STRICT RULE:
- NEVER say you lack internet access
- Use web results if provided

##LIVE WEB SEARCH RESULTS:
{context_text}
"""
    })

    # history
    for msg in messages[:-1]:
        chat_messages.append({
            "role": msg["role"],
            "content": msg["message"]
        })

    #system
    chat_messages.append({
         "role": "user",
         "content": user_input
    })

    # AI call
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=chat_messages
    )

    ai_reply = response.choices[0].message.content

    # save AI reply
    save_message("assistant", ai_reply, session_id)

    return ai_reply