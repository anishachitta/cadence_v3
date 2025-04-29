"use client"

import { Search } from "lucide-react"
import { useState } from "react"

interface Transcript {
  patientName: string
  phoneNumber: string
  date: string
  duration: string
  status: "Confirmed" | "Voicemail"
}

export default function TranscriptsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data - replace with real data in production
  const transcripts: Transcript[] = [
    {
      patientName: "Sarah Johnson",
      phoneNumber: "123-456-7890",
      date: "April 30, 2025",
      duration: "1m 45s",
      status: "Confirmed"
    },
    {
      patientName: "Sarah Johnson",
      phoneNumber: "123-456-7890",
      date: "April 30, 2025",
      duration: "1m 45s",
      status: "Voicemail"
    }
  ]

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Call Transcripts</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your transcripts..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-[300px]"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-4">
        {transcripts.map((transcript, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-medium">{transcript.patientName}</h3>
                <div className="text-gray-500 flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                    <span>📞</span>
                    <span>{transcript.phoneNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>📅</span>
                    <span>{transcript.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>⏱️</span>
                    <span>{transcript.duration}</span>
                  </div>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${
                transcript.status === "Confirmed" 
                  ? "bg-green-100 text-green-800" 
                  : "bg-gray-100 text-gray-800"
              }`}>
                {transcript.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 