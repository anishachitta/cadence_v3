"use client";

import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Sidebar } from "@/components/sidebar";

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
          <div className="bg-white p-5 rounded-lg shadow-sm col-span-1 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Call History</h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search your calls..."
                  className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white"
                />
              </div>
              <button className="p-2 border border-black rounded-md">
                <svg width="18" height="17" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.6979 8.81591H6.40208M2.76792 8.81591H1.28125M2.76792 8.81591C2.76792 8.3341 2.95932 7.87202 3.30001 7.53133C3.6407 7.19064 4.10277 6.99924 4.58458 6.99924C5.06639 6.99924 5.52847 7.19064 5.86916 7.53133C6.20985 7.87202 6.40125 8.3341 6.40125 8.81591C6.40125 9.29772 6.20985 9.75979 5.86916 10.1005C5.52847 10.4412 5.06639 10.6326 4.58458 10.6326C4.10277 10.6326 3.6407 10.4412 3.30001 10.1005C2.95932 9.75979 2.76792 9.29772 2.76792 8.81591ZM16.6979 14.3217H11.9079M11.9079 14.3217C11.9079 14.8037 11.7161 15.2663 11.3753 15.607C11.0345 15.9478 10.5723 16.1392 10.0904 16.1392C9.60861 16.1392 9.14653 15.947 8.80584 15.6063C8.46515 15.2656 8.27375 14.8036 8.27375 14.3217M11.9079 14.3217C11.9079 13.8398 11.7161 13.3781 11.3753 13.0373C11.0345 12.6965 10.5723 12.5051 10.0904 12.5051C9.60861 12.5051 9.14653 12.6965 8.80584 13.0372C8.46515 13.3779 8.27375 13.8399 8.27375 14.3217M8.27375 14.3217H1.28125M16.6979 3.31007H14.1104M10.4763 3.31007H1.28125M10.4763 3.31007C10.4763 2.82826 10.6676 2.36619 11.0083 2.0255C11.349 1.68481 11.8111 1.49341 12.2929 1.49341C12.5315 1.49341 12.7677 1.5404 12.9881 1.63169C13.2085 1.72299 13.4088 1.8568 13.5775 2.0255C13.7462 2.19419 13.88 2.39446 13.9713 2.61487C14.0626 2.83527 14.1096 3.07151 14.1096 3.31007C14.1096 3.54864 14.0626 3.78488 13.9713 4.00528C13.88 4.22569 13.7462 4.42596 13.5775 4.59465C13.4088 4.76335 13.2085 4.89716 12.9881 4.98846C12.7677 5.07975 12.5315 5.12674 12.2929 5.12674C11.8111 5.12674 11.349 4.93534 11.0083 4.59465C10.6676 4.25396 10.4763 3.79188 10.4763 3.31007Z" stroke="black" strokeWidth="1.25" strokeMiterlimit="10" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="text-left font-medium py-2 px-2">
                      Patient Name
                    </th>
                    <th className="text-left font-medium py-2 px-2">Status</th>
                    <th className="text-left font-medium py-2 px-2">
                      Protocol
                    </th>
                    <th className="text-left font-medium py-2 px-2">
                      Duration
                    </th>
                    <th className="text-left font-medium py-2 px-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-3 px-2">Josheta Srinivasan</td>
                    <td className="py-3 px-2">Declined</td>
                    <td className="py-3 px-2">Post-Appointment Feedback</td>
                    <td className="py-3 px-2">01:37</td>
                    <td className="py-3 px-2">Today, 9:43 AM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Alex Forgosh</td>
                    <td className="py-3 px-2">Accepted</td>
                    <td className="py-3 px-2">Appointment Reminder</td>
                    <td className="py-3 px-2">01:37</td>
                    <td className="py-3 px-2">Today, 9:43 AM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">Iris Leung</td>
                    <td className="py-3 px-2">Declined</td>
                    <td className="py-3 px-2">Rescheduling</td>
                    <td className="py-3 px-2">01:37</td>
                    <td className="py-3 px-2">Today, 9:43 AM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">John Doe</td>
                    <td className="py-3 px-2">Declined</td>
                    <td className="py-3 px-2">Onboarding</td>
                    <td className="py-3 px-2">01:37</td>
                    <td className="py-3 px-2">Today, 9:43 AM</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-3 px-2">John Doe</td>
                    <td className="py-3 px-2">Declined</td>
                    <td className="py-3 px-2">Onboarding</td>
                    <td className="py-3 px-2">01:37</td>
                    <td className="py-3 px-2">Today, 9:43 AM</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
