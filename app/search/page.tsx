"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";

type SearchResult = {
  id: string;
  name: string;
  cid: string;
  size: number;
  issuer: string;
  createdAt: string;
  isValid: boolean;
  isExistEthereum: boolean;
  isExistBase: boolean;
};

// SVG Icon Components
const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
    />
  </svg>
);

const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21h13.5c1.2426 0 2.25-1.0074 2.25-2.25V16.5m-13.5-9l3-3m0 0l3 3m-3-3v12"
    />
  </svg>
);

export default function SearchPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  // State for UI
  const [activeTab, setActiveTab] = useState<"search" | "upload">("search");

  // State for form input
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State for search process and result
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  // Search suggestions/tags
  const searchTags = [
    "Document ID",
    "Transaction",
    "Issuer Address",
    "Hash",
    "Certificate",
    "Verification",
    "Timestamp",
  ];

  const resetState = () => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
  };

  const handleFileVerification = async () => {
    if (!selectedFile) {
      setError("Please select a file to verify");
      return;
    }

    resetState();

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
      const url = `${API_BASE_URL}/documents/search`;

      // send request to API
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const document = await response.json();

        // Redirect to document detail page
        router.push(`/document/${document.cid}`);
      } else {
        // Error handling
        if (response.status === 404) {
          setError(
            "This document was not found in our system. It might not be registered",
          );
        } else if (response.status === 422) {
          setError("File is too large. The maximum allowed size is 5MB");
        } else {
          const errorData = await response.json().catch(() => ({
            message: "An unexpected error occured while verifying the file.",
          }));
          setError(errorData.message);
        }
        setSearchResult(null);
      }
    } catch (error) {
      console.error("File upload error: ", error);
      setError(
        "Failed to connect to the server. Please check your connection and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();

    if (activeTab === "search") {
      if (!searchQuery) return;

      resetState();

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const url = `${API_BASE_URL}/documents/${searchQuery}?network=private`;

        console.info("Requesting URL: ", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle response
        if (response.ok) {
          const result = await response.json();
          const document = result.data;

          // Redirect to document detail page
          router.push(`/document/${document.id}`);
        } else {
          // Handle errors based on status code
          if (response.status === 404) {
            setError("Document with that ID was not found on the blockchain.");
          } else {
            const errorData = await response.json().catch(() => {
              return { message: "An unexpected error occured." };
            });

            setError(errorData.message || `Error: ${response.statusText}`);
          }

          // Reset search result if error occurs
          setSearchResult(null);
        }

        console.info("API Response Status: ", response.status);
      } catch (error) {
        console.error("Fetch error: ", error);
        setError(
          "Failed to connect to the server. Please check your connection.",
        );
      } finally {
        setIsLoading(false);
      }
    } else if (activeTab === "upload") {
      handleFileVerification();
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setSearchResult(null);
    }
  };

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

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6 animate-fade-in">
            Blockscout
          </h1>
          <p className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent animate-fade-in delay-300">
            Trusted Verification Across Blockchains
          </p>
          <div className="mt-8 text-lg text-gray-600 max-w-2xl mx-auto animate-fade-in delay-500">
            Seamlessly verify your documents with Blockscout&apos;s reliable
            cross-chain technology.
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === "search"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25"
                : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/50 shadow-lg"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              Search by CID
            </span>
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-8 py-4 rounded-full font-medium transition-all duration-300 transform hover:scale-105 ${
              activeTab === "upload"
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25"
                : "bg-white/70 backdrop-blur-sm text-gray-700 hover:bg-white/90 border border-white/50 shadow-lg"
            }`}
          >
            <span className="flex items-center gap-2">
              <svg
                className="w-5 h-5"
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
              Upload document
            </span>
          </button>
        </div>

        {/* Search/Upload Form */}
        <form onSubmit={handleSearch} className="mb-8">
          {activeTab === "search" ? (
            <div className="relative max-w-4xl mx-auto group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-focus-within:blur-2xl transition-all duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-lg rounded-full border border-white/50 shadow-2xl">
                <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by document CID ..."
                  className="w-full pl-16 pr-32 py-6 text-lg bg-transparent rounded-full focus:outline-none transition-all text-gray-700"
                  autoFocus
                />
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-8 py-3 rounded-full font-medium transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Search
                </button>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>
                <label
                  htmlFor="file-upload"
                  className="relative flex flex-col items-center justify-center w-full h-56 bg-white/80 backdrop-blur-lg border-2 border-dashed border-blue-300/50 rounded-3xl cursor-pointer hover:bg-white/90 transition-all duration-300 transform hover:scale-[1.02] shadow-xl"
                >
                  <div className="text-center">
                    <div className="relative">
                      <UploadIcon className="w-16 h-16 mx-auto text-blue-600 mb-4 transform group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-xl opacity-20 animate-pulse"></div>
                    </div>
                    <p className="text-lg font-medium text-gray-700 mb-2">
                      {selectedFile
                        ? selectedFile.name
                        : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-sm text-gray-500">PDF (Max 10MB)</p>
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".pdf"
                  />
                </label>
              </div>
              {selectedFile && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-xl shadow-blue-500/25"
                >
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Verify Document
                  </span>
                </button>
              )}
            </div>
          )}
        </form>

        {/* Loading Popup Modal */}
        {isLoading && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl max-w-md mx-4 border border-white/30 animate-fade-in">
              <div className="text-center">
                <div className="relative">
                  <div className="animate-spin rounded-full h-20 w-20 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl animate-pulse"></div>
                </div>
                <h3 className="mt-8 text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                  {activeTab === "search"
                    ? "Searching..."
                    : "Verifying Document..."}
                </h3>
                <p className="mt-3 text-gray-600 text-lg">
                  {activeTab === "search"
                    ? "Searching on blockchain..."
                    : "Please wait while we verify your document on the blockchain..."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Popup Modal */}
        {error && activeTab === "upload" && (
          <div className="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-2xl max-w-md mx-4 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-600"
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
                </div>
                <h3 className="text-xl font-semibold text-red-800 mb-2">
                  Verification Failed
                </h3>
                <p className="text-red-700 mb-6">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {(error && activeTab === "search") || searchResult ? (
          <div className="mt-12 max-w-4xl mx-auto">
            {error && activeTab === "search" && (
              <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="font-semibold text-red-800 mb-1">Search Failed</p>
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {searchResult && (
              <div
                className={`p-8 bg-white rounded-2xl shadow-lg border-l-4 ${
                  searchResult.isValid ? "border-green-500" : "border-red-500"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Verification Result
                  </h2>
                  <span
                    className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      searchResult.isValid
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {searchResult.isValid ? "✓ Verified" : "✗ Not Valid"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Document Name
                    </label>
                    <p className="mt-1 text-gray-900 font-medium">
                      {searchResult.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Document ID
                    </label>
                    <p className="mt-1 text-gray-900 font-mono">
                      {searchResult.id}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Issuer
                    </label>
                    <p className="mt-1 text-gray-900 font-mono bg-gray-50 p-2 rounded">
                      {searchResult.issuer}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Timestamp
                    </label>
                    <p className="mt-1 text-gray-900">
                      {new Date(searchResult.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {/* <div className="md:col-span-2">

                    <label className="text-sm font-medium text-gray-500">
                      Transaction Hash
                    </label>
                    <p className="mt-1 text-gray-900 font-mono bg-gray-50 p-3 rounded break-all">
                      {searchResult.transactionHash}
                    </p>
                  </div> */}
                </div>

                {searchResult.isValid && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <a
                      href="#"
                      className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2"
                    >
                      View on blockchain explorer
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
            )}
          </div>
        ) : null}
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
      `}</style>
    </div>
  );
}
