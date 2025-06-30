"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
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

export default function DocumentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { isConnected } = useAccount();

  const [document, setDocument] = useState<DocumentDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentCID = params.cid as string;

  // Redirect if wallet not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

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

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <div className="mb-6">
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

        {/* Document Details */}
        {document && (
          <div className="space-y-8 animate-fade-in">
            {/* Status Header */}
            <div className="relative group">
              <div
                className={`absolute inset-0 ${
                  document.isValid
                    ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20"
                    : "bg-gradient-to-r from-red-500/20 to-pink-500/20"
                } rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300`}
              ></div>
              <div
                className={`relative p-8 rounded-3xl border-l-4 backdrop-blur-lg shadow-xl border border-white/50 ${
                  document.isValid
                    ? "bg-white/80 border-green-500"
                    : "bg-white/80 border-red-500"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {document.isValid ? (
                      <div className="relative">
                        <CheckCircleIcon className="w-12 h-12 text-green-500" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    ) : (
                      <div className="relative">
                        <XCircleIcon className="w-12 h-12 text-red-500" />
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl animate-pulse"></div>
                      </div>
                    )}
                    <div>
                      <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent mb-2">
                        Document Verification
                      </h1>
                      <p
                        className={`text-lg font-semibold ${
                          document.isValid ? "text-green-800" : "text-red-800"
                        }`}
                      >
                        {document.isValid
                          ? "✓ Document is Valid and Verified"
                          : "✗ Document is Not Valid"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-6 py-3 text-sm font-semibold rounded-full shadow-lg ${
                      document.isValid
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                        : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                    }`}
                  >
                    {document.isValid ? "VERIFIED" : "INVALID"}
                  </span>
                </div>
              </div>
            </div>

            {/* Document Information */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
                <div className="flex items-center gap-3 mb-6">
                  <div className="relative">
                    <DocumentIcon className="w-6 h-6 text-blue-600" />
                    <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-lg animate-pulse"></div>
                  </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                    Document Information
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Document Name
                      </label>
                      <p className="mt-2 text-lg font-medium bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                        {document.name}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Document ID
                      </label>
                      <p className="mt-2 text-sm font-mono text-gray-900 bg-white/70 backdrop-blur-sm p-4 rounded-xl break-all border border-white/50 shadow-lg">
                        {document.id}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        File Size
                      </label>
                      <p className="mt-2 text-base text-gray-900 font-medium">
                        {formatFileSize(document.size)}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Issuer/Institution
                      </label>
                      <p className="mt-2 text-base text-gray-900 bg-white/70 backdrop-blur-sm p-4 rounded-xl border border-white/50 shadow-lg">
                        {document.issuer}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Created At
                      </label>
                      <p className="mt-2 text-base text-gray-900 font-medium">
                        {new Date(document.createdAt).toLocaleString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Content ID (CID)
                      </label>
                      <p className="mt-2 text-sm font-mono text-gray-900 bg-white/70 backdrop-blur-sm p-4 rounded-xl break-all border border-white/50 shadow-lg">
                        {document.cid}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            {document.isValid && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <div className="relative bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="relative w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                      <span className="text-white font-bold">⛓</span>
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-lg blur-lg animate-pulse"></div>
                    </div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
                      Blockchain Information
                    </h2>
                  </div>

                  <div className="space-y-6">
                    {/* Ethereum Chain */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-700/10 to-blue-600/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative border border-white/50 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                ETH
                              </span>
                              <div className="absolute inset-0 bg-gray-700/20 rounded-full blur-lg animate-pulse"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                              Ethereum Network
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {document.isExistEthereum ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : (
                              <XCircleIcon className="w-5 h-5 text-gray-400" />
                            )}
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                                document.isExistEthereum
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                  : "bg-gradient-to-r from-gray-400 to-gray-500 text-white"
                              }`}
                            >
                              {document.isExistEthereum
                                ? "VERIFIED"
                                : "NOT FOUND"}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Status
                            </label>
                            <p
                              className={`mt-1 text-sm font-medium ${
                                document.isExistEthereum
                                  ? "text-green-700"
                                  : "text-gray-600"
                              }`}
                            >
                              {document.isExistEthereum
                                ? "Document verified on Ethereum blockchain"
                                : "Document not found on Ethereum blockchain"}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Network Type
                            </label>
                            <p className="mt-1 text-sm text-gray-900 font-medium">
                              Ethereum Private Network
                            </p>
                          </div>
                        </div>
                        {document.isExistEthereum && (
                          <div className="mt-4 pt-4 border-t border-white/30">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-purple-600 font-medium inline-flex items-center gap-2 text-sm transition-all duration-300 transform hover:scale-105"
                            >
                              View on Ethereum Explorer
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
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Base Chain */}
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                      <div className="relative border border-white/50 bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white font-bold text-sm">
                                BASE
                              </span>
                              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-lg animate-pulse"></div>
                            </div>
                            <h3 className="text-lg font-semibold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                              Base Network
                            </h3>
                          </div>
                          <div className="flex items-center gap-2">
                            {document.isExistBase ? (
                              <CheckCircleIcon className="w-5 h-5 text-green-500" />
                            ) : (
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
                            )}
                            <span
                              className={`px-3 py-1 text-xs font-semibold rounded-full shadow-lg ${
                                document.isExistBase
                                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                  : "bg-gradient-to-r from-yellow-500 to-orange-500 text-white"
                              }`}
                            >
                              {document.isExistBase ? "VERIFIED" : "WAITING"}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Status
                            </label>
                            <p
                              className={`mt-1 text-sm font-medium ${
                                document.isExistBase
                                  ? "text-green-700"
                                  : "text-yellow-700"
                              }`}
                            >
                              {document.isExistBase
                                ? "Document verified on Base blockchain"
                                : "Waiting message from router..."}
                            </p>
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                              Network Type
                            </label>
                            <p className="mt-1 text-sm text-gray-900 font-medium">
                              Base Mainnet
                            </p>
                          </div>
                        </div>
                        {document.isExistBase && (
                          <div className="mt-4 pt-4 border-t border-white/30">
                            <a
                              href="#"
                              className="text-blue-600 hover:text-purple-600 font-medium inline-flex items-center gap-2 text-sm transition-all duration-300 transform hover:scale-105"
                            >
                              View on Base Explorer
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
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
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
