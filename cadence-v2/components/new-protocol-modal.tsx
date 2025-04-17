"use client";

import { useState } from "react";
import { Check, Search } from "lucide-react";
import { usePatientStore } from "@/stores/patientStore";

type Step = "create" | "template" | "patients" | "success";

type Patient = {
  id: string;
  name: string;
  // add other patient fields that exist in your patients array
};

type CallTemplate = {
  id: string;
  name: string;
  description: string;
  agentId: string;
};

type NewProtocolModalProps = {
  onClose: () => void;
  onAddProtocol: (protocolData: {
    name: string;
    template: string;
    patientCount: number;
    agentId: string;
    patientIds: string[];
  }) => void;
};

export function NewProtocolModal({
  onClose,
  onAddProtocol,
}: NewProtocolModalProps) {
  const patients = usePatientStore((state) => state.patients);
  const [step, setStep] = useState<Step>("create");
  const [protocolName, setProtocolName] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [teamMembers, setTeamMembers] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<CallTemplate | null>(
    null
  );
  const [selectedPatients, setSelectedPatients] = useState<string[]>([]);

  const CALL_TEMPLATES: CallTemplate[] = [
    {
      id: "onboarding",
      name: "Onboarding Survey",
      description:
        "Standardized patient onboarding survey for collecting personal information",
      agentId: "agent_27bb2484a5c860a93334a5ce62",
    },
    {
      id: "followup",
      name: "Follow-Up Reminder",
      description:
        "Quick phone call to remind patients of an upcoming appointment or procedure",
      agentId: "agent_d17ee681fe233635ed77b0989c",
    },
    {
      id: "retention",
      name: "Retention Check-in",
      description:
        "Scheduled phone call to collect qualitative data about a patient's experience throughout a study",
      agentId: "agent_4eadebe0031c8cc9bfd22b8ed7",
    },
  ];

  const handleNext = () => {
    if (step === "create") setStep("template");
    else if (step === "template") setStep("patients");
    else if (step === "patients") {
      onAddProtocol({
        name: protocolName || "New Protocol",
        template: selectedTemplate?.id || "default",
        patientCount: selectedPatients.length || 4,
        agentId: selectedTemplate?.agentId || "",
        patientIds: selectedPatients,
      });
      setStep("success");
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const togglePatient = (id: string) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(
        selectedPatients.filter((patientId) => patientId !== id)
      );
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {step === "create" && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Create New Protocol
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Protocol Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your protocol name"
                  className="w-full p-3 border border-black rounded-md bg-white text-gray-800"
                  value={protocolName}
                  onChange={(e) => setProtocolName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Start & End Date
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-black rounded-md bg-white text-gray-800"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  >
                    <option value="" disabled>
                      Select a date range
                    </option>
                    <option value="next-7-days">Next 7 days</option>
                    <option value="next-14-days">Next 14 days</option>
                    <option value="next-30-days">Next 30 days</option>
                    <option value="custom">Custom range</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Assign Team Members
                </label>
                <div className="relative">
                  <select
                    className="w-full p-3 border border-black rounded-md bg-white text-gray-800"
                    value={teamMembers}
                    onChange={(e) => setTeamMembers(e.target.value)}
                  >
                    <option value="" disabled>
                      Choose team members
                    </option>
                    <option value="all">All team members</option>
                    <option value="nurses">Nurses only</option>
                    <option value="doctors">Doctors only</option>
                    <option value="custom">Custom selection</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "template" && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Select a Call Template
            </h2>
            <div className="space-y-3">
              {CALL_TEMPLATES.map((template) => (
                <label
                  key={template.id}
                  className="flex items-start p-3 border rounded-md cursor-pointer"
                >
                  <input
                    type="radio"
                    name="template"
                    className="mt-1 mr-3"
                    checked={selectedTemplate?.id === template.id}
                    onChange={() => setSelectedTemplate(template)}
                  />
                  <div>
                    <div className="font-medium">{template.name}</div>
                    <div className="text-sm text-gray-500">
                      {template.description}
                    </div>
                  </div>
                </label>
              ))}
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "patients" && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center">
              Assign Patients
            </h2>
            <div className="mb-4 relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Search for existing patients..."
                className="w-full pl-9 pr-4 py-2 border rounded-md"
              />
            </div>
            <div className="border rounded-md overflow-hidden max-h-[300px] overflow-y-auto">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 border-b last:border-b-0"
                >
                  <div>
                    <div>{patient.name}</div>
                    <div className="text-sm text-gray-500">
                      ID: {patient.id}
                    </div>
                    <div className="text-sm text-gray-500">
                      Phone: {patient.phoneNumber}
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={selectedPatients.includes(patient.id)}
                    onChange={() => togglePatient(patient.id)}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border rounded-md text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
              >
                Next
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Protocol Created Successfully
            </h2>
            <p className="text-gray-500 mb-6">
              You're all set. You can now begin scheduling calls.
            </p>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
