from fastapi import FastAPI, Depends
from pydantic import BaseModel
from brain import generate_reply
from auth import router as auth_router, get_current_user
from ocr import handle_file_ocr
from fastapi import UploadFile, File
from image_gen import generate_image
import shutil
import os
# from frontend.components.chat import 

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(auth_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message : str

@app.post("/chat")
def chat(req: ChatRequest): #current_user = Depends(get_current_user)):
    reply = generate_reply(req.message)
    return {"reply": reply}

# @app.post("/ocr")
# async def ocr_endpoint(file: UploadFile = File(...), current_user = Depends(get_current_user)):
#     temp_path = f"temp_{file.filename}"
#     with open(temp_path,"wb") as buffer:
#         shutil.copyfileobj(file.file, buffer)

#     extracted_text = handle_file_ocr(temp_path)
#     os.remove(temp_path)
#     return {
#         "filename": file.filename,
#         "extracted_text": extracted_text,
#         "char_count": len(extracted_text)
#     }
@app.post("/ocr")
async def ocr_endpoint(file: UploadFile = File(...)):
    temp_path = f"temp_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    extracted_text = handle_file_ocr(temp_path)
    os.remove(temp_path)
    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "char_count": len(extracted_text)
    }
# @app.post("/generate-image")
# async def image_generation(req: ChatRequest, current_user = Depends(get_current_user)):
#     image_url = generate_image(req.message)
#     if image_url:
#         return {
#             "prompt": req.message,
#             "image_url": image_url,
#             "status": "success"
#         }
#     else:
#         return{
#             "status": "failed",
#             "message": "Image generation failed, try again!"
#         }

@app.post("/generate-image")
async def image_generation(req: ChatRequest):
    image_url = generate_image(req.message)
    if image_url:
        return {
            "prompt": req.message,
            "image_url": image_url,
            "status": "success"
        }
    else:
        return {
            "status": "failed",
            "message": "Image generation failed!"
        }
from fastapi.staticfiles import StaticFiles
os.makedirs("generated_images", exist_ok=True)
app.mount("/images", StaticFiles(directory="generated_images"), name="images")