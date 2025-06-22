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
  transactionHash?: string;
  blockNumber?: number;
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

  const documentId = params.id as string;

  // Redirect jika wallet tidak terkoneksi
  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  // Fetch document details
  useEffect(() => {
    const fetchDocumentDetails = async () => {
      if (!documentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
        const url = `${API_BASE_URL}/documents/${documentId}?network=private`;

        console.info("Fetching document details from:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const result = await response.json();
          const doc = result.data;

          const documentData: DocumentDetail = {
            id: doc.id,
            name: doc.name,
            cid: doc.cid,
            size: doc.size,
            issuer: doc.keyvalues?.instansi || "N/A",
            createdAt: doc.created_at,
            isValid: true,
            transactionHash: doc.transaction_hash,
            blockNumber: doc.block_number,
            network: "Ethereum Private Network",
          };

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
          "Failed to connect to the server. Please check your connection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [documentId]);

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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                      Network
                    </label>
                    <p className="mt-2 text-base text-gray-900">
                      {document.network}
                    </p>
                  </div>

                  {document.blockNumber && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Block Number
                      </label>
                      <p className="mt-2 text-base font-mono text-gray-900">
                        #{document.blockNumber}
                      </p>
                    </div>
                  )}

                  {document.transactionHash && (
                    <div className="lg:col-span-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                        Transaction Hash
                      </label>
                      <p className="mt-2 text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded-lg break-all">
                        {document.transactionHash}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href="#"
                    className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-2 text-lg"
                  >
                    View on Blockchain Explorer
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
