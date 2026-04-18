from fastapi import APIRouter,HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

import email_validator 

from pydantic import BaseModel, EmailStr

from supabase import create_client, Client

import os
from dotenv import load_dotenv

load_dotenv()

supabase_url = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
supabase_api_key = os.getenv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY")

supabase : Client = create_client(supabase_url,supabase_api_key)

router = APIRouter(prefix="/auth", tags=["Authentication"])

security = HTTPBearer()

class SignupRequest(BaseModel):
    email : EmailStr
    password : str
    full_name : str

class LoginRequest(BaseModel):
    email : EmailStr
    password : str

@router.post("/signup")
async def signup(data : SignupRequest):
    try:
        response = supabase.auth.sign_up({
            "email" : data.email,
            "password" : data.password,
            "options" : {
                "data" : {
                    "full_name" : data.full_name
                }
            }
        })
        if response.user is None:
            raise HTTPException(status_code=400, detail="signup failed")
        
        return {
            "message" : "Account created successfully pls verify your email.",
            "user_id" : response.user.id,
        }
    except Exception as e :
        raise HTTPException(status_code=400, detail= str(e))
    

@router.post("/login")
async def login(data: LoginRequest):
    try:
        response = supabase.auth.sign_in_with_password({
            "email" : data.email,
            "password" : data.password
        })

        if response.session is None:
            raise HTTPException(status_code=403, detail="Email not verified. Please verify your email before logging in.")

        access_token = response.session.access_token

        return {
            "message" : "Login successfully...",
            "access_token" : access_token,
            "token_type" : "bearer",
            "user" : {
                "id" : response.user.id,
                "email" : response.user.email,
                "full_name" : response.user.user_metadata.get("full_name","")
            }
        }
    except Exception as e:
        if isinstance(e, HTTPException):
            raise e
        print(f"Login error: {e}")
        raise HTTPException(status_code=401, detail="Incorrect Password or Error during login.")
    
async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials

        user = supabase.auth.get_user(token)

        if user is None:
            raise HTTPException(status_code=401, detail="Invalid Token")
        return user.user
    except Exception as e:
        print(f"Auth token error: {e}")
        raise HTTPException(status_code=401, detail= "Login pls")
    
@router.get("/me")
async def get_me(current_user = Depends(get_current_user)):
    return {
        "id" : current_user.id,
        "email" : current_user.email,
        "full_name" : current_user.user_metadata.get("full_name", ""),
        "created_at" : current_user.created_at
    }

@router.get("/google")
async def google_login():
    response = supabase.auth.sign_in_with_oauth({
        "provider" : "google",
        "options" : {
            "redirect_to" : "http://localhost:3000"
        }
    })
    return {
        "url" : response.url
    }

@router.get("/callback")
async def auth_callback(code: str):
    try:
        response = supabase.auth.exchange_code_for_session({
            "auth_code" : code
        })
        if response.session:
            return {
                "access token": response.session.access_token,
                "user": {
                    "id": response.user.id,
                    "email": response.user.email,
                    "full_name": response.user.user_metadata.get("full_name", "")
                }
            }
        else:
            raise HTTPException(status_code=400,detail="Token Exchange Failed")
    except Exception as e :
        raise HTTPException(status_code=400, detail=str(e))
