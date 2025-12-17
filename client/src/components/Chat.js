"use client";

import { useState } from "react";
import { Send, Loader2, MessageSquare, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect, useRef } from "react";
import { fetchChatHistory } from "@/api/getChatHistory";
import { sendChatMessage } from "@/api/sendChatMessage";


export default function Chat({ token }) {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 1. Load History on Mount
  useEffect(() => {
    const loadHistory = async () => {
      const history = await fetchChatHistory(token);
      setMessages(history);
    };
    if (token) loadHistory();
  }, [token]);

  // 2. Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Optimistic UI: Add user message immediately
    const userMsg = { role: "user", content: query };
    setMessages((prev) => [...prev, userMsg]);
    
    setLoading(true);
    setQuery(""); // Clear input

    try {
      // Send to backend
      const data = await sendChatMessage(token, userMsg.content);
      
      // Add AI response
      const aiMsg = { role: "assistant", content: data.response };
      setMessages((prev) => [...prev, aiMsg]);
      
    } catch (error) {
      console.error("Chat error:", error);
      // Optional: Add a temporary error message to the chat
      setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, I encountered an error." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-[600px] border shadow-sm">
      {/* Header */}
      {/* <CardHeader className="border-b px-6 py-4 bg-white rounded-t-lg">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bot className="w-6 h-6 text-blue-600" />
          AI Assistant
        </CardTitle>
      </CardHeader> */}

      {/* Messages Area */}
      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Ask a question about your documents to start.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex w-full ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex max-w-[80%] gap-2 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                {/* Avatar Icons */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user" ? "bg-blue-600" : "bg-emerald-600"
                }`}>
                    {msg.role === "user" ? <User className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-white" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-lg text-sm shadow-sm whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border text-gray-800 rounded-tl-none"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          ))
        )}
        
        {/* Loading Indicator */}
        {loading && (
            <div className="flex justify-start w-full">
                <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-3 text-xs text-gray-500">
                    <Loader2 className="w-3 h-3 animate-spin" /> Thinking...
                </div>
            </div>
        )}
        
        {/* Scroll Anchor */}
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
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1 focus-visible:ring-blue-500"
          />
          <Button 
            type="submit" 
            disabled={loading || !query.trim()}
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
  );
}