"use client";

import { useAppKit } from "@reown/appkit/react";

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userAddress?: string;
}

// SVG Icons
const DocumentIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

const HelpIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const LogoutIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

export default function Sidebar({
  activeSection,
  setActiveSection,
  userAddress,
}: SidebarProps) {
  const { open } = useAppKit();

  const menuItems = [
    { id: "documents", label: "Documents", icon: DocumentIcon },
  ];

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r border-white/30 flex flex-col shadow-2xl">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

      {/* Logo */}
      <div className="p-6 border-b border-white/30 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
            <svg
              className="w-6 h-6 text-white"
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
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
              EtherDoc
            </span>
            <div className="text-xs text-gray-600 font-medium">
              Secure • Verified
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 relative z-10">
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-3">
            Main Menu
          </div>
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-300 group ${
                    activeSection === item.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-xl shadow-blue-500/25 transform scale-105"
                      : "text-gray-700 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 transition-all duration-300 group-hover:scale-110 ${
                      activeSection === item.id ? "text-white" : "text-gray-500"
                    }`}
                  />
                  <span className="font-medium">{item.label}</span>
                  {activeSection === item.id && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full shadow-lg"></div>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* Help */}
      <div className="p-4 border-t border-white/30 relative z-10">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:text-gray-900 hover:bg-white/60 backdrop-blur-sm border border-white/20 hover:border-white/40 hover:shadow-lg transition-all duration-300 group">
          <HelpIcon className="w-5 h-5 group-hover:scale-110 transition-transform text-gray-500" />
          <span className="font-medium">Help & Support</span>
        </button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-white/30 relative z-10">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/30 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {userAddress ? formatAddress(userAddress) : "User"}
                </div>
                <div className="text-xs text-gray-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Connected
                </div>
              </div>
            </div>
            <button
              onClick={() => open()}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-white/60 rounded-lg transition-all duration-300 hover:scale-110 border border-white/20 hover:border-white/40"
              title="Manage Wallet"
            >
              <LogoutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
