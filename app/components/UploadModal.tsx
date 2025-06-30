"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
    />
  </svg>
);

export default function UploadModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: UploadModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  if (!isOpen) return null;

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    console.info("File selected: ", file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("network", "private");

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const token = localStorage.getItem("etherdoc-auth");

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/documents`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.ok) {
        const result = await response.json();
        console.info("Upload successful!", result);

        // Simple success notification
        toast.success(
          `File uploaded successfully! Document ID: ${result.data?.id || "Generated"}`,
        );

        setSelectedFile(null);
        setUploadProgress(0);
        onClose();

        // Trigger refresh callback if provided
        if (onUploadSuccess) {
          onUploadSuccess();
        }
      } else {
        console.error("Upload failed");
        const errorData = await response.json().catch(() => ({
          message: "Upload failed. Please try again.",
        }));

        toast.error(errorData.message || "Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Upload error: ", error);
      toast.error("Upload error. Please try again.");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-indigo-900/20 backdrop-blur-xl transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative group">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl max-w-lg w-full border border-white/30 transform transition-all duration-300 scale-100">
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-white/30">
              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                  Upload Document
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Secure your document on the blockchain
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8">
              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-blue-500 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm scale-105 shadow-xl"
                    : "border-white/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 hover:backdrop-blur-sm hover:shadow-lg"
                }`}
              >
                <div
                  className={`w-16 h-16 mx-auto mb-6 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragOver
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25"
                      : "bg-gradient-to-r from-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/30"
                  }`}
                >
                  <UploadIcon
                    className={`w-8 h-8 transition-colors ${
                      isDragOver ? "text-white" : "text-gray-500"
                    }`}
                  ></UploadIcon>
                </div>

                {selectedFile ? (
                  <div className="space-y-3">
                    <div className="w-12 h-12 mx-auto bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center mb-4">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-900 mb-2">
                      File Ready to Upload
                    </p>
                    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-4 border border-white/30 shadow-lg">
                      <p className="font-medium text-gray-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-gray-900">
                      Upload Your Document
                    </h4>
                    <p className="text-gray-600">
                      Drop your file here, or{" "}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold underline underline-offset-2">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileInput}
                          accept=".pdf,.png"
                        />
                      </label>
                    </p>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        PDF
                      </span>
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        PNG
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar */}
              {isUploading && (
                <div className="mt-6 bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-xl rounded-2xl p-6 border border-white/30 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white animate-spin"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      </div>
                      <span className="text-base font-semibold text-gray-800">
                        Uploading to IPFS...
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-3 overflow-hidden border border-white/30">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    {uploadProgress < 90
                      ? "Encrypting and uploading file..."
                      : uploadProgress === 100
                        ? "Upload complete! Processing..."
                        : "Storing on blockchain..."}
                  </p>
                </div>
              )}

              {/* Upload Button */}
              <div className="mt-8 flex justify-end gap-4">
                <button
                  onClick={onClose}
                  disabled={isUploading}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white/70 backdrop-blur-sm border border-white/30 rounded-xl hover:bg-white/90 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="px-8 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  {isUploading ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      Upload Document
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
