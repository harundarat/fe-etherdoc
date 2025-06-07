"use client";

import { useAccount } from "wagmi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const { open } = useAppKit();
  const router = useRouter();

  useEffect(() => {
    if (!isConnected) {
      router.push("/login");
    }
  }, [isConnected, router]);

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          Welcome to VeriDoc Dashboard
        </h1>
        <p className="text-gray-600 mb-4">Connected with: {address}</p>
        <button
          onClick={() => open()}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
        >
          Disconnect Wallet
        </button>
      </div>
    </div>
  );
}
