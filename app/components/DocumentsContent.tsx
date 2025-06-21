"use client";

import { useState, useEffect } from "react";

interface ApiFile {
  id: string;
  name: string;
  cid: string;
  size: number;
  number_of_files: number;
  mime_type: string;
  group_id: string | null;
  keyvalues: Record<string, unknown>;
  created_at: string;
}

interface ApiResponse {
  data: {
    files: ApiFile[];
    next_page_token: string | null;
  };
}

interface DocumentsContentProps {
  onUploadClick: () => void;
  refreshTrigger?: number;
}

// Icons
const SearchIcon = ({ className }: { className?: string }) => (
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
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
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
      d="M12 4v16m8-8H4"
    />
  </svg>
);

const ViewIcon = ({ className }: { className?: string }) => (
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
      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

export default function DocumentsContent({
  onUploadClick,
  refreshTrigger,
}: DocumentsContentProps) {
  console.info("DocumentsContent Rendered");
  console.info("onUploadClick: ", onUploadClick);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const [apiDocuments, setApiDocuments] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Stats calculations
  const totalDocuments = apiDocuments.length;
  const totalSize = apiDocuments.reduce((acc, doc) => acc + doc.size, 0);
  const recentDocuments = apiDocuments.filter((doc) => {
    const docDate = new Date(doc.created_at);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return docDate >= weekAgo;
  }).length;

  useEffect(() => {
    fetchDocuments("private");
  }, []);

  useEffect(() => {
    if (refreshTrigger) {
      fetchDocuments(activeTab === "public" ? "public" : "private");
    }
  }, [refreshTrigger, activeTab]);

  const fetchDocuments = async (networkType: string = "public") => {
    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

      // Get token from localStorage
      const token = localStorage.getItem("etherdoc-auth");

      console.log("API_BASE_URL:", API_BASE_URL); // Debug log
      console.log("Network Type:", networkType); // Debug log
      console.log(`Full URL: ${API_BASE_URL}/documents?network=${networkType}`); // Debug log

      // Fetch data
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const response = await fetch(
        `${API_BASE_URL}/documents?network=${networkType}`,
        {
          method: "GET",
          headers,
          credentials: "include",
          mode: "cors",
        },
      );

      console.log("Response status:", response.status); // Debug log
      console.log("Response ok:", response.ok); // Debug log

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setError("Unauthorized. Please login again.");
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: "Failed to parse error response" }));
          setError(
            errorData.message || `HTTP error! status: ${response.status}`,
          );
        }
        setApiDocuments([]);
        return;
      }

      const result: ApiResponse = await response.json();
      console.log("API Response:", result); // Debug log
      setApiDocuments(result.data.files);
    } catch (error: unknown) {
      console.error("Failed to fetch documents; ", error);
      setError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
      setApiDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDocuments = apiDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-8 py-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Document Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Manage and verify your blockchain documents
            </p>
          </div>
          <button
            onClick={() => {
              console.info("upload button clicked");
              onUploadClick();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 cursor-pointer shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <UploadIcon className="w-5 h-5" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Documents */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fadeInUp card-hover">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Documents
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {totalDocuments}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Storage Used */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fadeInUp card-hover"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Storage Used
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {(totalSize / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Recent Uploads */}
          <div
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 animate-fadeInUp card-hover"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {recentDocuments}
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-8 mb-6">
        <div className="bg-white rounded-2xl p-2 shadow-lg border border-gray-100 animate-fadeIn">
          <nav className="flex space-x-2">
            {[
              { id: "all", label: "All Documents", icon: "📁" },
              { id: "public", label: "Public", icon: "🌐" },
              { id: "private", label: "Private", icon: "🔒" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  // Call fetchDocuments
                  if (tab.id === "public") {
                    fetchDocuments("public");
                  } else if (tab.id === "private") {
                    fetchDocuments("private");
                  } else {
                    fetchDocuments("public");
                  }
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Search */}
      <div className="px-8 mb-6">
        <div className="relative max-w-md animate-slideInRight">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name, type, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-lg transition-all duration-200 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="px-8">
          <div className="bg-white rounded-2xl p-12 text-center shadow-lg border border-gray-100 animate-scaleIn">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4 animate-pulse-glow"></div>
            <div className="text-gray-600 font-medium">
              Loading documents...
            </div>
            <div className="text-gray-400 text-sm mt-1">
              Fetching your secure documents from the blockchain
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="px-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <div className="text-red-800 font-semibold">
                    Something went wrong
                  </div>
                  <div className="text-red-600 text-sm mt-1">{error}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table - hanya tampil jika tidak loading dan tidak ada error */}
      {!isLoading && !error && (
        <div className="px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fadeInUp">
            {filteredDocuments.length === 0 ? (
              <div className="p-16 text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No documents yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Start by uploading your first document to the blockchain
                </p>
                <button
                  onClick={onUploadClick}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg btn-gradient transform hover:scale-105"
                >
                  <UploadIcon className="w-5 h-5" />
                  Upload First Document
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                    <tr>
                      <th className="px-8 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Document Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDocuments.map((doc, index) => (
                      <tr
                        key={doc.id}
                        className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 group animate-fadeIn"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="px-8 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                              <svg
                                className="w-5 h-5 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                              </svg>
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-900 transition-colors">
                                {doc.name}
                              </div>
                              <div className="text-xs text-gray-500 font-mono">
                                ID: {doc.id.slice(0, 8)}...{doc.id.slice(-4)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {(doc.size / 1024).toFixed(1)} KB
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                            {doc.mime_type.split("/")[1]?.toUpperCase() ||
                              "FILE"}
                          </span>
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap text-sm text-gray-600">
                          {new Date(doc.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </td>
                        <td className="px-6 py-6 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex items-center gap-1 px-3 py-2 text-blue-600 hover:text-white hover:bg-blue-600 text-sm font-medium rounded-lg transition-all duration-200 border border-blue-200 hover:border-blue-600">
                              <ViewIcon className="w-4 h-4" />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
