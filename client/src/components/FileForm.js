"use client";

import { useState, useEffect } from "react";
import {
  Upload,
  FileText, // Changed icon for variety
  Trash2,   // Icon for delete
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator"; // Optional: npx shadcn-ui@latest add separator

export default function FileForm({ token }) {
  // State for PENDING uploads
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  // State for SERVER files (The database list)
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  // 1. Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, [token]);

const fetchFiles = async () => {
    if (!token) return;
    try {
      // Make sure this matches your backend route (e.g., /api/files vs /files)
      const res = await fetch("http://localhost:8000/files", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        
        // 1. Log the RAW data (This will show your files!)
        console.log("Server response:", data); 
        
        setUploadedFiles(data);
        
        // Don't log 'uploadedFiles' here; it will still be empty!
      }
    } catch (err) {
      console.error("Failed to fetch files", err);
    } finally {
      setLoadingFiles(false);
    }
};

// useEffect(() => {
//   console.log("State updated! Current files:", uploadedFiles);
// }, [uploadedFiles]);

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
      setStatus(null);
    }
  };

  // 2. Handle Delete
  const handleDelete = async (fileId) => {
    if (!confirm("Are you sure? This will delete the file and all its knowledge chunks.")) return;

    try {
      const res = await fetch(`http://localhost:8000/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove from UI immediately without waiting for re-fetch
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        alert("Failed to delete file");
      }
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return setStatus({ type: "error", message: "Authentication missing." });
    if (selectedFiles.length === 0) return setStatus({ type: "error", message: "Select a file first." });

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file", file)); // Ensure backend expects "file" or "file_uploads"

    try {
      const res = await fetch("http://localhost:8000/api/ingest", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (res.ok) {
        setStatus({ type: "success", message: "Upload successful!" });
        setSelectedFiles([]); // Clear selection
        fetchFiles();         // REFRESH the list!
      } else {
        setStatus({ type: "error", message: "Upload failed." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Network error." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Knowledge Base Manager</CardTitle>
        <CardDescription>Upload PDFs to train your AI.</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* --- UPLOAD SECTION --- */}
        <form id="file-upload-form" onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file_upload">Add New Document</Label>
            <Input
              id="file_upload"
              type="file"
              multiple
              onChange={handleFileInputChange}
              disabled={uploading}
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Selected: {selectedFiles.map(f => f.name).join(", ")}
            </div>
          )}

          {status && (
            <Alert variant={status.type === "error" ? "destructive" : "default"}>
              {status.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
              <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
             <Button type="button" variant="ghost" onClick={() => setSelectedFiles([])}>Clear</Button>
             <Button type="submit" disabled={uploading || selectedFiles.length === 0}>
               {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
               Upload
             </Button>
          </div>
        </form>

        <Separator />

        {/* --- FILE LIST SECTION --- */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Uploaded Documents</h3>
          
          {loadingFiles ? (
            <div className="flex justify-center p-4"><Loader2 className="animate-spin" /></div>
          ) : uploadedFiles.length === 0 ? (
             <p className="text-sm text-gray-500 text-center py-4">No documents found.</p>
          ) : (
            <div className="border rounded-md divide-y">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 hover:bg-slate-50 transition">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{file.filename}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(file.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}