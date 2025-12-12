"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function FileForm({token}) {
  const [files, setFiles] = useState([]);
  const supabase = createClient();


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
