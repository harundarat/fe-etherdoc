"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { documentsApi } from "@/lib/api";
import { DocumentVerification } from "@/lib/types/api";

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

  const [verification, setVerification] = useState<DocumentVerification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const documentId = params.documentId as string;

  useEffect(() => {
    const fetchDetails = async () => {
      if (!documentId) return;

      setIsLoading(true);
      setError(null);

      try {
        const data = await documentsApi.getVerifiedDocument(documentId);
        setVerification(data);
      } catch (err: unknown) {
        console.error("Verification fetch error:", err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch document verification details."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [documentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden flex flex-col">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                EtherDoc Verifier
              </span>
            </Link>

            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Dashboard
              </Link>
              <Link href="/search" className="text-gray-600 hover:text-blue-600 text-sm font-medium">
                Search
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex-1 flex flex-col w-full">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-medium transition-all duration-300 transform hover:scale-105 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/50 text-sm"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Loading Modal */}
        {isLoading && (
          <div className="fixed inset-0 backdrop-blur-md bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-10 shadow-2xl max-w-md mx-4 border border-white/30 text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-blue-600 mx-auto"></div>
              <h3 className="mt-6 text-xl font-bold text-gray-900">
                Fetching Verification Evidence...
              </h3>
              <p className="mt-2 text-sm text-gray-600">
                Verifying canonical source-chain and cross-chain replicas...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-white/80 backdrop-blur-lg border-l-4 border-red-500 rounded-3xl shadow-xl p-8 border border-white/50">
            <div className="flex items-center gap-4">
              <XCircleIcon className="w-10 h-10 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="text-xl font-bold text-red-800">
                  Verification Failed / Document Not Found
                </h2>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Verification Evidence Render */}
        {verification && (
          <div className="space-y-8">
            {/* Top Status Header */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {verification.integrity.matches ? (
                  <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                    <CheckCircleIcon className="w-8 h-8 text-green-600" />
                  </div>
                ) : (
                  <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center">
                    <XCircleIcon className="w-8 h-8 text-red-600" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-900">
                      Canonical Document Evidence
                    </h1>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        verification.document.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : verification.document.status === "REVOKED"
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {verification.document.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 font-mono mt-1 break-all">
                    Document ID: {verification.document.documentId}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span
                  className={`px-4 py-2 text-sm font-bold rounded-xl shadow-md ${
                    verification.integrity.matches
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                      : "bg-gradient-to-r from-red-600 to-pink-600 text-white"
                  }`}
                >
                  {verification.integrity.matches ? "✓ VERIFIED CANONICAL" : "✗ INTEGRITY FAILURE"}
                </span>
                <span className="text-xs text-gray-500 mt-2">
                  Schema Version {verification.document.schemaVersion} • Document Version {verification.document.version}
                </span>
              </div>
            </div>

            {/* Grid Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left 2 Cols: Details & Source */}
              <div className="lg:col-span-2 space-y-8">
                {/* Canonical Document Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <DocumentIcon className="w-5 h-5 text-blue-600" />
                    Document Properties
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">IPFS Content Identifier (CID)</p>
                      <p className="font-mono text-gray-900 text-xs mt-1 break-all">
                        {verification.document.cid}
                      </p>
                    </div>

                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">Issuer Address</p>
                      <p className="font-mono text-gray-900 text-xs mt-1 break-all">
                        {verification.document.issuer}
                      </p>
                    </div>

                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">Registered At</p>
                      <p className="text-gray-900 mt-1">
                        {new Date(verification.document.registeredAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">Last Updated At</p>
                      <p className="text-gray-900 mt-1">
                        {new Date(verification.document.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Hashes / Digest */}
                  <div className="mt-4 bg-white/60 p-4 rounded-2xl border border-white/40 space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Content Digest</p>
                      <p className="font-mono text-xs text-gray-700 break-all">{verification.document.contentDigest}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Metadata Commitment</p>
                      <p className="font-mono text-xs text-gray-700 break-all">{verification.document.metadataCommitment}</p>
                    </div>
                  </div>
                </div>

                {/* Source Chain Evidence Card */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">⛓</span>
                    Source Chain Confirmation
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">Chain ID / Selector</p>
                      <p className="font-medium text-gray-900 mt-1">
                        Chain {verification.source.chainId} (Selector: {verification.source.chainSelector})
                      </p>
                    </div>

                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40">
                      <p className="text-xs text-gray-500 font-medium">Confirmation Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-semibold text-green-700">
                          {verification.source.confirmationStatus}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({verification.source.confirmationDepth} blocks depth)
                        </span>
                      </div>
                    </div>

                    <div className="bg-white/60 p-4 rounded-2xl border border-white/40 sm:col-span-2">
                      <p className="text-xs text-gray-500 font-medium">Source Contract Address</p>
                      <p className="font-mono text-xs text-gray-900 mt-1 break-all">
                        {verification.source.contractAddress}
                      </p>
                    </div>

                    {verification.source.transactionHash && (
                      <div className="bg-white/60 p-4 rounded-2xl border border-white/40 sm:col-span-2">
                        <p className="text-xs text-gray-500 font-medium">Transaction Hash</p>
                        <p className="font-mono text-xs text-blue-600 mt-1 break-all">
                          {verification.source.transactionHash}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Col: Integrity, Destinations & Storage */}
              <div className="space-y-8">
                {/* Integrity Checklist */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Integrity Checklist
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="text-sm font-medium text-gray-700">Active Document</span>
                      {verification.integrity.active ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="text-sm font-medium text-gray-700">Content Digest Match</span>
                      {verification.integrity.contentMatches ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="text-sm font-medium text-gray-700">Issuer Match</span>
                      {verification.integrity.issuerMatches ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-red-500" />
                      )}
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="text-sm font-medium text-gray-700">Overall Match</span>
                      {verification.integrity.matches ? (
                        <span className="text-xs font-bold px-2 py-1 bg-green-100 text-green-800 rounded">
                          PASSED
                        </span>
                      ) : (
                        <span className="text-xs font-bold px-2 py-1 bg-red-100 text-red-800 rounded">
                          FAILED
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Storage Availability */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Storage Availability
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="font-medium text-gray-700">Status</span>
                      <span className="font-semibold text-blue-600">{verification.storage.status}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="font-medium text-gray-700">Available</span>
                      {verification.storage.available ? (
                        <CheckCircleIcon className="w-5 h-5 text-green-600" />
                      ) : (
                        <XCircleIcon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>

                    <div className="p-3 bg-white/60 rounded-xl border border-white/40">
                      <span className="text-xs text-gray-500 font-medium">Checked At</span>
                      <p className="text-xs text-gray-800 mt-0.5">
                        {new Date(verification.storage.checkedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Destination Cross-Chain Replicas */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-6 border border-white/50">
                  <h2 className="text-lg font-bold text-gray-900 mb-4">
                    Cross-Chain Replicas ({verification.destinations.length})
                  </h2>

                  {verification.destinations.length === 0 ? (
                    <p className="text-sm text-gray-500 italic">No destination replicas found.</p>
                  ) : (
                    <div className="space-y-4">
                      {verification.destinations.map((dest, idx) => (
                        <div key={idx} className="p-4 bg-white/60 rounded-2xl border border-white/40 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-sm text-gray-900">
                              Chain {dest.chainId}
                            </span>
                            <span className="text-xs font-semibold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                              {dest.effectiveStatus}
                            </span>
                          </div>

                          <p className="text-xs text-gray-500 font-mono truncate">
                            Contract: {dest.contractAddress}
                          </p>

                          {dest.messageId && (
                            <p className="text-xs text-gray-500 font-mono truncate">
                              Message ID: {dest.messageId}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
