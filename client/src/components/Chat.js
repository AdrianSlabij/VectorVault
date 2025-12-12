"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Chat({token}) {
    const [query, setQuery] = useState("")

    const handleChat = async (e) =>{
        e.preventDefault()
        console.log(query)
        try{
            res = await fetch("http://localhost:8000/ask",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({query})
                
            } 
        ) 
        if (!res.ok){
            console.log("Error with sending chat")
        }
        }catch(error){
            console.warn("Error in sending message to backend:",error)

        }


    }


  return (
    <div>
      <h1>Chat</h1>

      <h2>Ask your Question</h2>

        <input type="text" value={query} onChange={(e)=>{setQuery(e.target.value)}} placeholder="Ask a question..."></input>
        <button onClick={handleChat}>Send</button>

    </div>
  );
}
