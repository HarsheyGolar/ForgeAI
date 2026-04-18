from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
key = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

supabase = create_client(url, key)

def get_history(session_id):
    response = supabase.table("conversations") \
    .select("*") \
    .eq("session_id", session_id) \
    .order("created_at") \
    .execute()

    return response.data

def save_message(role,message,session_id):
    supabase.table("conversations").insert({
        "session_id" : session_id,
        "role" : role,
        "message" : message
    }).execute()

def create_session():
    response = supabase.table("chat_sessions").insert({}).execute()
    return response.data[0]['id']