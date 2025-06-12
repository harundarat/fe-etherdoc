"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DocumentsContent from "../components/DocumentsContent";
import UploadModal from "../components/UploadModal";
import { useAppKit } from "@reown/appkit/react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("documents");
  const [isUploadPopupOpen, setIsUploadPopupOpen] = useState(false);

  const openUploadPopup = () => setIsUploadPopupOpen(true);
  const closeUploadPopup = () => setIsUploadPopupOpen(false);

  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userAddress={address}
      />

      <main className="flex-1 p-8">
        {activeSection === "documents" && (
          <DocumentsContent
            onUploadClick={openUploadPopup}
            isUploadPopupOpen={isUploadPopupOpen}
            onCloseUpload={closeUploadPopup}
          />
        )}
      </main>

      {/* Modal Upload */}
      <UploadModal isOpen={isUploadPopupOpen} onClose={closeUploadPopup} />
    </div>
  );
}
