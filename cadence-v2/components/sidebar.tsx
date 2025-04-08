"use client"

import Link from "next/link"
import { BarChart3, ChevronDown, Home, Phone, Settings, Users } from "lucide-react"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-6">
          <div className="text-primary font-semibold text-lg flex items-center">
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              className="mr-2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            Cadence
          </div>
        </div>

        <div className="flex items-center justify-between border rounded-md p-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-1 rounded-md">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="16"></line>
                <line x1="8" y1="12" x2="16" y2="12"></line>
              </svg>
            </div>
            <div className="text-sm">
              <div>Lavalab Clinic</div>
              <div className="text-xs text-gray-500">Workspace</div>
            </div>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>

      <nav className="p-2">
        <div className="space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 w-full p-2 rounded-md ${
              pathname === "/" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Home size={18} />
            <span>Dashboard</span>
          </Link>

          <div>
            <button className="flex items-center justify-between w-full p-2 rounded-md text-gray-700 hover:bg-gray-100">
              <div className="flex items-center gap-3">
                <Phone size={18} />
                <span>Call Manager</span>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </button>

            <div className="ml-9 mt-1 space-y-1 text-sm text-gray-600">
              <Link
                href="/active-protocols"
                className={`block py-1 ${pathname === "/active-protocols" ? "text-teal-600" : ""}`}
              >
                Active Protocols
              </Link>
              <div className="py-1">Call Monitor</div>
              <div className="py-1">Transcripts</div>
            </div>
          </div>

          <Link
            href="/patients"
            className={`flex items-center gap-3 w-full p-2 rounded-md ${
              pathname === "/patients" ? "bg-gray-100 text-gray-900" : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Users size={18} />
            <span>Patients</span>
          </Link>

          <button className="flex items-center gap-3 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <BarChart3 size={18} />
            <span>Data & Insights</span>
          </button>

          <button className="flex items-center gap-3 w-full p-2 rounded-md text-gray-700 hover:bg-gray-100">
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
