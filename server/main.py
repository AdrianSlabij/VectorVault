from fastapi import FastAPI, Path, Query, UploadFile, Depends, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from pydantic import BaseModel, Field
from typing import Optional
from pathlib import Path
from ingestion import process_and_index_file
from query_llm import query_llm

# uvicorn main:app --reload   

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:3000",         
    "https://vectorvault.vercel.app",
    "http://127.0.0.1:3000",    
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows Next.js to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "FastAPI is running", "message": "Ready for RAG!"}

class ChatRequest(BaseModel):
    query: str

@app.post("/ask")
def chat(message: ChatRequest, current_user_id: str = Depends(get_current_user)):
    
    user_message = message.query
    #Save User Message
    supabase.table("chat_messages").insert({
        "user_id": current_user_id,
        "role": "user",
        "content": user_message
    }).execute()

    result = query_llm(user_message, current_user_id)
    
    ai_text = result["answer"]
    ai_sources = result["sources"]

    supabase.table("chat_messages").insert({
        "user_id": current_user_id,
        "role": "assistant",
        "content": ai_text,
        "sources": ai_sources
    }).execute()

    #print(result)

    return {
        "response": ai_text,
        "sources": ai_sources 
    }


UPLOAD_DIR = Path() / 'uploads'
# Takes the file from frontend, saves it temporarily, parses it, chunks, embeds & indexes into vector db
@app.post("/ingestfile")
async def ingest_file(background_tasks: BackgroundTasks, file_uploads: list[UploadFile], current_user_id: str = Depends(get_current_user)):
    try:
        for file_upload in file_uploads:
            data = await file_upload.read()
            save_to = UPLOAD_DIR / file_upload.filename
            with open(save_to, 'wb') as f:
                f.write(data)
            background_tasks.add_task(process_and_index_file, str(save_to), current_user_id)
        
        return {"filenames": [f.filename for f in file_uploads]}
    except Exception as e:
        #if fails return a 500 error to the UI
        print(f"Ingestion failed: {e}")
        #clean up the file if it exists and failed halfway
        if 'save_to' in locals() and os.path.exists(save_to):
            os.remove(save_to)
            
        raise HTTPException(status_code=500, detail=str(e))

import os
from supabase import create_client, Client
SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

@app.get("/files")
def getAllFiles(current_user_id: str = Depends(get_current_user)):
    response = supabase.table("files").select("*").eq("user_id", current_user_id).execute()
    return response.data

@app.delete("/files/{file_id}")
async def delete_file(file_id: str, user_id: str = Depends(get_current_user)):
    response = supabase.table("files").delete()\
        .eq("id", file_id)\
        .eq("user_id", user_id)\
        .execute()
        
    if len(response.data) == 0:
        return {"error": "File not found or access denied"}
        
    return {"message": "File and all associated vector chunks deleted successfully"}


@app.get("/history")
async def get_history(user_id: str = Depends(get_current_user)):
    response = supabase.table("chat_messages")\
        .select("*")\
        .eq("user_id", user_id)\
        .order("created_at", desc=True)\
        .limit(20)\
        .execute()
    #db returned [Newest ... Oldest]. Reverse to [Oldest ... Newest] for chat display.
    return response.data[::-1]