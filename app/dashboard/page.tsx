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
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/5 to-blue-400/5 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "30s" }}
        ></div>
      </div>

      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: "16px",
            color: "#1f2937",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          },
        }}
      />

      {/* Updated Sidebar */}
      <div className="relative z-10">
        <Sidebar
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          userAddress={address}
        />
      </div>

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
