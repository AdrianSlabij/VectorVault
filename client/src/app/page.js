import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Database,
  Zap,
  ArrowRight,
  Upload,
  MessageSquare,
} from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      {/* Nav Header */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="h-8 w-8 bg-black dark:bg-white rounded-lg flex items-center justify-center">
            <Database className="h-4 w-4 text-white dark:text-black" />
          </div>
          Vector Vault
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/sign-in">
            <Button variant="ghost">Log in</Button>
          </Link>
          <Link href="/sign-in">
            <Button>Sign Up</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Main section*/}
        <section className="py-24 md:py-32 px-6 text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            {" "}
            <span className="text-4xl md:text-6xl tracking-tight font-normal">
              Turn your
            </span>{" "}
            Documents{" "}
            <span className="text-4xl md:text-6xl tracking-tight font-normal">
              into
            </span>{" "}
            <br className="hidden md:block" />
            <span>Intelligent Conversations</span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF, TXT, or DOCX files and instantly get a custom
            AI chatbot that knows every detail. Build, manage, and chat with
            your own private knowledge base in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-in">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Building
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Explanatin Section*/}
        <section className="border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950">
          <div className="max-w-5xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-12 md:gap-24">
              {/* How it works section*/}
              <div className="space-y-6 md:sticky md:top-32 h-fit">
                <h2 className="text-3xl font-bold tracking-tight">
                  How It Works
                </h2>
                <p className="text-lg text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  We use{" "}
                  <span className="text-zinc-900 dark:text-zinc-100 font-medium">
                    Retrieval-Augmented Generation (RAG)
                  </span>
                  . RAG helps Large Language Models (LLMs) to search through the
                  files it has access to, and generate accurate and cited
                  answers. This ensures responses are accurate and specific to
                  you without the cost of retraining an LLM.
                </p>
                <div className="pt-4">
                  <Link
                    href="https://aws.amazon.com/what-is/retrieval-augmented-generation/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="outline">Learn more about RAG</Button>
                  </Link>
                </div>
              </div>

              {/* 3 Steps section */}
              <div className="space-y-12">
                {/* Step 1- Ingest+Secure */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <Upload className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      1. Ingest & Secure
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Upload your documents. We store them in a
                      secluded database that only you can access.
                    </p>
                  </div>
                </div>

                {/* Step 2  - Vectorize*/}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <Zap className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">2. Vectorize</h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      We convert your text into{" "}
                      <strong>Vector Embeddings</strong>. This allows the system
                      to understand the <em>semantic meaning</em> behind your
                      data, not just keyword matching.
                    </p>
                  </div>
                </div>

                {/* Step 3 - Chat */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="h-10 w-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">
                      3. Chat with Context
                    </h3>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      Powered by <strong>Gemini 2.5 Flash</strong>. When you ask
                      a question, we retrieve the exact page needed and the AI
                      summarizes the answer for you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* footer*/}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500 bg-white dark:bg-zinc-950">
        <p>
          &copy; {new Date().getFullYear()} Vector Vault Inc. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
