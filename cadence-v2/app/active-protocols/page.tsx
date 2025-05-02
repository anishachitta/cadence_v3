"use client";

import { useState, useEffect } from "react";
import { Grid, List, Plus, Search } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { usePatientStore } from "@/stores/patientStore";
import { useCallHistoryStore } from "@/stores/callHistoryStore";
import { useTranscriptStore } from "@/stores/useTranscriptStore";
import { useRouter } from "next/navigation";
import { useProtocolStore } from "@/stores/protocolStore";

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

export default function ActiveProtocols() {
  const addToCallHistory = useCallHistoryStore(
    (state) => state.addToCallHistory
  );
  const addTranscript = useTranscriptStore.getState().addTranscript;
  const setProtocols = useProtocolStore((state) => state.setProtocols);

  const [showModal, setShowModal] = useState(false);
  const router = useRouter();
  const protocols = useProtocolStore((state) => state.protocols);
  const clearProtocols = useProtocolStore((state) => state.clearProtocols);

  const pollForTranscript = async (
    callId: string,
    patientName: string,
    protocolName: string
  ) => {
    const maxWaitTimeMs = 5 * 60 * 1000;
    const pollingIntervalMs = 5000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTimeMs) {
      console.log(`📡 Polling for transcript of ${patientName}...`);

      const response = await fetch("/api/get-transcript", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId }),
      });

      const data = await response.json();
      const timestamp = new Date().toLocaleString("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      });

      if (data.success && data.transcript) {
        console.log(`✅ Transcript for ${patientName}:`, data.transcript);

        addTranscript({
          id: callId,
          callId,
          protocolName,
          patientName,
          date: timestamp,
          status: "Available",
        });
        return;
      }

      if (data.call_status === "ended") {
        console.warn(
          `❌ Call for ${patientName} ended but no transcript was found.`
        );

        addTranscript({
          id: callId,
          callId,
          protocolName,
          patientName,
          date: timestamp,
          status: "Pending",
        });
        return;
      }

      await new Promise((res) => setTimeout(res, pollingIntervalMs));
    }

    const timestamp = new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

    addTranscript({
      id: callId,
      callId,
      protocolName,
      patientName,
      date: timestamp,
      status: "Failed",
    });
  };

  const pollForCallEnd = async (
    callId: string,
    patientName: string,
    protocolName: string,
    addToCallHistory: (row: any) => void
  ) => {
    const pollingIntervalMs = 5000;
    const timeout = Date.now() + 5 * 60 * 1000;

    while (Date.now() < timeout) {
      const res = await fetch("/api/get-call-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callId }),
      });

      const data = await res.json();

      if (data.call_status === "ended") {
        console.log("✅ Call ended:", data);

        addToCallHistory({
          name: patientName,
          status:
            data.disconnection_reason === "agent_hangup"
              ? "Completed"
              : "Declined",
          protocol: protocolName,
          duration: data.readable_duration,
          date: data.timestamp,
        });

        return;
      }

      await new Promise((r) => setTimeout(r, pollingIntervalMs));
    }

    console.warn(`⌛ Timeout waiting for call ${callId} to end`);
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
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            toNumber: patient.phoneNumber,
            patientName: patient.name,
            agentId: protocol.agentId,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const callId = data.callId;

          console.log(
            `📞 Call started for ${patient.name} (Call ID: ${callId})`
          );

          pollForTranscript(callId, patient.name, protocol.name);
          pollForCallEnd(callId, patient.name, protocol.name, addToCallHistory);

          const currentProtocols = useProtocolStore.getState().protocols;

          const updatedProtocols = currentProtocols.map((p) => {
            if (p.id === protocol.id) {
              const [completed, total] = p.callsCompleted.split("/");
              const newCompleted =
                completed !== "-" ? parseInt(completed) + 1 : 1;
              const newTotal = total !== "-" ? parseInt(total) : 1;
              const successRate =
                Math.round((newCompleted / newTotal) * 100) + "%";

              return {
                ...p,
                callsCompleted: `${newCompleted}/${newTotal}`,
                successRate,
              };
            }
            return p;
          });

          setProtocols(updatedProtocols);
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
            <h1 className="text-xl font-regular">Voice Agents</h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search your agents..."
                  className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white"
                />
              </div>

              <button className="p-2 border rounded-md">
                <List size={16} />
              </button>
              <button className="p-2 border rounded-md">
                <Grid size={16} />
              </button>

              <button
                className="flex items-center gap-2 bg-white text-[#1F796E] border border-black px-3 py-2 rounded-md text-sm"
                onClick={() => router.push("/new-agent")}
              >
                <Plus size={16} />
                <span>New Agent</span>
              </button>
              <button
                className="flex items-center gap-2 bg-white text-red-600 border border-black px-3 py-2 rounded-md text-sm"
                onClick={clearProtocols}
              >
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex border-b">
              <button className="px-4 py-2 text-sm font-medium border-b-2 border-gray-900">
                All Agents
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
                  <th className="py-3 px-4 font-medium">Agent Name</th>
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

      {/*
      <NewProtocolModal
        onClose={() => setShowModal(false)}
        onAddProtocol={() => {}}
      />
      */}
    </div>
  );
}
