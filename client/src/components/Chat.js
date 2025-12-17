"use client";

import { useState } from "react";
import { Send, Loader2, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Chat({ token }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Optional: Store the response to display it
  const [lastResponse, setLastResponse] = useState(null);

  const handleChat = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setLastResponse(null); 
    console.log("Sending query:", query);

    try {
      const res = await fetch("http://localhost:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      if (!res.ok) {
        console.error("Error with sending chat");
        setLastResponse("Error: Could not fetch response.");
      } else {
        const data = await res.json();
        console.log("Received response:", data);
        setLastResponse(data.response || "Message sent!"); 
      }
    } catch (error) {
      console.warn("Error in sending message to backend:", error);
      setLastResponse("Error: Network issue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="flex flex-col h-full border-none shadow-none">
      {/* Header Section */}
      <CardHeader className="border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="w-5 h-5" />
          Chat Assistant
        </CardTitle>
      </CardHeader>

      {/* Messages / Display Area */}
      <CardContent className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
        {!lastResponse && !loading && (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-center">
            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-sm">Ask a question to start the conversation.</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center gap-2 text-gray-500 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Thinking...
          </div>
        )}

        {/* Response Display (Simple version) */}
        {lastResponse && (
          <div className="bg-white border rounded-lg p-4 shadow-sm text-sm leading-relaxed">
            <strong>Response:</strong>
            <p className="mt-1 text-gray-700">{lastResponse}</p>
          </div>
        )}
      </CardContent>

      {/* Input Area */}
      <CardFooter className="p-4 border-t bg-white">
        <form
          onSubmit={handleChat}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !query}>
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