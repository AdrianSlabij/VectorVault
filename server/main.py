from fastapi import FastAPI, Path, Query, UploadFile, Depends, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from auth import get_current_user
from pydantic import BaseModel, Field
from typing import Optional
from pathlib import Path
from ingestion import process_and_index_file
from query_llm import query_llm

# uvicorn main:app --reload   

app = FastAPI()

# Configure CORS (Critical for React to talk to Python)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows Next.js to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "FastAPI is running", "message": "Ready for RAG!"}

# @app.get("/api/health")
# def health_check():
#     return {"status": "ok"}

# @app.post("/api/test-auth")
# async def test_auth(user_id: str = Depends(verify_user)):
#     return {
#         "message": "Success! You are authorized.",
#         "your_user_id": user_id
#     }
#t
# todos = []

# class TodoItem(BaseModel):
#     id: int = Field(description="ID of the todolist task", gt=0)
#     item: str
#     desc: str | None = None
    


# @app.post("/api/todos")
# def create(todo: TodoItem):
#     todos.append(todo)
#     print(todos)
#     return todo


# @app.get("/api/todos")
# def readAll(page: Optional[int] = Query(None, description="the page number for paginated view", gt=0)):
#     print(todos)
#     return todos

# @app.get("/api/todos/{id}")
# def readTask(id: int = Path(title="The id of the task",gt=-1)):
#     for item in todos:
#         if item.id==id:
#             return item
#     return {"message":"task not found"}

# @app.put("/api/todos/{id}")
# def update(id: int, todo: TodoItem):
#     for index, item in enumerate(todos):
#         if item.id == id:
#             todos[index]=todo
#             print(todos)
#             return todo
#     return {"message": "Todo not found"}

# @app.delete("/api/todos/{id}")
# def delete(id: int):
#     for index, item in enumerate(todos):
#         if item.id == id:
#             todos.pop(index)
#             return {"message": "Todo removed", "todos": todos}



# ----- CRUD END -------
# ----- RAG Begin -------

class ChatRequest(BaseModel):
    query: str

class llm_QuestionResponse(BaseModel):
    relevant_document: str
    answer: str

@app.post("/ask")
def chat(message: ChatRequest, current_user_id: str = Depends(get_current_user)):
    user_message = message.query
    ai_response = query_llm(user_message, current_user_id)
    print(ai_response)
    return {"response": ai_response}


UPLOAD_DIR = Path() / 'uploads'
# Takes the file from frontend, saves it temporarily, parses it, chunks, embeds & indexes into vector db
@app.post("/ingestfile")
async def ingest_file(background_tasks: BackgroundTasks, file_uploads: list[UploadFile], current_user_id: str = Depends(get_current_user)):
    for file_upload in file_uploads:
        data = await file_upload.read()
        save_to = UPLOAD_DIR / file_upload.filename
        with open(save_to, 'wb') as f:
            f.write(data)
        background_tasks.add_task(process_and_index_file, str(save_to), current_user_id)
    
    return {"filenames": [f.filename for f in file_uploads]}

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

    
