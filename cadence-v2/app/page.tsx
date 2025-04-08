import { Search } from "lucide-react"
import { Sidebar } from "@/components/sidebar"

export default function Dashboard() {
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
              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <span>32 Calls Scheduled</span>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>12 Calls Completed</span>
              </div>

              <div className="flex items-center gap-3 p-3 border rounded-md">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>7 Pending Follow-Ups</span>
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
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: "34%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Rescheduled Follow-Ups</span>
                  <span className="text-gray-500">78/200 Contacted</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "39%" }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Post-Appointment Feedback</span>
                  <span className="text-gray-500">136/200 Contacted</span>
                </div>
                <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-teal-500 rounded-full" style={{ width: "68%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Data Insights */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Data Insights</h2>

            <div className="h-40 w-full">
              <svg viewBox="0 0 400 100" className="w-full h-full stroke-emerald-500 stroke-2 fill-none">
                <path
                  d="M0,50 L20,45 L40,60 L60,40 L80,55 L100,35 L120,50 L140,30 L160,45 L180,50 L200,35 L220,55 L240,40 L260,60 L280,45 L300,50 L320,30 L340,55 L360,40 L380,20 L400,10"
                  className="stroke-emerald-500 fill-none"
                />
                <path
                  d="M0,50 L20,45 L40,60 L60,40 L80,55 L100,35 L120,50 L140,30 L160,45 L180,50 L200,35 L220,55 L240,40 L260,60 L280,45 L300,50 L320,30 L340,55 L360,40 L380,20 L400,10 L400,100 L0,100 Z"
                  className="stroke-none fill-emerald-100/50"
                />
              </svg>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <h2 className="text-lg font-medium mb-4">Upcoming Tasks</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-sm">Create New Patient Intake protocol for this quarter</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-sm">Update appointment reminders protocol with new patients</span>
              </div>

              <div className="flex items-start gap-3">
                <div className="mt-0.5 w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full"></div>
                </div>
                <span className="text-sm">Remove old or non-existing patients from protocols</span>
              </div>
            </div>
          </div>

          {/* Call History */}
          <div className="bg-white p-5 rounded-lg shadow-sm col-span-1 md:col-span-2">
            <h2 className="text-lg font-medium mb-4">Call History</h2>

            <div className="mb-4 flex items-center gap-2">
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search your calls..."
                  className="w-full pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <button className="p-2 border rounded-md">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
            </div>

            <div className="overflow-x-auto">
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
  )
}
