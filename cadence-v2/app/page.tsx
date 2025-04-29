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

  return (
    <div className="flex h-screen bg-gray-50">
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
