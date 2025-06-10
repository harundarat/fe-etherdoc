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

  // State untuk UI
  const [activeTab, setActiveTab] = useState<"search" | "upload">("search");

  // State untuk form input
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // State untuk hasil dan proses pencarian
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

  // Redirect jika wallet tidak terkoneksi
  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  const resetState = () => {
    setIsLoading(true);
    setError(null);
    setSearchResult(null);
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (activeTab !== "search" || !searchQuery) return;

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

        const documentData: SearchResult = {
          id: document.id,
          name: document.name,
          cid: document.cid,
          size: document.size,
          issuer: document.keyvalues?.instansi || "N/A",
          createdAt: document.created_at,
          isValid: true,
        };

        // Update UI
        setSearchResult(documentData);
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
        "Failed to connect to the server. Please check your connection."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setError(null);
      setSearchResult(null);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">D</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Docscout
              </span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-8">
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Explorers
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Services
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Resources
              </Link>
              <Link
                href="#"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Docs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Blockchain document explorer
          </h1>
          <p className="text-4xl sm:text-5xl font-bold text-blue-600">
            Verify your documents
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center gap-4 mb-10">
          <button
            onClick={() => setActiveTab("search")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "search"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Search by ID
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-6 py-3 rounded-full font-medium transition-all ${
              activeTab === "upload"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
            }`}
          >
            Upload document
          </button>
        </div>

        {/* Search/Upload Form */}
        <form onSubmit={handleSearch} className="mb-8">
          {activeTab === "search" ? (
            <div className="relative max-w-4xl mx-auto">
              <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by document ID / transaction / hash ..."
                className="w-full pl-16 pr-6 py-5 text-lg bg-white border-2 border-blue-200 rounded-full focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={isLoading || !searchQuery}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-full font-medium transition-colors"
              >
                Search
              </button>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto">
              <label
                htmlFor="file-upload"
                className="relative flex flex-col items-center justify-center w-full h-48 bg-white border-2 border-dashed border-blue-300 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors"
              >
                <div className="text-center">
                  <UploadIcon className="w-12 h-12 mx-auto text-blue-600 mb-3" />
                  <p className="text-lg font-medium text-gray-700">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to upload or drag and drop"}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    PDF, DOCX, PNG, or JPG (Max 10MB)
                  </p>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.docx,.png,.jpg,.jpeg"
                />
              </label>
              {selectedFile && (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-4 rounded-full transition-colors"
                >
                  Verify Document
                </button>
              )}
            </div>
          )}
        </form>

        {/* Search Tags */}
        {activeTab === "search" && !searchResult && !isLoading && (
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-gray-500 mb-4">Try searching by:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {searchTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Section */}
        {(isLoading || error || searchResult) && (
          <div className="mt-12 max-w-4xl mx-auto">
            {isLoading && (
              <div className="text-center p-12 bg-white rounded-2xl shadow-sm">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-6 text-gray-600 text-lg">
                  Searching on blockchain...
                </p>
              </div>
            )}

            {error && (
              <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
                <p className="font-semibold text-red-800 mb-1">
                  Verification Failed
                </p>
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
                      {new Date(searchResult.timestamp).toLocaleString()}
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
        )}
      </main>
    </div>
  );
}
