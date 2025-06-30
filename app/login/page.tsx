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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-full blur-3xl animate-spin"
          style={{ animationDuration: "20s" }}
        ></div>
      </div>

      {/* Logo di kiri atas */}
      <div className="absolute top-8 left-8 flex items-center gap-3 z-20">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
          <span className="text-white font-bold text-xl">E</span>
        </div>
        <span className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
          EtherDoc
        </span>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-4 relative z-10">
        {/* Login Card */}
        <div className="relative group">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-300"></div>

          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-12 max-w-md w-full shadow-2xl border border-white/30 transform hover:scale-[1.02] transition-all duration-300">
            <div className="flex flex-col items-center text-center">
              {/* Icon */}
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-110 transition-all duration-300">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-4">
                Connect Your Wallet
              </h1>

              {/* Description */}
              <p className="text-gray-600 mb-8 leading-relaxed text-lg">
                Securely access EtherDoc by connecting and signing with your
                preferred crypto wallet.
              </p>

              {/* Connect Button */}
              <button
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100 shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Connecting...
                  </>
                ) : (
                  <>
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
                    Connect & Sign
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-6 p-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 rounded-xl text-red-700 text-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <svg
                      className="w-4 h-4 text-red-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Features */}
              <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-600">Secure</p>
                </div>
                <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-white"
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
                  </div>
                  <p className="text-xs font-medium text-gray-600">Fast</p>
                </div>
                <div className="text-center p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-white/30">
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-gray-600">Trusted</p>
                </div>
              </div>

              {/* Terms */}
              <p className="text-sm text-gray-500 mt-8 leading-relaxed">
                By connecting your wallet, you agree to our{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-blue-600 hover:text-purple-600 font-medium transition-colors"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center text-gray-500 text-sm z-10">
        <div className="bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">
          © {new Date().getFullYear()} EtherDoc. All rights reserved.
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
