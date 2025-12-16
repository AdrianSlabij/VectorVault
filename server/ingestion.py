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