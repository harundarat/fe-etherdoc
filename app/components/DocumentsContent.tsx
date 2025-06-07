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
  keyvalues: Record<string, any>;
  created_at: string;
}

interface ApiResponse {
  data: {
    files: ApiFile[];
    next_page_token: string | null;
  };
}

// Sample data
// const sampleDocuments = [
//   {
//     id: "1",
//     name: "Contract Agreement.pdf",
//     status: "completed",
//     lastModified: "August 15, 2023",
//     type: "pdf",
//   },
//   {
//     id: "2",
//     name: "Invoice #2023-001.docx",
//     status: "pending",
//     lastModified: "August 10, 2023",
//     type: "docx",
//   },
//   {
//     id: "3",
//     name: "Meeting Minutes_Internal.txt",
//     status: "draft",
//     lastModified: "August 05, 2023",
//     type: "txt",
//   },
//   {
//     id: "4",
//     name: "Project Proposal_Final.pdf",
//     status: "completed",
//     lastModified: "July 20, 2023",
//     type: "pdf",
//   },
//   {
//     id: "5",
//     name: "Expense Report_Q2.xlsx",
//     status: "submitted",
//     lastModified: "July 10, 2023",
//     type: "xlsx",
//   },
// ];

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

const EditIcon = ({ className }: { className?: string }) => (
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
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

export default function DocumentsContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [apiDocuments, setApiDocuments] = useState<ApiFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDocuments("private");
  }, []);

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
        }
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
            errorData.message || `HTTP error! status: ${response.status}`
          );
        }
        setApiDocuments([]);
        return;
      }

      const result: ApiResponse = await response.json();
      console.log("API Response:", result); // Debug log
      setApiDocuments(result.data.files);
    } catch (error: any) {
      console.error("Failed to fetch documents; ", error);
      setError(error.message);
      setApiDocuments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";

    switch (status) {
      case "completed":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "pending":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "draft":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      case "submitted":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return "✓";
      case "pending":
        return "⏱";
      case "draft":
        return "📝";
      case "submitted":
        return "↗";
      default:
        return "";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      case "draft":
        return "Draft";
      case "submitted":
        return "Submitted";
      default:
        return status;
    }
  };

  const filteredDocuments = apiDocuments.filter((doc) =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Documents</h1>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <UploadIcon className="w-4 h-4" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-8">
        <nav className="flex space-x-8">
          {[
            { id: "all", label: "All Documents" },
            { id: "public", label: "Public" },
            { id: "private", label: "Private" },
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
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Search */}
      <div className="bg-white px-8 py-6 border-b border-gray-200">
        <div className="relative max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents by name, type, or date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white p-8 text-center">
          <div className="text-gray-500">Loading documents...</div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-white p-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-red-800 font-medium">Error</div>
            <div className="text-red-600 text-sm mt-1">{error}</div>
          </div>
        </div>
      )}

      {/* Table - hanya tampil jika tidak loading dan tidak ada error */}
      {!isLoading && !error && (
        <div className="bg-white">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredDocuments.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-8 py-12 text-center text-gray-500"
                    >
                      No documents found
                    </td>
                  </tr>
                ) : (
                  filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50">
                      <td className="px-8 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(doc.size / 1024).toFixed(1)} KB
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {doc.mime_type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <button className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium">
                            <ViewIcon className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
