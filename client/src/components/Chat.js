"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Loader2,
  MessageSquare,
  Bot,
  User,
  FileText,
  Quote,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import { fetchChatHistory } from "@/api/getChatHistory";
import { sendChatMessage } from "@/api/sendChatMessage";

export default function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
//loading state to prevent wrong ui "flash"
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeSource, setActiveSource] = useState(null);

  const messagesEndRef = useRef(null);

  //Fetch Files (And handle loading state)
  useEffect(() => {
    const fetchFiles = async () => {
      if (!token) return;
      try {
        const res = await fetch("http://localhost:8000/files", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          setUploadedFiles(data);
        }
      } catch (err) {
        console.error("Failed to fetch files", err);
      } finally {
        //stop loading once we know if files exist or not
        setIsLoadingFiles(false);
      }
    };
    
    fetchFiles();
  }, [token]);

  //load chat history
  useEffect(() => {
    const loadHistory = async () => {
      if (!token) return;
      const history = await fetchChatHistory(token);
      const formattedHistory = history.map((msg) => ({
        ...msg,
        sources: msg.sources || [],
      }));
      setMessages(formattedHistory);
    };
    loadHistory();
  }, [token]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setQuery("");

    try {
      const data = await sendChatMessage(token, userMsg.content);

      const aiMsg = {
        role: "assistant",
        content: data.response,
        sources: data.sources || [],
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // 3. Prevent rendering until we verify file status
  if (isLoadingFiles) {
    return (
      <Card className="flex flex-col h-[80vh] border shadow-sm items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </Card>
    );
  }

  const hasFiles = uploadedFiles.length > 0;

  return (
    <>
      <Card className="flex flex-col h-[80vh] border shadow-sm relative">
        {/* Messages Area */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          
          {/* LOGIC: 
              case a: If No Files -> Show "Knowledge Base Empty" (Blocks history)
              case b: If Files Exist but No History -> Show "Ask a Question" 
              case c: If Files & History Exist -> Show Messages
          */}
          
          {!hasFiles ? (
             // case a: no files (block everything) ---
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="flex flex-col items-center max-w-sm">
                <div className="bg-orange-100 p-4 rounded-full mb-4">
                  <UploadCloud className="w-10 h-10 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">
                  Knowledge Base Empty
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                  I can't answer questions yet because there are no documents.
                  Please upload a PDF or TXT file to get started.
                </p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            // case b: files exist, but no messages ---
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="flex flex-col items-center">
                <MessageSquare className="w-12 h-12 mb-4 text-slate-300" />
                <p className="text-sm text-slate-500">
                  Ask a question about your documents to start.
                </p>
              </div>
            </div>
          ) : (
            // case c: active chat ---
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex w-full ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex max-w-[85%] gap-2 ${
                    msg.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      msg.role === "user"
                        ? "bg-blue-600"
                        : "bg-primary text-primary-foreground"
                    }`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <Bot className="w-5 h-5" />
                    )}
                  </div>

                  <div
                    className={`p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-tr-none"
                        : "bg-white border text-gray-800 rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                    {msg.role !== "user" &&
                      msg.sources &&
                      msg.sources.length > 0 && (
                        <div className="mt-3 pt-2 border-t border-gray-100">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                            Sources
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {msg.sources.map((source, i) => (
                              <button
                                key={i}
                                onClick={() => setActiveSource(source)}
                                className="inline-flex items-center text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded border border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                <FileText className="w-3 h-3 mr-1" />
                                <span className="font-medium mr-1 truncate max-w-[100px]">
                                  {source.source}
                                </span>
                                <span className="text-gray-300 mx-1">|</span>
                                <span className="text-gray-500">
                                  p. {source.page}
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start w-full">
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </CardContent>

        {/* Input Area */}
        <CardFooter className="p-4 border-t bg-white rounded-b-lg">
          <form
            onSubmit={handleChat}
            className="flex w-full items-center space-x-2"
          >
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={hasFiles ? "Ask a question..." : "Upload a file first..."}
              disabled={loading || !hasFiles} 
              className="flex-1 focus-visible:ring-blue-500"
            />
            <Button
              type="submit"
              disabled={loading || !query.trim() || !hasFiles} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* Source Viewer Sheet */}
      <Sheet open={!!activeSource} onOpenChange={() => setActiveSource(null)}>
        <SheetContent className="w-[400px] sm:w-[540px] flex flex-col gap-0 p-0 sm:max-w-md">
          <SheetHeader className="px-6 py-4 border-b">
            <SheetTitle className="flex items-center gap-2 text-lg">
              <FileText className="h-5 w-5 text-blue-600" />
              Source Context
            </SheetTitle>
            <SheetDescription>
              The exact text snippet used to generate the answer.
            </SheetDescription>
          </SheetHeader>

          {activeSource && (
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-50/50">
              <div className="px-6 py-4 flex gap-2 flex-wrap bg-white border-b">
                <Badge variant="secondary" className="px-2 py-1 text-xs">
                  File: {activeSource.source}
                </Badge>
                <Badge variant="outline" className="px-2 py-1 text-xs">
                  Page {activeSource.page}
                </Badge>
              </div>

              <div className="flex-1 relative overflow-hidden p-6">
                <div className="absolute top-6 left-6 opacity-5 text-primary pointer-events-none">
                  <Quote size={80} />
                </div>

                <ScrollArea className="h-full pr-4">
                  <div className="bg-white p-4 rounded-md border shadow-sm relative z-10">
                    <p className="text-sm text-slate-700 leading-7">
                      {"... "}
                      {activeSource.content}
                    </p>
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}