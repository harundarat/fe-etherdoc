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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Search
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-6 text-gray-600 text-lg">
              Loading document details...
            </p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-8 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center gap-3">
              <XCircleIcon className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-semibold text-red-800 mb-1">
                  Document Not Found
                </p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Document Details */}
        {document && (
          <div className="space-y-8">
            {/* Status Header */}
            <div
              className={`p-6 rounded-2xl border-l-4 ${
                document.isValid
                  ? "bg-green-50 border-green-500"
                  : "bg-red-50 border-red-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {document.isValid ? (
                    <CheckCircleIcon className="w-12 h-12 text-green-500" />
                  ) : (
                    <XCircleIcon className="w-12 h-12 text-red-500" />
                  )}
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 mb-2">
                      Document Verification
                    </h1>
                    <p
                      className={`text-base font-semibold ${
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
                  className={`px-4 py-2 text-sm font-semibold rounded-full ${
                    document.isValid
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {document.isValid ? "VERIFIED" : "INVALID"}
                </span>
              </div>
            </div>

            {/* Document Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <DocumentIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Document Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Document Name
                    </label>
                    <p className="mt-2 text-base font-medium text-gray-900">
                      {document.name}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Document ID
                    </label>
                    <p className="mt-2 text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg break-all">
                      {document.id}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      File Size
                    </label>
                    <p className="mt-2 text-base text-gray-900">
                      {formatFileSize(document.size)}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Issuer/Institution
                    </label>
                    <p className="mt-2 text-base text-gray-900 bg-gray-50 p-3 rounded-lg">
                      {document.issuer}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Created At
                    </label>
                    <p className="mt-2 text-base text-gray-900">
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
                    <p className="mt-2 text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg break-all">
                      {document.cid}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Blockchain Information */}
            {document.isValid && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold">⛓</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Blockchain Information
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Ethereum Chain */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            ETH
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
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
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            document.isExistEthereum
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {document.isExistEthereum ? "VERIFIED" : "NOT FOUND"}
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
                        <p className="mt-1 text-sm text-gray-900">
                          Ethereum Private Network
                        </p>
                      </div>
                    </div>
                    {document.isExistEthereum && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 text-sm"
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

                  {/* Base Chain */}
                  <div className="border border-gray-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">
                            BASE
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900">
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
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            document.isExistBase
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
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
                        <p className="mt-1 text-sm text-gray-900">
                          Base Mainnet
                        </p>
                      </div>
                    </div>
                    {document.isExistBase && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 text-sm"
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
            )}
          </div>
        )}
      </main>
    </div>
  );
}
