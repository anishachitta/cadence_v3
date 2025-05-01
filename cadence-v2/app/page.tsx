"use client";

import { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import CallHistorySection from "@/components/CallHistorySection"; // ✅ your dynamic section

export default function Dashboard() {
  const [showNewProtocolModal, setShowNewProtocolModal] = useState(false);
  const [patients, setPatients] = useState([]);

  const handleAddProtocol = (protocol: {
    name: string;
    template: string;
    patientCount: number;
  }) => {
    // Implementation of handleAddProtocol
  };

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Today's Overview */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Today's Overview</h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-black rounded-md">
                <div className="w-4 h-4 rounded-full border border-black"></div>
                <span className="text-sm">32 Calls Scheduled</span>
              </div>

              <div className="flex items-center gap-3 p-3 border border-black rounded-md">
                <div className="w-4 h-4 rounded-full border border-black bg-[#1F796E]"></div>
                <span className="text-sm">12 Calls Completed</span>
              </div>

              <div className="flex items-center gap-3 p-3 border border-black rounded-md">
                <svg width="4" height="13" viewBox="0 0 4 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.08325 8.352L0.84325 0.799999H3.16325L2.92325 8.352H1.08325ZM2.01125 12.08C1.61658 12.08 1.29125 11.9627 1.03525 11.728C0.789917 11.4827 0.66725 11.184 0.66725 10.832C0.66725 10.48 0.789917 10.1867 1.03525 9.952C1.29125 9.70667 1.61658 9.584 2.01125 9.584C2.40592 9.584 2.72592 9.70667 2.97125 9.952C3.21658 10.1867 3.33925 10.48 3.33925 10.832C3.33925 11.184 3.21658 11.4827 2.97125 11.728C2.72592 11.9627 2.40592 12.08 2.01125 12.08Z" fill="#B61515"/>
                </svg>
                <span className="text-sm">7 Pending Follow-Ups</span>
              </div>
            </div>
          </div>

          {/* Active Protocols */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Active Protocols</h2>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Appointment Reminders</span>
                  <span className="text-gray-500">103/300 Contacted</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-black">
                  <div
                    className="h-full bg-[#1F796E] rounded-full"
                    style={{ width: "34%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rescheduled Follow-Ups</span>
                  <span className="text-gray-500">78/200 Contacted</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-black">
                  <div
                    className="h-full bg-[#1F796E] rounded-full"
                    style={{ width: "39%" }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Post-Appointment Feedback</span>
                  <span className="text-gray-500">136/200 Contacted</span>
                </div>
                <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden border border-black">
                  <div
                    className="h-full bg-[#1F796E] rounded-full"
                    style={{ width: "68%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Overview Statistics */}
          <div className="col-span-2 bg-white p-5 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Overview Statistics</h2>
              <div className="flex gap-2">
                <select className="px-3 py-1 border border-black rounded-md text-sm bg-white">
                  <option>All Protocols</option>
                </select>
                <select className="px-3 py-1 border border-black rounded-md text-sm bg-white">
                  <option>Last 30 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Total Calls */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Total Calls</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">243</span>
                  <span className="text-sm text-gray-500">calls</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <svg className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  <span className="text-sm text-emerald-500">12.3%</span>
            </div>
          </div>

              {/* Success Rate */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                  <span>Success Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">68%</span>
                  <span className="text-sm text-gray-500">rate</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <svg className="text-red-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 9l-6 6-6-6" />
                  </svg>
                  <span className="text-sm text-red-500">12.3%</span>
                </div>
              </div>

              {/* Average Call Duration */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                  <span>Average Call Duration</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">1:24</span>
                  <span className="text-sm text-gray-500">min/sec</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <svg className="text-red-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 9l-6 6-6-6" />
                  </svg>
                  <span className="text-sm text-red-500">1.3%</span>
                </div>
              </div>

              {/* Response Rate */}
              <div className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                  <span>Response Rate</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">82%</span>
                  <span className="text-sm text-gray-500">rate</span>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <svg className="text-emerald-500" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  <span className="text-sm text-emerald-500">6.7%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Call History */}
          <CallHistorySection />

        </div>
      </div>
    </div>
  );
}