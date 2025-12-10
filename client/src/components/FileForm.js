"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FileForm() {
  const [files, setFiles] = useState([]);

  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    async function getUserData() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        setToken(session.access_token); // the badge we are sending to backend
        setUserId(session.user.id); //just for logging
        console.log("My User ID is:", session.user.id);
      }
    }
    getUserData();
  }, []);

  const handleFileInputChange = (e) => {
    //console.log(e.target.files)
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    if (!token) return;

    e.preventDefault();

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file_uploads", file);
    });

    console.log(formData);

    try {
      const endpoint = "http://localhost:8000/ingestfile";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (res.ok) {
        console.log("File upload successfully");
        const data = await res.json();
        console.log(data);
      } else {
        console.log("File upload failed");
      }
    } catch (error) {
      console.error("Error with upload:", error);
    }
  };

  return (
    <div>
      <h1>Upload File</h1>

      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileInputChange} multiple></input>
        <button type="submit">Upload</button>
      </form>
    </div>
  );
}
