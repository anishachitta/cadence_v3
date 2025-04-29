"use client";

import { useState } from "react";
import { Grid, List, Plus, Search } from "lucide-react";
import { NewProtocolModal } from "@/components/new-protocol-modal";
import { Sidebar } from "@/components/sidebar";
import { usePatientStore } from "@/stores/patientStore";

type Protocol = {
  id: string;
  name: string;
  status: "Active" | "Completed" | "Draft";
  patientsEnrolled: number;
  callsCompleted: string;
  successRate: string;
  agentId: string;
  patientIds: string[];
};

type PatientDetails = {
  id: string;
  phoneNumber: string;
  name: string;
};

const getPatientDetails = async (
  patientIds: string[]
): Promise<PatientDetails[]> => {
  const response = await fetch("/api/patients", {
    method: "POST",
    body: JSON.stringify({ patientIds }),
  });
  return response.json();
};

export default function ActiveProtocols() {
  const [showModal, setShowModal] = useState(false);
  const [protocols, setProtocols] = useState<Protocol[]>([
    {
      id: "1",
      name: "Insurance Policy Updates",
      status: "Completed",
      patientsEnrolled: 132,
      callsCompleted: "127/132",
      successRate: "96%",
      agentId: "agent_onboarding_123",
      patientIds: ["patient_1", "patient_2", "patient_3"],
    },
    {
      id: "2",
      name: "Appointment Reminders",
      status: "Active",
      patientsEnrolled: 132,
      callsCompleted: "22/132",
      successRate: "57%",
      agentId: "agent_followup_456",
      patientIds: ["patient_4", "patient_5", "patient_6"],
    },
    {
      id: "3",
      name: "Clinic Feedback Survey",
      status: "Draft",
      patientsEnrolled: 0,
      callsCompleted: "-",
      successRate: "-",
      agentId: "",
      patientIds: [],
    },
  ]);

  const handleAddProtocol = (protocolData: {
    name: string;
    template: string;
    patientCount: number;
    agentId: string;
    patientIds: string[];
  }) => {
    const newProtocol: Protocol = {
      id: Date.now().toString(),
      name: protocolData.name,
      status: "Active",
      patientsEnrolled: protocolData.patientCount,
      callsCompleted: `0/${protocolData.patientCount}`,
      successRate: "0%",
      agentId: protocolData.agentId,
      patientIds: protocolData.patientIds,
    };

    setProtocols([newProtocol, ...protocols]);
    initiateProtocolCalls(newProtocol);
    setShowModal(false);
  };

  const pollForTranscript = async (callId: string, patientName: string) => {
    const maxWaitTimeMs = 5 * 60 * 1000; // 5 minutes
    const pollingIntervalMs = 5000;
    const startTime = Date.now();
  
    while (Date.now() - startTime < maxWaitTimeMs) {
      console.log(`Polling for transcript of ${patientName}...`);
  
      const response = await fetch("/api/get-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId }),
      });
  
      const data = await response.json();
  
      if (data.success && data.transcript) {
        console.log(`✅ Transcript for ${patientName}:`, data.transcript);
        return; // <-- 🔥 THIS STOPS THE LOOP
      }
  
      await new Promise(res => setTimeout(res, pollingIntervalMs));
    }
  
    console.warn(`❌ Timed out waiting for transcript for ${patientName}.`);
  };
  
  

  const initiateProtocolCalls = async (protocol: Protocol) => {
    try {
      const patients = usePatientStore.getState().patients;
      const selectedPatients = patients.filter((p) =>
        protocol.patientIds.includes(p.id)
      );

      for (const patient of selectedPatients) {
        const response = await fetch("/api/make-call", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            toNumber: patient.phoneNumber,
            patientName: patient.name,
            agentId: protocol.agentId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const callId = data.callId;
          console.log(`📞 Call started for ${patient.name} (Call ID: ${callId})`);

          // Start polling immediately
          pollForTranscript(callId, patient.name);

          // Update your protocol call counts
          setProtocols((currentProtocols) =>
            currentProtocols.map((p) => {
              if (p.id === protocol.id) {
                const [completed, total] = p.callsCompleted.split("/");
                const newCompleted =
                  completed !== "-" ? Number.parseInt(completed) + 1 : 1;
                const newTotal = total !== "-" ? Number.parseInt(total) : 1;
                const successRate =
                  Math.round((newCompleted / newTotal) * 100) + "%";

                return {
                  ...p,
                  callsCompleted: `${newCompleted}/${newTotal}`,
                  successRate,
                };
              }
              return p;
            })
          );
        }
      }
    } catch (error) {
      console.error("Failed to initiate calls:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />

      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-semibold">Active Protocols</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search your protocols..."
                  className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white"
                />
              </div>
              <button className="p-2 border rounded-md">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M4 6h16M4 12h16M4 18h7" />
                </svg>
              </button>
              <button
                className="flex items-center gap-2 bg-white text-[#1F796E] border border-black px-3 py-2 rounded-md text-sm"
                onClick={() => setShowModal(true)}
              >
                <Plus size={16} />
                <span>New Protocol</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-gray-900">
                All Protocols
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500">
                Active
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500">
                Completed
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-500">
                Drafts
              </button>
              <div className="ml-auto flex">
                <button className="p-2 border-r bg-gray-100">
                  <List size={16} />
                </button>
                <button className="p-2">
                  <Grid size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b text-gray-500">
                  <th className="py-3 px-4 font-medium">Protocol Name</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Patients Enrolled</th>
                  <th className="py-3 px-4 font-medium">Calls Completed</th>
                  <th className="py-3 px-4 font-medium">Success Rate</th>
                </tr>
              </thead>
              <tbody>
                {protocols.map((protocol) => (
                  <tr key={protocol.id} className="border-b">
                    <td className="py-4 px-4">{protocol.name}</td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-1 rounded-md text-xs ${
                          protocol.status === "Active"
                            ? "bg-blue-100 text-blue-800"
                            : protocol.status === "Completed"
                            ? "bg-teal-100 text-teal-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {protocol.status}
                      </span>
                    </td>
                    <td className="py-4 px-4">{protocol.patientsEnrolled}</td>
                    <td className="py-4 px-4">{protocol.callsCompleted}</td>
                    <td className="py-4 px-4">{protocol.successRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showModal && (
        <NewProtocolModal
          onClose={() => setShowModal(false)}
          onAddProtocol={handleAddProtocol}
        />
      )}
    </div>
  );
}
