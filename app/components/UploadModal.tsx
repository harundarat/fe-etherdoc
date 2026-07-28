"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useAccount, useSignTypedData } from "wagmi";
import { intentsApi } from "@/lib/api";
import { StorageNetwork } from "@/lib/types/api";

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
  const { address } = useAccount();
  const { signTypedDataAsync } = useSignTypedData();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [network, setNetwork] = useState<StorageNetwork>("private");
  const [documentType, setDocumentType] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStep, setUploadStep] = useState<string>("");

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
    if (!address) {
      toast.error("Wallet not connected. Please connect your wallet first.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);
    setUploadStep("Preparing document registration intent...");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("issuer", address);
      formData.append("idempotencyKey", crypto.randomUUID());
      formData.append("storageNetwork", network);
      if (documentType.trim()) {
        formData.append("documentType", documentType.trim());
      }

      // Step 1: Prepare EIP-712 registration intent
      const intent = await intentsApi.prepareRegister(formData);
      setUploadProgress(50);
      setUploadStep("Please sign the EIP-712 typed intent in your wallet...");

      // Step 2: Sign typed data with connected wallet
      const signature = await signTypedDataAsync(intent.typedData as Parameters<typeof signTypedDataAsync>[0]);

      setUploadProgress(80);
      setUploadStep("Submitting intent signature to backend...");

      // Step 3: Submit signature
      const submittedIntent = await intentsApi.submitSignature(intent.id, signature);

      setUploadProgress(100);
      setUploadStep("Intent enqueued successfully!");

      toast.success(
        `Document intent submitted! Status: ${submittedIntent.status}`
      );

      setSelectedFile(null);
      setDocumentType("");
      onClose();

      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error: unknown) {
      console.error("Upload intent error: ", error);
      toast.error(
        error instanceof Error ? error.message : "Upload error. Please try again."
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setUploadStep("");
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
                  Register document intent with EIP-712 wallet signature
                </p>
              </div>
              <button
                onClick={onClose}
                disabled={isUploading}
                className="text-gray-400 hover:text-gray-600 p-2 hover:bg-white/60 rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20 hover:border-white/40"
              >
                <CloseIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6">
              {/* Storage Network & Metadata */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Storage Network
                  </label>
                  <select
                    value={network}
                    onChange={(e) => setNetwork(e.target.value as StorageNetwork)}
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="private">Private Network</option>
                    <option value="public">Public Network</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">
                    Document Type (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. certificate"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                    disabled={isUploading}
                    className="w-full px-4 py-3 bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Drag & Drop Area */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 ${
                  isDragOver
                    ? "border-blue-500 bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm scale-105 shadow-xl"
                    : "border-white/50 hover:border-blue-400 hover:bg-gradient-to-br hover:from-blue-50/50 hover:to-purple-50/50 hover:backdrop-blur-sm hover:shadow-lg"
                }`}
              >
                <div
                  className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isDragOver
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl shadow-blue-500/25"
                      : "bg-gradient-to-r from-blue-100/50 to-purple-100/50 backdrop-blur-sm border border-white/30"
                  }`}
                >
                  <UploadIcon
                    className={`w-7 h-7 transition-colors ${
                      isDragOver ? "text-white" : "text-gray-500"
                    }`}
                  />
                </div>

                {selectedFile ? (
                  <div className="space-y-2">
                    <div className="w-10 h-10 mx-auto bg-gradient-to-r from-green-100 to-green-200 rounded-xl flex items-center justify-center">
                      <svg
                        className="w-5 h-5 text-green-600"
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
                    <p className="text-base font-semibold text-gray-900">
                      File Selected
                    </p>
                    <div className="bg-white/70 backdrop-blur-xl rounded-xl p-3 border border-white/30 shadow-sm">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      Upload PDF Document
                    </h4>
                    <p className="text-sm text-gray-600">
                      Drop your PDF file here, or{" "}
                      <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-semibold underline underline-offset-2">
                        browse
                        <input
                          type="file"
                          className="hidden"
                          onChange={handleFileInput}
                          accept=".pdf"
                        />
                      </label>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        PDF only (max 5MB)
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Progress Bar & Status */}
              {isUploading && (
                <div className="bg-gradient-to-r from-blue-50/80 to-purple-50/80 backdrop-blur-xl rounded-2xl p-5 border border-white/30 shadow-xl">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
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
                      <span className="text-sm font-semibold text-gray-800">
                        {uploadStep}
                      </span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {uploadProgress}%
                    </span>
                  </div>
                  <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2.5 overflow-hidden border border-white/30">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500 ease-out shadow-lg"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Modal Buttons */}
              <div className="flex justify-end gap-4">
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
                      Processing Intent...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="w-4 h-4" />
                      Sign & Submit Intent
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
