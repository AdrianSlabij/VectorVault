import os
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

from supabase import create_client, Client
from norm_embeddings import NormalizedGoogleEmbeddings

SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

if not os.getenv("GEMINI_API_KEY"):
    print("no gemini key")

embeddings = NormalizedGoogleEmbeddings(model="models/gemini-embedding-001",google_api_key=os.getenv("GEMINI_API_KEY"))



def process_and_index_file(file_path: str, user_id: str):
    """
    Loads a file, registers it in the 'files' table, splits it, embeds it, 
    and inserts chunks linked to the file ID into Supabase.
    """
    file_id = None # Initialize for error handling scope

    try:
        filename = os.path.basename(file_path)
        print(f"--- 1. Registering File: {filename} ---")
        
        # 1. Insert into parent 'files' table FIRST
        file_response = supabase.table("files").insert({
            "user_id": user_id,
            "filename": filename
        }).execute()
        
        if not file_response.data:
            raise Exception("Failed to create file record in database")
            
        file_id = file_response.data[0]['id']
        print(f"File registered with ID: {file_id}")

        print(f"--- 2. Loading file: {file_path} ---")
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path)
        elif file_path.endswith(".txt"):
            # Text files often need explicit encoding handling
            loader = TextLoader(file_path, encoding="utf-8")
            
        raw_documents = loader.load()
        print(f"Loaded {len(raw_documents)} pages/documents.")

        print(f"--- 3. Splitting text ---")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=250,
            separators=["\n\n", "\n", " ", ""]
        )
        docs = text_splitter.split_documents(raw_documents)
        print(f"Split into {len(docs)} chunks.")

        print(f"--- 4. Embedding and Formatting ---")
        
        texts = [d.page_content for d in docs]
        vectors = embeddings.embed_documents(texts)
        
        rows_to_insert = []
        for doc, vector in zip(docs, vectors):
            rows_to_insert.append({
                "content": doc.page_content,
                "embedding": vector,
                "metadata": {
                    "source": filename,
                    "page": doc.metadata.get("page", 0)
                },
                "user_id": user_id,
                "file_id": file_id  # <--- CRITICAL: Link chunk to parent file
            })

        print(f"--- 5. Inserting Chunks to Supabase ---")
        
        # Batch insert is safer for large files, but direct is fine for small ones
        response = supabase.table("document_chunks").insert(rows_to_insert).execute()
        
        print(f"Successfully indexed {len(rows_to_insert)} chunks for file {file_id}")
        
    except Exception as e:
        print(f"Error processing file: {e}")
        
        # Rollback: If chunking fails, delete the 'ghost' file record
        if file_id:
            print(f"Rolling back: Deleting file record {file_id}")
            supabase.table("files").delete().eq("id", file_id).execute()
        
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
            print("Temp file removed.")
    """
    Loads a file, splits it, embeds it, and manually inserts rows into Supabase
    """
    try:
        print(f"--- 1. Loading file: {file_path} ---")
        if file_path.endswith(".pdf"):
            loader = PyPDFLoader(file_path) #supports only upload of pdf
        else:
            loader = TextLoader(file_path) #textloader not working
            
        raw_documents = loader.load()
        print(f"Loaded {len(raw_documents)} pages/documents.")

        print(f"--- 2. Splitting text ---")
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=250,
            separators=["\n\n", "\n", " ", ""]
        )
        docs = text_splitter.split_documents(raw_documents)
        print(f"Split into {len(docs)} chunks.")

        print(f"--- 3. Embedding and Formatting ---")
        
        # Convert text to vectors manually so that we can store in DB with a user_id attached
        texts = [d.page_content for d in docs]
        vectors = embeddings.embed_documents(texts)
        
        # build the data structure the table expects
        rows_to_insert = []
        for doc, vector in zip(docs, vectors):
            rows_to_insert.append({
                "content": doc.page_content,
                "embedding": vector,
                "metadata": {
                    "source": os.path.basename(file_path),
                    "page": doc.metadata.get("page", 0)
                },
                "user_id": user_id  
            })

        print(f"--- 4. Inserting to Supabase ---")
        
        #insert into db. Could consider batching
        response = supabase.table("document_chunks").insert(rows_to_insert).execute()
        
        print(f"Successfully indexed {len(rows_to_insert)} chunks for user {user_id}")
        
    except Exception as e:
        print(f"Error processing file: {e}")
        
    finally:
        # Remove the temporary file regardless of success/failure
        if os.path.exists(file_path):
            os.remove(file_path)
            print("Temp file removed.")