"use client";

import { useCallHistoryStore } from "@/stores/callHistoryStore";
import { Search } from "lucide-react";

export default function CallHistorySection() {
  const callHistory = useCallHistoryStore((state) => state.callHistory);

  return (
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
          <svg
            width="18"
            height="17"
            viewBox="0 0 18 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6979 8.81591H6.40208M2.76792 8.81591H1.28125M2.76792 8.81591C2.76792 8.3341 2.95932 7.87202 3.30001 7.53133C3.6407 7.19064 4.10277 6.99924 4.58458 6.99924C5.06639 6.99924 5.52847 7.19064 5.86916 7.53133C6.20985 7.87202 6.40125 8.3341 6.40125 8.81591C6.40125 9.29772 6.20985 9.75979 5.86916 10.1005C5.52847 10.4412 5.06639 10.6326 4.58458 10.6326C4.10277 10.6326 3.6407 10.4412 3.30001 10.1005C2.95932 9.75979 2.76792 9.29772 2.76792 8.81591ZM16.6979 14.3217H11.9079M11.9079 14.3217C11.9079 14.8037 11.7161 15.2663 11.3753 15.607C11.0345 15.9478 10.5723 16.1392 10.0904 16.1392C9.60861 16.1392 9.14653 15.947 8.80584 15.6063C8.46515 15.2656 8.27375 14.8036 8.27375 14.3217M11.9079 14.3217C11.9079 13.8398 11.7161 13.3781 11.3753 13.0373C11.0345 12.6965 10.5723 12.5051 10.0904 12.5051C9.60861 12.5051 9.14653 12.6965 8.80584 13.0372C8.46515 13.3779 8.27375 13.8399 8.27375 14.3217M8.27375 14.3217H1.28125"
              stroke="black"
              strokeWidth="1.25"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="overflow-x-auto mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="text-left font-medium py-2 px-2">Patient Name</th>
              <th className="text-left font-medium py-2 px-2">Status</th>
              <th className="text-left font-medium py-2 px-2">Protocol</th>
              <th className="text-left font-medium py-2 px-2">Duration</th>
              <th className="text-left font-medium py-2 px-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {/* Dynamic data */}
            {callHistory.map((call, idx) => (
              <tr key={`store-${idx}`} className="border-b bg-[#F0FFF0]">
                <td className="py-3 px-2">{call.name}</td>
                <td className="py-3 px-2">{call.status}</td>
                <td className="py-3 px-2">{call.protocol}</td>
                <td className="py-3 px-2">{call.duration}</td>
                <td className="py-3 px-2">{call.date}</td>
              </tr>
            ))}

            {/* Static/fake entries */}
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
          </tbody>
        </table>
      </div>
    </div>
  );
}
