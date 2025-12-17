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
        "match_threshold": 0.5, # Lowered slightly to ensure results
        "match_count": 5,
        "filter": {"user_id": current_user_id} # Secure filter
    }

    try:
        response = supabase.rpc('match_documents', params).execute()
        formatted_context = []
        for doc in response.data:
            # PyPDFLoader saves pages as 0-indexed (0, 1, 2...), so we add +1 for humans
            page_number = doc['metadata'].get('page', 0) + 1 
            source_file = doc['metadata'].get('source', 'Unknown File')
            content = doc['content']
            
            # Create a block that the LLM can read clearly
            entry = f"--- Source: {source_file} (Page {page_number}) ---\n{content}\n"
            formatted_context.append(entry)
            
        return "\n\n".join(formatted_context)
    except Exception as e:
        print(f"Supabase Error:{e}")
        return ""



def query_llm(message: str, user_id):

    context = retrieve_docs(message, user_id)

    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash-lite",
        temperature=0.5,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        google_api_key=os.getenv("GEMINI_API_KEY")
    )

    prompt = ChatPromptTemplate.from_template("""
    You are a helpful assistant. Answer the question based ONLY on the provided context.
    
    CRITICAL INSTRUCTION:
    Every time you state a fact, you MUST cite the source and page number in parentheses at the end of the sentence. 
    Example: "Obama was the 44th president of the U.S. [Source: Obama.pdf, Page 2]."
    
    If the answer is not in the context, say "I don't have that information."
    
    Context:
    {context}
    
    Question: 
    {question}
    """)

    # 4. Run Chain
    chain = prompt | llm | StrOutputParser()
    
    return chain.invoke({
        "context": context,
        "question": message
    })

