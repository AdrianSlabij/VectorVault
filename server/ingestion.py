import os
from langchain_community.document_loaders import PyMuPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from norm_embeddings import NormalizedGoogleEmbeddings
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

if not os.getenv("GEMINI_API_KEY"):
    print("no gemini key")

embeddings = NormalizedGoogleEmbeddings(
    model="models/gemini-embedding-001",
    google_api_key=os.getenv("GEMINI_API_KEY")
)

def sanitize_text(text):
    """
    Removes Null Bytes (\x00) which cause PostgreSQL to crash.
    """
    if isinstance(text, str):
        return text.replace("\x00", "")
    return text

def process_and_index_file(file_path: str, user_id: str):
    """
    1. Registers the file in the 'files' table.
    2. Loads, splits, and embeds the content.
    3. Inserts chunks linked to both user_id and file_id.
    4. Performs a rollback (deletes file record) if chunking fails.
    """
    file_id = None

    try:
        filename = os.path.basename(file_path)
        print(f"--- 1. Registering File: {filename} ---")
        
        #Insert into parent 'files' table FIRST to generate a file_id
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
            loader = PyMuPDFLoader(file_path)
        elif file_path.endswith(".txt") or file_path.endswith(".md"):
            loader = TextLoader(file_path, encoding="utf-8")
        else:
            raise ValueError(f"Unsupported file type: {file_path}")
            
        raw_documents = loader.load()
        total_text_length = sum(len(doc.page_content) for doc in raw_documents)
        
        #check if a multiple page document has less than 50 characters of text
        if len(raw_documents) > 0 and total_text_length < 50:
            raise ValueError(
                "This PDF appears to be a scanned image. "
                "Please upload a PDF with selectable text."
            )
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
        
        texts = []
        metadatas = []
        
        for d in docs:
            #Clean the main text content (to avoid storing null bytes in postgres)
            clean_content = sanitize_text(d.page_content)
            
            #Clean the metadata values (Source, Title, etc....)
            clean_metadata = {}
            for key, value in d.metadata.items():
                clean_metadata[key] = sanitize_text(value)
            
            clean_metadata["source"] = filename
            clean_metadata["page"] = clean_metadata.get("page", 0)
            
            texts.append(clean_content)
            metadatas.append(clean_metadata)

        vectors = embeddings.embed_documents(texts)
        
        rows_to_insert = []
        
        for text, metadata, vector in zip(texts, metadatas, vectors):
            rows_to_insert.append({
                "content": text, 
                "embedding": vector,
                "metadata": metadata, 
                "user_id": user_id,
                "file_id": file_id #links chunk to the parent file record
            })

        print(f"--- 5. Inserting Chunks to Supabase ---")
        
        response = supabase.table("document_chunks").insert(rows_to_insert).execute()
        
        print(f"Successfully indexed {len(rows_to_insert)} chunks for file {file_id}")
        
    except Exception as e:
        print(f"Error processing file: {e}")
        
        #if chunking fails, delete the file record so the DB stays clean
        if file_id:
            print(f"Rolling back: Deleting file record {file_id}")
            supabase.table("files").delete().eq("id", file_id).execute()
        
    finally:
        #cleanup: remove the temporary file from the local system
        if os.path.exists(file_path):
            os.remove(file_path)
            print("Temp file removed.")