"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import DocumentsContent from "../components/DocumentsContent";
import { useAppKit } from "@reown/appkit/react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("documents");

  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        userAddress={address}
      />

      <main className="flex-1 overflow-hidden">
        {activeSection === "documents" && <DocumentsContent />}
      </main>
    </div>
  );
}
