import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Shield, Zap, ArrowRight, Lock } from "lucide-react";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
      {/* --- Navigation --- */}
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
        {/* --- Hero Section --- */}
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
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Intelligent Conversations
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Upload your PDFs, text files, and data, and instantly get a custom
            AI chatbot that knows every detail. Build, manage, and chat with
            your own private knowledge base in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/sign-in">
              <Button size="lg" className="h-12 px-8 text-base">
                Start Building Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

        {/* --- Features / Explanation Grid --- */}
        <section className="py-20 px-6 bg-zinc-100/50 dark:bg-zinc-900/50 border-y border-zinc-200 dark:border-zinc-800">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-2">
              <h2 className="text-3xl font-bold">How It Works</h2>
              <p className="text-zinc-500 dark:text-zinc-400">
                Powered by Retrieval-Augmented Generation (RAG), a technique
                that improves Large Language Models (LLMs) by allowing them to
                consult an external, trusted knowledge base before answering a
                question. Standard LLMs rely on static training data, which can
                be outdated or inaccurate. RAG "retrieves" the most current
                relevant data and feeds it to the AI. This ensures responses are
                accurate, up-to-date, and specific to you without
                the high cost of retraining the model.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1: The Retrieval (RAG) */}
              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Zap className="h-10 w-10 text-amber-500 mb-2" />
                  <CardTitle>Semantic Search</CardTitle>
                  <CardDescription>
                    Your documents are turned into{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Vector Embeddings,
                    </span>{" "}
                    to understand the <i>meaning</i> behind your questions and
                    find the exact page you need.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 2: The Intelligence (LLM) */}
              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <div className="h-10 w-10 text-blue-500 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-10 w-10"
                    >
                      <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
                      <path d="M17 4a2 2 0 0 0 2 2a2 2 0 0 0 -2 2a2 2 0 0 0 -2 -2a2 2 0 0 0 2 -2" />
                      <path d="M19 11h2m-1 -1v2" />
                    </svg>
                  </div>
                  <CardTitle>Powered by Gemini</CardTitle>
                  <CardDescription>
                    Built on Google's{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      Gemini 2.5 Flash
                    </span>{" "}
                    Text Model. It reads the retrieved context and generates
                    natural, human-like answers cited directly from your files.
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Feature 3: The Storage (DB) */}
              <Card className="bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <Shield className="h-10 w-10 text-green-500 mb-2" />
                  <CardTitle>Secured Storage</CardTitle>
                  <CardDescription>
                    Your knowledge base is stored securely in our{" "}
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                      database
                    </span>
                    , and only you can access your private data.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* --- Bottom CTA --- */}
        <section className="py-24 px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">
              Ready to chat with your data?
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Upload your first PDF and start asking questions in seconds.
            </p>
            <Link href="/sign-in">
              <Button size="lg" className="mt-4">
                Start Building Free
              </Button>
            </Link>
            <p className="text-xs text-zinc-500 pt-4">
              No credit card required.
            </p>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-sm text-zinc-500">
        <p>
          &copy; {new Date().getFullYear()} Vector Vault Inc. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
