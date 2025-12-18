from langchain_google_genai import ChatGoogleGenerativeAI
import os
from langchain.agents.middleware import dynamic_prompt, ModelRequest
from supabase import create_client, Client
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser

SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
from norm_embeddings import NormalizedGoogleEmbeddings

embeddings = NormalizedGoogleEmbeddings(model="models/gemini-embedding-001",google_api_key=os.getenv("GEMINI_API_KEY"))

def retrieve_docs(query: str, current_user_id: str) -> str:
    """Search the customer database for records matching the query
    Args:
        query: Search terms to look for
        limit: Maximum number of results to return
    """
    print(query, current_user_id)
    query_embedding = embeddings.embed_query(query)
    params = {
        "query_embedding": query_embedding,
        "match_threshold": 0.5,
        "match_count": 5,
        "filter": {"user_id": current_user_id}
    }

    try:
        response = supabase.rpc('match_documents', params).execute()
        
        context_text = ""
        sources_list = []
        seen_sources = set() #to track duplicates

        for doc in response.data:
            page = doc['metadata'].get('page', 0) + 1
            source = doc['metadata'].get('source', 'Unknown')
            content = doc['content']
            chunk_id = doc.get('id', 0)
            
            #build Context String for LLM
            context_text += f"--- Source: {source} (Page {page}) ---\n{content}\n\n"
            
            #build clean source list for UI (Deduplicated)
            source_key = f"{source}-{page}"
            if source_key not in seen_sources:
                sources_list.append({
                    "id": chunk_id,
                    "source": source,
                    "page": page,
                    "content": content
                })
                seen_sources.add(source_key)

        return context_text, sources_list

    except Exception as e:
        print(f"Supabase Error: {e}")
        return "", []



def query_llm(message: str, user_id):
    #Get both text and the raw list
    context_text, sources = retrieve_docs(message, user_id)

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        temperature=0.3,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

    prompt = ChatPromptTemplate.from_template("""
    You are a helpful assistant. Answer the question based ONLY on the provided context.
    If the answer is not in the context, say "I don't have that information."
    
    Context:
    {context}
    
    Question: 
    {question}
    """)

    chain = prompt | llm | StrOutputParser()
    
    answer = chain.invoke({
        "context": context_text,
        "question": message
    })

    return {
        "answer": answer,
        "sources": sources 
    }