"use client";

import { useState } from "react";
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
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

export default function FileForm({ token }) {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null); // { type: 'success' | 'error', message: '' }

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      // Create an array from the file list
      const selectedFiles = Array.from(e.target.files);
      setFiles(selectedFiles);
      setStatus(null); // Clear previous status messages
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setStatus({ type: "error", message: "Authentication missing." });
      return;
    }
    if (files.length === 0) {
      setStatus({ type: "error", message: "Please select at least one file." });
      return;
    }

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("file_uploads", file);
    });

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
        const data = await res.json();
        console.log("Response:", data);
        setStatus({ type: "success", message: `Successfully uploaded ${files.length} file(s)!` });
        setFiles([]); // Clear form on success
      } else {
        setStatus({ type: "error", message: "Upload failed. Server rejected the files." });
      }
    } catch (error) {
      console.error("Error with upload:", error);
      setStatus({ type: "error", message: "Network error. Please try again." });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Documents</CardTitle>
        <CardDescription>
          Select files to ingest into the knowledge base.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="file-upload-form" onSubmit={handleSubmit} className="grid gap-6">
          
          {/* File Input Section */}
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="file_upload">Select Files</Label>
            <Input 
              id="file_upload" 
              type="file" 
              multiple 
              onChange={handleFileInputChange} 
              disabled={uploading}
              className="cursor-pointer"
            />
          </div>

          {/* Selected Files Preview */}
          {files.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Selected ({files.length}):</p>
              <div className="max-h-32 overflow-y-auto space-y-2 border rounded-md p-2 bg-slate-50">
                {files.map((file, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-slate-700">
                    <File className="w-4 h-4 text-blue-500" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {(file.size / 1024).toFixed(0)}kb
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status Messages */}
          {status && (
            <Alert variant={status.type === "error" ? "destructive" : "default"} className={status.type === "success" ? "border-green-500 text-green-700 bg-green-50" : ""}>
              {status.type === "error" ? <AlertCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4 text-green-600" />}
              <AlertTitle>{status.type === "error" ? "Error" : "Success"}</AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

        </form>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button 
          variant="ghost" 
          onClick={() => { setFiles([]); setStatus(null); }}
          disabled={uploading || files.length === 0}
        >
          Clear
        </Button>
        
        <Button 
          type="submit" 
          form="file-upload-form" 
          disabled={uploading || files.length === 0}
        >
          {uploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Uploading...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" /> Upload
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}