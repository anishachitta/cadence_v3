"use client";

import React, { useState } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";

const protocols = [
  { id: "1", name: "Insurance Policy Updates", status: "Active", description: "Policy update calls" },
  { id: "2", name: "Appointment Reminders", status: "Active", description: "Remind patients of appointments" },
  { id: "3", name: "Clinic Feedback Survey", status: "Draft", description: "Collect feedback from patients" },
];

const patients = [
  { id: "123923", name: "John Doe", status: "Active", dob: "04/02/04", phoneNumber: "+19498129268", successRate: "96%" },
  { id: "543239", name: "John Doe", status: "Active", dob: "07/24/98", phoneNumber: "+2136569648", successRate: "57%" },
  { id: "543139", name: "John Doe", status: "Active", dob: "07/24/98", phoneNumber: "+15552345678", successRate: "57%" },
  { id: "375241", name: "John Doe", status: "Active", dob: "07/24/98", phoneNumber: "+19343789040", successRate: "57%" },
];

export default function NewAgentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assigned, setAssigned] = useState<{ [id: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("General Info");
  const [search, setSearch] = useState("");
  const router = useRouter();

  const filteredProtocols = protocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">Create New Agent</h1>
            <div className="flex gap-2">
              <button
                className="px-4 py-2 border rounded-md text-sm"
                onClick={() => router.push("/active-protocols")}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-teal-600 text-white rounded-md text-sm"
                onClick={() => router.push("/active-protocols")}
              >
                Save Agent
              </button>
            </div>
          </div>
          <div className="mb-6">
            <div className="flex border-b">
              {['General Info', 'Call Script', 'Voice Settings'].map(tab => (
                <button
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium border-b-2 ${activeTab === tab ? 'border-gray-900' : 'border-transparent text-gray-500'}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "General Info" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                  <div className="font-medium mb-2">Basic Information</div>
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 text-sm mb-4"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Agent Name"
                  />
                  <textarea
                    className="w-full border rounded-md px-3 py-2 text-sm"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="Enter a short description..."
                    rows={4}
                  />
                </div>
                <div></div>
              </div>
              <div className="mb-4 font-medium">Agent Assignment</div>
              <div className="mb-4 flex items-center gap-2">
                <div className="relative w-full max-w-xs">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search your patients..."
                    className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white w-full"
                  />
                </div>
                <button className="p-2 border rounded-md bg-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-gray-500">
                      <th className="py-3 px-4 font-medium text-left">Patient Name</th>
                      <th className="py-3 px-4 font-medium text-left">Status</th>
                      <th className="py-3 px-4 font-medium text-left">DOB</th>
                      <th className="py-3 px-4 font-medium text-left">Patient ID #</th>
                      <th className="py-3 px-4 font-medium text-left">Success Rate</th>
                      <th className="py-3 px-4 font-medium text-center">Assigned?</th>
                    </tr>
                  </thead>
                  <tbody>
                    {patients.map((patient) => (
                      <tr key={patient.id} className="border-b">
                        <td className="py-3 px-4">{patient.name}</td>
                        <td className="py-3 px-4">
                          <span className="px-3 py-1 rounded-md text-xs bg-teal-100 text-teal-800">{patient.status}</span>
                        </td>
                        <td className="py-3 px-4">{patient.dob}</td>
                        <td className="py-3 px-4">{patient.id}</td>
                        <td className="py-3 px-4">{patient.successRate}</td>
                        <td className="py-3 px-4 text-center">
                          <input
                            type="checkbox"
                            checked={!!assigned[patient.id]}
                            onChange={() => setAssigned(a => ({ ...a, [patient.id]: !a[patient.id] }))}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {activeTab === "Call Script" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column: Question Blocks */}
              <div className="space-y-4">
                {[1, 2, 3].map((block, idx) => (
                  <div key={block} className="bg-white border rounded-lg p-4 relative">
                    <div className="flex items-center mb-2">
                      <span className="mr-2 text-lg">❓</span>
                      <span className="font-medium">Question Block</span>
                      <button className="ml-auto text-red-500 hover:text-red-700">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M6 18L18 6" /></svg>
                      </button>
                    </div>
                    {idx === 2 ? (
                      <>
                        <textarea
                          className="w-full border rounded-md px-3 py-2 text-sm mb-2"
                          defaultValue={"Inform the patient of the {{appointment_date}} and the {{clinic_location}}."}
                          rows={2}
                        />
                        <div className="bg-gray-50 border rounded-md p-3 mt-2">
                          <div className="font-medium mb-1 text-sm">Response Handling</div>
                          <textarea
                            className="w-full border rounded-md px-3 py-2 text-sm"
                            defaultValue={"Let the voice agent know how you want it to respond...."}
                            rows={2}
                          />
                        </div>
                      </>
                    ) : null}
                  </div>
                ))}
              </div>
              {/* Right column: Actions and Variables */}
              <div className="space-y-6">
                <div className="bg-white border rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="relative w-full max-w-xs">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        placeholder="Search for elements..."
                        className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white w-full"
                      />
                    </div>
                    <button className="px-3 py-2 border rounded-md text-sm bg-gray-100">Import Template</button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                      <span className="text-xl mb-2">✖️</span>
                      <span className="text-sm">End Call</span>
                    </button>
                    <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                      <span className="text-xl mb-2">📞</span>
                      <span className="text-sm">Transfer Call</span>
                    </button>
                    <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                      <span className="text-xl mb-2">🤖</span>
                      <span className="text-sm">AI Prompt</span>
                    </button>
                    <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                      <span className="text-xl mb-2">❓</span>
                      <span className="text-sm">Question Block</span>
                    </button>
                  </div>
                </div>
                <div className="bg-white border rounded-lg p-4">
                  <div className="font-medium mb-2">Available Variables</div>
                  <div className="flex flex-col gap-2">
                    {["{{clinic_name}}", "{{patient_name}}", "{{provider_name}}", "{{appointment_date}}"].map((v) => (
                      <div key={v} className="bg-gray-50 border rounded px-3 py-2 text-sm font-mono">{v}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === "Voice Settings" && (
            <div className="py-12 text-gray-400 text-center">Voice Settings configuration coming soon...</div>
          )}
        </div>
      </div>
    </div>
  );
} 