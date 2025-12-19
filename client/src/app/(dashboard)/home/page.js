import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileUp, MessageSquare, ArrowRight } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex h-[calc(100vh-65px)] flex-col items-center justify-center bg-zinc-50 p-6 dark:bg-black">
      
      <div className="max-w-3xl w-full space-y-8 text-center">
        
        {/* --- Welcome Header --- */}
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
            Welcome to Vector Vault
          </h1>
          <p className="text-lg text-zinc-500 dark:text-zinc-400">
            Your secure knowledge base is ready. Choose an action to get started.
          </p>
        </div>

        {/* --- Action Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
          
          {/* Action 1: Upload Files */}
          <Link href="/files" className="group">
            <Card className="h-full border-zinc-200 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <FileUp className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Upload Documents</CardTitle>
                <CardDescription>
                  Manage your knowledge base. Upload PDF, TXT, or DOCX files to be indexed.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end pt-0">
                 <span className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Go to Files <ArrowRight className="ml-1 h-4 w-4" />
                 </span>
              </CardContent>
            </Card>
          </Link>

          {/* Action 2: Chat */}
          <Link href="/chat" className="group">
            <Card className="h-full border-zinc-200 transition-all hover:border-zinc-400 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl">Ask Questions</CardTitle>
                <CardDescription>
                  Interact with your data. Start a new chat session to retrieve insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-end pt-0">
                 <span className="text-sm font-medium text-violet-600 dark:text-violet-400 flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    Start Chatting <ArrowRight className="ml-1 h-4 w-4" />
                 </span>
              </CardContent>
            </Card>
          </Link>

        </div>
      </div>
    </div>
  );
}