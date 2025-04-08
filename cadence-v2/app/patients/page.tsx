"use client"

import { useState } from "react"
import { Grid, List, Phone, Plus, Search } from "lucide-react"
import { Sidebar } from "@/components/sidebar"
import { AddPatientModal } from "@/components/add-patient-modal"
import { CallSimulationModal } from "@/components/call-simulation-modal"
import { useRetellConfig } from "@/hooks/useRetellConfig"
import { makePhoneCall } from "@/services/retellService"
import { toast } from "sonner"
import { Toaster } from "sonner"

type Patient = {
  id: string
  name: string
  status: "Completed" | "Active" | "Draft" | "Called"
  dob: number | string
  phoneNumber: string
  callsCompleted: string
  successRate: string
}

type Flag = {
  id: string
  patientName: string
  message: string
  priority: "High" | "Moderate" | "Low"
}

export default function PatientsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [callPatient, setCallPatient] = useState<Patient | null>(null)
  const { config, hasConfig } = useRetellConfig()
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Doe",
      status: "Completed",
      dob: 132,
      phoneNumber: "(555) 123-4567",
      callsCompleted: "127/132",
      successRate: "96%",
    },
    {
      id: "2",
      name: "John Doe",
      status: "Active",
      dob: 132,
      phoneNumber: "(555) 234-5678",
      callsCompleted: "22/132",
      successRate: "57%",
    },
    {
      id: "3",
      name: "John Doe",
      status: "Draft",
      dob: 0,
      phoneNumber: "(555) 345-6789",
      callsCompleted: "-",
      successRate: "-",
    },
  ])

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
  ])

  // Function to add a new patient
  const handleAddPatient = (patientData: {
    name: string
    phoneNumber: string
  }) => {
    const newPatient: Patient = {
      id: Date.now().toString(),
      name: patientData.name,
      status: "Active",
      dob: "-",
      phoneNumber: patientData.phoneNumber,
      callsCompleted: "0/0",
      successRate: "0%",
    }

    setPatients([newPatient, ...patients])
    setShowAddModal(false)
  }

  // Function to handle call completion
  const handleCallComplete = (accepted: boolean) => {
    if (callPatient && accepted) {
      // Update patient status and call stats
      setPatients(
        patients.map((patient) => {
          if (patient.id === callPatient.id) {
            const [completed, total] = patient.callsCompleted.split("/")
            const newCompleted = completed !== "-" ? Number.parseInt(completed) + 1 : 1
            const newTotal = total !== "-" ? Number.parseInt(total) + 1 : 1
            const successRate = Math.round((newCompleted / newTotal) * 100) + "%"

            return {
              ...patient,
              status: "Called",
              callsCompleted: `${newCompleted}/${newTotal}`,
              successRate,
            }
          }
          return patient
        }),
      )
    }
    setCallPatient(null)
  }

  // Function to make a direct Retell call
  const handleDirectCall = async (patient: Patient) => {
    if (!hasConfig) {
      toast.error("Retell API not configured. Please configure it in the settings.")
      return
    }

    const success = await makePhoneCall(patient.phoneNumber)
    if (success) {
      toast.success(`Call initiated to ${patient.name} at ${patient.phoneNumber}`)

      // Update patient status
      setPatients(
        patients.map((p) => {
          if (p.id === patient.id) {
            const [completed, total] = p.callsCompleted.split("/")
            const newCompleted = completed !== "-" ? Number.parseInt(completed) + 1 : 1
            const newTotal = total !== "-" ? Number.parseInt(total) + 1 : 1
            const successRate = Math.round((newCompleted / newTotal) * 100) + "%"

            return {
              ...p,
              status: "Called",
              callsCompleted: `${newCompleted}/${newTotal}`,
              successRate,
            }
          }
          return p
        }),
      )
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <Toaster position="top-right" />

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          {/* Patients Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-semibold">Patients</h1>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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

            <div className="mb-6 flex justify-between items-center">
              <div className="flex">
                <button className="px-4 py-2 text-sm font-medium bg-gray-200 rounded-l-md">All Patients</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 border-y border-r">Active</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 border-y border-r">Inactive</button>
                <button className="px-4 py-2 text-sm font-medium text-gray-500 border-y border-r rounded-r-md">
                  Drafts
                </button>
              </div>
              <div className="flex border rounded-md">
                <button className="p-2 border-r">
                  <List size={16} />
                </button>
                <button className="p-2">
                  <Grid size={16} />
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b text-gray-500">
                    <th className="py-3 px-4 font-medium">Patient Name</th>
                    <th className="py-3 px-4 font-medium">Status</th>
                    <th className="py-3 px-4 font-medium">DOB</th>
                    <th className="py-3 px-4 font-medium">Phone Number</th>
                    <th className="py-3 px-4 font-medium">Calls Completed</th>
                    <th className="py-3 px-4 font-medium">Success Rate</th>
                    <th className="py-3 px-4 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <tr key={patient.id} className="border-b">
                      <td className="py-4 px-4">{patient.name}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-md text-xs ${
                            patient.status === "Active"
                              ? "bg-blue-100 text-blue-800"
                              : patient.status === "Completed"
                                ? "bg-teal-100 text-teal-800"
                                : patient.status === "Called"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {patient.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">{patient.dob}</td>
                      <td className="py-4 px-4">{patient.phoneNumber}</td>
                      <td className="py-4 px-4">{patient.callsCompleted}</td>
                      <td className="py-4 px-4">{patient.successRate}</td>
                      <td className="py-4 px-4 flex gap-2">
                        <button
                          onClick={() => setCallPatient(patient)}
                          className="p-2 text-teal-600 hover:bg-teal-50 rounded-full transition-colors"
                          title="Call patient with simulation"
                        >
                          <Phone size={16} />
                        </button>
                        {hasConfig && (
                          <button
                            onClick={() => handleDirectCall(patient)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Call patient with Retell API"
                          >
                            <Phone size={16} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Flags & Warnings Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Flags & Warnings</h2>
              <button className="px-3 py-1 border rounded-md text-sm">View All</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="mb-2 px-2 py-1 bg-gray-100 rounded-md inline-block text-sm">High Priority</div>
                <div className="space-y-3">
                  {flags
                    .filter((flag) => flag.priority === "High")
                    .map((flag) => (
                      <div key={flag.id} className="p-4 border rounded-md">
                        <p>{flag.message}</p>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <div className="mb-2 px-2 py-1 bg-gray-100 rounded-md inline-block text-sm">Moderate Priority</div>
                <div className="space-y-3">
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
                <div className="mb-2 px-2 py-1 bg-gray-100 rounded-md inline-block text-sm">Low Priority</div>
                <div className="space-y-3">
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

      {showAddModal && <AddPatientModal onClose={() => setShowAddModal(false)} onAddPatient={handleAddPatient} />}

      {callPatient && (
        <CallSimulationModal
          patientName={callPatient.name}
          phoneNumber={callPatient.phoneNumber}
          onClose={() => setCallPatient(null)}
          onCallComplete={handleCallComplete}
        />
      )}
    </div>
  )
}
