"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

type DocumentDetail = {
  id: string;
  name: string;
  cid: string;
  size: number;
  issuer: string;
  createdAt: string;
  isValid: boolean;
  isExistEthereum: boolean;
  isExistBase: boolean;
  network?: string;
};

// SVG Icon Components
const ArrowLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
    />
  </svg>
);

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const XCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const DocumentIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={2}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

// Document Preview Component
const DocumentPreview = ({ document }: { document: DocumentDetail }) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="relative group flex-1 flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
      <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-4 border border-white/50 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <DocumentIcon className="w-6 h-6 text-blue-600" />
            <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg animate-pulse"></div>
          </div>
          <h2 className="text-lg font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Document Preview
          </h2>
        </div>

        {/* Vertical Document Preview Placeholder */}
        <div className="flex-1 bg-white rounded-2xl border border-gray-300 shadow-lg p-4 mb-4 flex flex-col">
          {/* Document Header */}
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <DocumentIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">
                Document Preview
              </span>
            </div>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
              {document.name.split(".").pop()?.toUpperCase() || "PDF"}
            </span>
          </div>

          {/* Document Content Area - Vertical Layout */}
          <div className="flex-1 bg-gray-50 rounded-xl p-4 border border-gray-200 relative overflow-hidden">
            {/* Document Lines Simulation */}
            <div className="space-y-3">
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-4/5"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
              <div className="h-3 bg-gray-300 rounded w-5/6"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-full"></div>
            </div>

            {/* Document Info Overlay */}
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl">
              <DocumentIcon className="w-12 h-12 text-gray-400 mb-3" />
              <p className="text-sm font-medium text-gray-600 mb-1">
                Preview Coming Soon
              </p>
              <p className="text-xs text-gray-500 text-center">
                {document.name}
              </p>
            </div>
          </div>

          {/* Document Info Footer */}
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200 text-xs text-gray-500">
            <span>{formatFileSize(document.size)}</span>
            <span>{new Date(document.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Download Button */}
        <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300">
          Download Document
        </button>
      </div>
    </div>
  );
};

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentCID = params.cid as string;

  // Fetch document details
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      if (!documentCID) return;

      setIsLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const url = `${API_BASE_URL}/documents/${documentCID}?network=private`;

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const doc = await response.json();

          const documentData: DocumentDetail = {
            id: doc.id,
            name: doc.name,
            cid: doc.cid,
            size: doc.size,
            issuer: doc.keyvalues?.instansi || "N/A",
            createdAt: doc.created_at,
            isValid: true,
            isExistEthereum: doc.isExistEthereum,
            isExistBase: doc.isExistBase,
            network: "Ethereum Private Network",
          };

          console.info("documentData: ", documentData);

          setDocument(documentData);
        } else {
          if (response.status === 404) {
            setError("Document not found on the blockchain.");
          } else {
            const errorData = await response.json().catch(() => ({
              message: "An unexpected error occurred.",
            }));
            setError(errorData.message || `Error: ${response.statusText}`);
          }
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError(
          "Failed to connect to the server. Please check your connection.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [documentCID]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg relative z-10">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                Docscout
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Explorers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Services
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Resources
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-blue-600 transition-all duration-300 relative group"
              >
                Docs
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 relative z-10 flex-1 flex flex-col">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Search
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl max-w-md mx-4 border border-white/30 animate-fade-in">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
                </div>
                <h3 className="mt-8 text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  Loading Document...
                </h3>
                <p className="mt-3 text-gray-600 text-lg">
                  Please wait while we fetch document details from the
                  blockchain...
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-pink-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
            <div className="relative p-8 bg-white/80 backdrop-blur-lg border-l-4 border-red-500 rounded-3xl shadow-xl border border-white/50">
              <div className="flex items-center gap-3">
                <XCircleIcon className="w-8 h-8 text-red-500" />
                <div>
                  <p className="font-semibold text-red-800 mb-1 text-lg">
                    Document Not Found
                  </p>
                  <p className="text-red-700">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Document Content - Two Column Layout */}
        {document && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fade-in flex-1">
            {/* Left Column - Document Preview */}
            <div className="lg:col-span-2 flex flex-col">
              <DocumentPreview document={document} />
            </div>

            {/* Right Column - All Document Details Combined */}
            <div className="lg:col-span-3">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-4 border border-white/50">
                  {/* Compact Status Header */}
                  <div className="flex items-center justify-between mb-4 bg-white/50 p-3 rounded-2xl border border-white/40">
                    <div className="flex items-center gap-3">
                      {document.isValid ? (
                        <CheckCircleIcon className="w-8 h-8 text-green-500" />
                      ) : (
                        <XCircleIcon className="w-8 h-8 text-red-500" />
                      )}
                      <div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                          Document Verification
                        </h1>
                        <p
                          className={`text-sm font-semibold ${document.isValid ? "text-green-700" : "text-red-700"}`}
                        >
                          {document.isValid ? "✓ Verified" : "✗ Invalid"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 text-xs font-semibold rounded-full shadow-lg ${
                        document.isValid
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                      }`}
                    >
                      {document.isValid ? "VERIFIED" : "INVALID"}
                    </span>
                  </div>

                  {/* Compact Document Information */}
                  <div className="bg-white/40 rounded-2xl p-3 mb-4">
                    <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                      <DocumentIcon className="w-5 h-5 text-blue-600" />
                      Document Information
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Name
                        </p>
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={document.name}
                        >
                          {document.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Size
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatFileSize(document.size)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Issuer
                        </p>
                        <p
                          className="text-sm font-medium text-gray-900 truncate"
                          title={document.issuer}
                        >
                          {document.issuer}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">
                          Created
                        </p>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(document.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Document ID and CID in tabs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Document ID
                        </p>
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {document.id}
                        </p>
                      </div>
                      <div className="bg-white/60 p-3 rounded-xl border border-white/50">
                        <p className="text-xs text-gray-500 font-medium mb-1">
                          Content ID (CID)
                        </p>
                        <p className="text-xs font-mono text-gray-700 break-all">
                          {document.cid}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Compact Blockchain Information */}
                  {document.isValid && (
                    <div className="bg-white/40 rounded-2xl p-3">
                      <h2 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-blue-600">⛓</span>
                        Blockchain Verification
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Ethereum */}
                        <div className="bg-white/60 p-3 rounded-xl border border-white/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-gray-800 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                ETH
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Ethereum
                              </p>
                              <p
                                className={`text-xs ${document.isExistEthereum ? "text-green-600" : "text-gray-500"}`}
                              >
                                {document.isExistEthereum
                                  ? "Verified"
                                  : "Not Found"}
                              </p>
                            </div>
                          </div>
                          {document.isExistEthereum ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          ) : (
                            <XCircleIcon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>

                        {/* Base */}
                        <div className="bg-white/60 p-3 rounded-xl border border-white/50 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                BASE
                              </span>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">
                                Base
                              </p>
                              <p
                                className={`text-xs ${document.isExistBase ? "text-green-600" : "text-yellow-600"}`}
                              >
                                {document.isExistBase ? "Verified" : "Waiting"}
                              </p>
                            </div>
                          </div>
                          {document.isExistBase ? (
                            <CheckCircleIcon className="w-5 h-5 text-green-500" />
                          ) : (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }

        .delay-300 {
          animation-delay: 300ms;
        }

        .delay-500 {
          animation-delay: 500ms;
        }

        .delay-1000 {
          animation-delay: 1000ms;
        }
      `}</style>
    </div>
  );
}
