"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount, useSignMessage } from "wagmi";
import { useAppKit } from "@reown/appkit/react";

export default function LoginPage() {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { signMessageAsync } = useSignMessage();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!isConnected || !address) {
      // Jika belum terhubung, buka modal koneksi wallet
      open();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // 1. Get nonce from server
      const nonceRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/nonce`,
      );
      if (!nonceRes.ok) {
        throw new Error("Failed to fetch message from server.");
      }
      const { messageString } = await nonceRes.json();
      if (!messageString) {
        throw new Error("Invalid message received from server.");
      }

      // 2. Ask user to sign message
      const signature = await signMessageAsync({ message: messageString });

      // 3. Verify signature to backend
      const loginRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ signature }),
        },
      );

      if (!loginRes.ok) {
        const errorData = await loginRes.json();
        throw new Error(errorData.message || "Login failed. Please try again.");
      }

      // 4. save access token to local storage
      const data = await loginRes.json();
      localStorage.setItem("etherdoc-auth", data.accessToken);
      console.info(`accessToken: ${data.accessToken}`);

      // 5. Redirect to dashboard
      router.push("/dashboard");
    } catch (err: unknown) {
      console.error("Authentication error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
      setIsLoading(false);
    }
  };

  // When wallet connected, try login
  useEffect(() => {
    if (isConnected && address) {
      handleLogin();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address]);

  return (
    <div className="min-h-screen bg-[#1a1f2e] flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.05) 35px, rgba(255,255,255,.05) 70px)`,
          }}
        />
      </div>

      {/* Logo di kiri atas */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">V</span>
        </div>
        <span className="text-white text-xl font-medium">VeriDoc</span>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-12 max-w-md w-full mx-4 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-blue-500 rounded-2xl flex items-center justify-center mb-8">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            Securely access VeriDoc by connecting and signing with your
            preferred crypto wallet.
          </p>

          {/* Connect Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
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
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            {isLoading ? "Connecting..." : "Connect & Sign"}
          </button>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 mt-4">Error: {error}</p>}

          {/* Terms */}
          <p className="text-sm text-gray-500 mt-6">
            By connecting your wallet, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} VeriDoc. All rights reserved.
      </div>
    </div>
  );
}
