# Vector Vault

**Vector Vault** is a full-stack Retrieval-Augmented Generation (RAG) platform that enables users to upload private documents (PDFs, text files) and engage in context-aware conversations with them.

Built to bridge the gap between static documents and dynamic intelligence, this project leverages a high-performance Python backend for vector processing and a responsive Next.js frontend for a seamless user experience.

<img src="https://github.com/user-attachments/assets/eb2c31f5-aa83-4204-9dee-9159b3bec730" alt="Vector Vault Dashboard" width="100%">

## Key Features

* ** Document Ingestion Pipeline:** Custom ETL pipeline using **LangChain** to parse, clean, and chunk PDF/Text documents. Includes robust error handling for sanitizing complex file encodings (e.g., removing null bytes).
* ** Semantic Search:** Uses **Google Gemini** embeddings and **Supabase (pgvector)** to perform high-accuracy cosine similarity searches, retrieving only the most relevant context for every query.
* ** Interactive Chat Interface:** Real-time chat UI built with **React & Shadcn/UI**, featuring optimistic UI updates, source citation (page numbers/filenames), and persistent chat history.
* ** Secure Infrastructure:** Implements **Row Level Security (RLS)** via Supabase Auth. Includes middleware protection and secure server-side session validation to ensure data privacy.

## 🛠️ Tech Stack

### Frontend
* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + Shadcn/UI

### Backend & AI
* **API:** Python FastAPI
* **Orchestration:** LangChain
* **Database:** Supabase (PostgreSQL + pgvector)

* **LLM/Embeddings:** Google Gemini Models

