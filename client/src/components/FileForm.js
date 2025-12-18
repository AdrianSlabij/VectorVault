"use client";

import { useState, useEffect, useRef } from "react";
import {
  Upload,
  FileText,
  Trash2,
  CheckCircle,
  AlertCircle,
  Loader2,
  X,
  File,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function FileForm({ token }) {
  //state for PENDING uploads
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);
  const [isDragging, setIsDragging] = useState(false); //visual cue for drag over

  //state for SERVER files
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);

  const fileInputRef = useRef(null);

  //Fetch files on mount
  useEffect(() => {
    fetchFiles();
  }, [token]);

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
      setLoadingFiles(false);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setStatus(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (!uploading && e.dataTransfer.files) {
      const newFiles = Array.from(e.dataTransfer.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
      setStatus(null);
    }
  };

  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClearAll = () => {
    setStatus(null);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDelete = async (fileId) => {
    try {
      const res = await fetch(`http://localhost:8000/files/${fileId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setUploadedFiles((prev) => prev.filter((f) => f.id !== fileId));
      } else {
        setStatus({ type: "error", message: "Failed to delete file." });
      }
    } catch (error) {
      console.error("Error deleting:", error);
      setStatus({ type: "error", message: "Network error during deletion." });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token)
      return setStatus({ type: "error", message: "Authentication missing." });
    if (selectedFiles.length === 0)
      return setStatus({ type: "error", message: "Select a file first." });

    setUploading(true);
    setStatus(null);

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("file_uploads", file));

    try {
      const res = await fetch("http://localhost:8000/ingestfile", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      console.log(res);

      if (res.ok) {
        setStatus({ type: "success", message: "Upload successful!" });
        handleClearAll();
        setTimeout(() => fetchFiles(), 1000); //refresh list after a delay to see new file(s) added
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
    <Card className="w-full max-w-3xl mx-auto shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Knowledge Base
        </CardTitle>
        <CardDescription>
          Upload <strong>selectable text PDFs</strong> or <strong>TXT</strong> files to expand
          your AI's context window.
          <br />
          <span className="text-xs text-muted-foreground/70">
            (Scanned images or photos of documents are not currently supported)
          </span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* --- UPLOAD FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* drag and drop area */}
          <div
            className={`
              relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all duration-200
              flex flex-col items-center justify-center gap-2
              ${
                uploading
                  ? "opacity-50 cursor-not-allowed bg-muted/30"
                  : isDragging
                  ? "border-primary bg-primary/5 scale-[1.01]"
                  : "hover:bg-muted/50 hover:border-primary/50"
              }
            `}
            onClick={() => !uploading && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Input
              ref={fileInputRef}
              id="file_upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInputChange}
              disabled={uploading}
              accept=".pdf,.txt"
            />

            <div className="bg-primary/10 p-3 rounded-full mb-2">
              <Upload className="h-6 w-6 text-primary" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragging
                  ? "Drop files here"
                  : "Click to browse or drag files here"}
              </p>
              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, TXT
              </p>
            </div>
          </div>

          {/* Selected File "Badges" */}
          {selectedFiles.length > 0 && (
            <div className="bg-muted/50 p-3 rounded-md border border-dashed animate-in fade-in-0 slide-in-from-top-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-medium text-muted-foreground">
                  Ready to upload ({selectedFiles.length})
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs text-muted-foreground hover:text-destructive"
                  onClick={handleClearAll}
                  disabled={uploading}
                >
                  Clear all
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedFiles.map((file, idx) => (
                  <Badge
                    key={idx}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 flex items-center gap-1"
                  >
                    <span className="truncate max-w-[150px]">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 rounded-full hover:bg-destructive hover:text-destructive-foreground p-0"
                      onClick={(e) => {
                        e.stopPropagation(); //prevent triggering the form submit
                        removeSelectedFile(idx);
                      }}
                      disabled={uploading}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Status alerts */}
          {status && (
            <Alert
              variant={status.type === "error" ? "destructive" : "default"}
              className={
                status.type === "success"
                  ? "border-green-500 text-green-700 bg-green-50"
                  : ""
              }
            >
              {status.type === "error" ? (
                <AlertCircle className="h-4 w-4" />
              ) : (
                <CheckCircle className="h-4 w-4 text-green-600" />
              )}
              <AlertTitle>
                {status.type === "error" ? "Error" : "Success"}
              </AlertTitle>
              <AlertDescription>{status.message}</AlertDescription>
            </Alert>
          )}

          {/* upload button */}
          {selectedFiles.length > 0 && (
            <Button
              type="submit"
              className="w-full transition-all"
              disabled={uploading}
            >
              {uploading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              {uploading
                ? "Uploading..."
                : `Upload ${selectedFiles.length} file(s)`}
            </Button>
          )}
        </form>

        <Separator />

        {/* Document library section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">Library</h3>
            <Badge variant="outline">{uploadedFiles.length} files</Badge>
          </div>

          <div className="border rounded-md bg-card">
            {/* Table Header */}
            <div className="bg-muted/40 px-4 py-2 border-b flex items-center text-xs font-medium text-muted-foreground">
              <span className="flex-1">Filename</span>
              <span className="w-24 text-right">Date</span>
              <span className="w-12 text-center">Action</span>
            </div>

            <ScrollArea className="h-[250px]">
              {loadingFiles ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-xs">Loading library...</span>
                </div>
              ) : uploadedFiles.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-40 text-muted-foreground gap-2">
                  <File className="h-8 w-8 opacity-20" />
                  <span className="text-sm">No documents found.</span>
                </div>
              ) : (
                <div className="divide-y">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center px-4 py-3 hover:bg-muted/30 transition-colors text-sm group"
                    >
                      <div className="flex-1 flex items-center gap-3 min-w-0">
                        <div className="bg-primary/10 p-2 rounded text-primary group-hover:bg-primary/20 transition-colors">
                          <FileText className="h-4 w-4" />
                        </div>
                        <span className="truncate font-medium text-foreground/90">
                          {file.filename}
                        </span>
                      </div>

                      <div className="w-24 text-right text-xs text-muted-foreground">
                        {new Date(file.created_at).toLocaleDateString()}
                      </div>

                      <div className="w-12 flex justify-end">
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete File?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete{" "}
                                <b>{file.filename}</b> and remove all associated
                                knowledge chunks from the database. This action
                                cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(file.id)}
                                className="bg-destructive hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
