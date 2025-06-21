"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DocumentsContent from "../components/DocumentsContent";
import UploadModal from "../components/UploadModal";

import { Toaster } from "react-hot-toast";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("documents");
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const openUploadPopup = () => setIsUploadPopupOpen(true);
  const closeUploadPopup = () => {
    setIsUploadPopupOpen(false);
    // Trigger refresh after upload
    setRefreshTrigger(Date.now());
  };

  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`,
          }}
        />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "12px",
            color: "#1f2937",
          },
        }}
      />

      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userAddress={address}
      />

      <main className="flex-1 relative z-10 overflow-y-auto">
        {activeSection === "documents" && (
          <DocumentsContent
            onUploadClick={openUploadPopup}
            refreshTrigger={refreshTrigger}
          />
        )}
      </main>

      {/* Modal Upload */}
      <UploadModal
        isOpen={isUploadPopupOpen}
        onClose={closeUploadPopup}
        onUploadSuccess={() => setRefreshTrigger(Date.now())}
      />
    </div>
  );
}
