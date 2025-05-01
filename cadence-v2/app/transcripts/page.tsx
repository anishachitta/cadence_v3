// app/transcripts/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useTranscriptStore } from "@/stores/useTranscriptStore";

export default function TranscriptsPage() {
  const [search, setSearch] = useState("");
  const transcripts = useTranscriptStore((state) => state.transcripts);
  const hasInitialized = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (hasInitialized.current) return;
    useTranscriptStore.getState().addTranscript({
      id: "1",
      callId: "fake-call-id-1",
      protocolName: "Appointment Reminder",
      patientName: "Anisha Chitta",
      date: "April 30, 2025 10:03 AM",
      status: "Available",
    });
    hasInitialized.current = true;
  }, []);

  const filtered = transcripts.filter((t) =>
    `${t.protocolName} ${t.patientName}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-6">Transcripts</h1>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="py-3 px-4 font-medium">Protocol Name</th>
                  <th className="py-3 px-4 font-medium">Patient</th>
                  <th className="py-3 px-4 font-medium">Date</th>
                  <th className="py-3 px-4 font-medium">Transcript Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b cursor-pointer hover:bg-gray-50"
                    onClick={() => router.push(`/transcripts/${t.id}`)}
                  >
                    <td className="py-4 px-4">{t.protocolName}</td>
                    <td className="py-4 px-4">{t.patientName}</td>
                    <td className="py-4 px-4">{t.date}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          t.status === "Available"
                            ? "bg-teal-100 text-teal-800"
                            : t.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
