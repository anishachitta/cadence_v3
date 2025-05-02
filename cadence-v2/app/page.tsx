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

  // Replace top and middle sections with new Overview Statistics and AI Flagged Alerts
  const overviewStats = [
    {
      title: "Revenue Protected",
      value: "$4,320 dollars",
      sub: "",
      change: "+12.3%",
      changeColor: "text-emerald-500",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
      ),
    },
    {
      title: "AI-Confirmed Appointments",
      value: "87 confirmed",
      sub: "",
      change: "+22.4%",
      changeColor: "text-emerald-500",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" /></svg>
      ),
    },
    {
      title: "Patient Issues Detected",
      value: "36 flags",
      sub: "",
      change: "+3.9%",
      changeColor: "text-red-500",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
      ),
    },
    {
      title: "Staff Hours Saved",
      value: "19 hours",
      sub: "",
      change: "+17.1%",
      changeColor: "text-emerald-500",
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
      ),
    },
  ];

  const flaggedAlerts = [
    {
      name: "John Doe",
      tag: "Scheduling",
      message: "John has rescheduled 3 appointments this month.",
    },
    {
      name: "Jane Smith",
      tag: "Health",
      message: "Jane mentioned that she wants to follow-up about her back pain.",
    },
    {
      name: "Alex Matthews",
      tag: "Billing",
      message: "Alex has missed their last invoice due date and ignored a follow-up call.",
    },
  ];

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Overview Statistics */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Overview Statistics</h2>
            <div className="flex gap-2">
              <select className="px-3 py-1 border border-black rounded-md text-sm bg-white">
                <option>All Agents</option>
              </select>
              <select className="px-3 py-1 border border-black rounded-md text-sm bg-white">
                <option>Last 30 Days</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {overviewStats.map((stat) => (
              <div key={stat.title} className="bg-white p-4 rounded-lg border">
                <div className="flex items-center gap-2 mb-2">
                  {stat.icon}
                  <span>{stat.title}</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl">{stat.value}</span>
                  {stat.sub && <span className="text-sm text-gray-500">{stat.sub}</span>}
                </div>
                <div className={`flex items-center gap-1 mt-2 ${stat.changeColor}`}>
                  <span className="text-sm">{stat.change}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Flagged Alerts */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">AI Flagged Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flaggedAlerts.map((alert) => (
              <div key={alert.name} className="border rounded-lg p-4 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {/* Avatar or icon */}
                  </div>
                  <span className="font-medium">{alert.name}</span>
                  <span className="ml-auto px-2 py-1 bg-gray-100 rounded text-xs">{alert.tag}</span>
                </div>
                <div className="text-gray-700">{alert.message}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Call History */}
          <CallHistorySection />

        </div>
      </div>
    </div>
  );
}