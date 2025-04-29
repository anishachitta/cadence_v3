"use client";

import { useState } from "react";
import { Grid, List, Phone, Plus, Search } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { AddPatientModal } from "@/components/add-patient-modal";
import { CallSimulationModal } from "@/components/call-simulation-modal";
import { useRetellConfig } from "@/hooks/useRetellConfig";
import { makePhoneCall } from "@/services/retellService";
import { toast } from "sonner";
import { Toaster } from "sonner";
import { usePatientStore } from "@/stores/patientStore";

type Patient = {
  id: string;
  name: string;
  status: "Completed" | "Active" | "Draft" | "Called";
  dob: string;
  phoneNumber: string;
  successRate: string;
};

type Flag = {
  id: string;
  patientName: string;
  message: string;
  priority: "High" | "Moderate" | "Low";
};

// Move this outside the component
const CALL_TEMPLATES = [
  {
    id: "direct_call",
    name: "Direct Patient Call",
    description: "Short, friendly check-in call with the patient",
    agentId: "agent_af8d7952b291c293b87a9f6ad8", // Maya's agent ID
  },
];

export default function PatientsPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [callPatient, setCallPatient] = useState<Patient | null>(null);
  const { config, hasConfig } = useRetellConfig();
  const { setPatients } = usePatientStore();

  // Remove the useEffect that sets initial data
  // Instead, just get patients from the store
  const patients = usePatientStore((state) => state.patients);

  const [flags, setFlags] = useState<Flag[]>([
    {
      id: "1",
      patientName: "John Doe",
      message: "John Doe has missed 3 appointments in the past month.",
      priority: "High",
    },
    {
      id: "2",
      patientName: "John Doe",
      message: "John Doe has missed 3 appointments in the past month.",
      priority: "Moderate",
    },
    {
      id: "3",
      patientName: "John Doe",
      message: "John Doe has missed 3 appointments in the past month.",
      priority: "Low",
    },
    {
      id: "4",
      patientName: "John Doe",
      message: "John Doe has missed 3 appointments in the past month.",
      priority: "High",
    },
  ]);

  // Function to add a new patient
  const handleAddPatient = (patientData: { name: string; phoneNumber: string }) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: patientData.name,
      status: "Active",
      dob: "-",
      phoneNumber: patientData.phoneNumber,
      successRate: "0%",
    };
    setPatients([newPatient, ...patients]);
    setShowAddModal(false);
  };

  // Function to handle call completion
  const handleCallComplete = (accepted: boolean) => {
    if (callPatient && accepted) {
      // Update patient status and call stats
      setPatients(
        patients.map((p) => {
          if (p.id === callPatient.id) {
            return {
              ...p,
              status: "Called",
            };
          }
          return p;
        })
      );
    }
    setCallPatient(null);
  };

  // Function to make a direct Retell call
  const handleDirectCall = async (patient: Patient) => {
    if (!hasConfig) {
      toast.error(
        "Retell API not configured. Please configure it in the settings."
      );
      return;
    }

    console.log("Making direct call for patient:", patient.name);

    try {
      const response = await fetch("/api/make-call", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          toNumber: patient.phoneNumber,
          patientName: patient.name,
          agentId: "agent_af8d7952b291c293b87a9f6ad8",
        }),
      });

      if (response.ok) {
        toast.success(
          `Call initiated to ${patient.name} at ${patient.phoneNumber}`
        );
      }
    } catch (error) {
      console.error("Failed to initiate call:", error);
      toast.error("Failed to initiate call");
    }
  };

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />
      <Toaster position="top-right" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Patients Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-xl font-regular">Patients</h4>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white"
                  />
                </div>
                <button
                  className="flex items-center gap-2 bg-teal-500 text-white px-3 py-2 rounded-md text-sm"
                  onClick={() => setShowAddModal(true)}
                >
                  <Plus size={16} />
                  <span>Add Patient</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex border border-[#6B7A87] rounded-lg overflow-hidden">
                <button className="m-1 px-2 py-0.5 text-sm rounded-sm focus:outline-none transition-colors bg-[#6B7A87] text-white">
                  All Patients
                </button>
                <button className="px-5 py-2 text-sm focus:outline-none transition-colors text-black bg-white border-0">
                  Active
                </button>
                <button className="px-5 py-2 text-sm focus:outline-none transition-colors text-black bg-white border-0">
                  Inactive
                </button>
                <button className="px-5 py-2 text-sm rounded-r-lg focus:outline-none transition-colors text-black bg-white border-0">
                  Drafts
                </button>
              </div>
              <div className="flex gap-2 ml-2">
                <button className="p-2 border border-[#6B7A87] rounded-md bg-white">
                  <List size={16} />
                </button>
                <button className="p-2 border border-[#6B7A87] rounded-md bg-white">
                  <Grid size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-gray-500" style={{ borderColor: '#EFF1F2' }}>
                    <th className="py-3 px-4 font-medium text-left">Patient Name</th>
                    <th className="py-3 px-4 font-medium text-center">Status</th>
                    <th className="py-3 px-4 font-medium text-center">DOB</th>
                    <th className="py-3 px-4 font-medium text-center">Patient ID #</th>
                    <th className="py-3 px-4 font-medium text-center">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b" style={{ borderColor: '#EFF1F2' }}>
                      <td className="py-3 px-3 text-sm text-left">{patient.name}</td>
                      <td className="py-1 px-1 text-sm text-center">
                        <span
                          className="px-6 py-1 rounded-md text-black text-sm font-normal inline-block text-center"
                          style={{ minWidth: '80px', backgroundColor: '#F1FFFA', border: '1px solid #1F796E' }}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-sm text-center">{patient.dob}</td>
                      <td className="py-3 px-3 text-sm text-center">{patient.id}</td>
                      <td className="py-3 px-3 text-sm text-center">{patient.successRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Flags & Warnings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl ">Flags & Warnings</h2>
              <button className="px-3 py-1 border rounded-md text-sm">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="mb-2 px-2 py-1 bg-red-500 rounded-md inline-block text-sm text-white">
                  High Priority
                </div>
                <div className="space-y-3 py-3">
                  {flags
                    .filter((flag) => flag.priority === "High")
                    .map((flag) => (
                      <div key={flag.id} className="p-3 border rounded-md w-61">
                        <p>{flag.message}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-2 px-2 py-1 bg-gray-100 rounded-md inline-block text-sm">
                  Moderate Priority
                </div>
                <div className="space-y-3 py-3">
                  {flags
                    .filter((flag) => flag.priority === "Moderate")
                    .map((flag) => (
                      <div key={flag.id} className="p-4 border rounded-md">
                        <p>{flag.message}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-2 px-2 py-1 bg-gray-100 rounded-md inline-block text-sm">
                  Low Priority
                </div>
                <div className="space-y-3 py-3">
                  {flags
                    .filter((flag) => flag.priority === "Low")
                    .map((flag) => (
                      <div key={flag.id} className="p-4 border rounded-md">
                        <p>{flag.message}</p>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddPatientModal
          onClose={() => setShowAddModal(false)}
          onAddPatient={handleAddPatient}
        />
      )}

      {callPatient && (
        <CallSimulationModal
          patientName={callPatient.name}
          phoneNumber={callPatient.phoneNumber}
          onClose={() => setCallPatient(null)}
          onCallComplete={handleCallComplete}
        />
      )}
    </div>
  );
}
