"use client"

import type React from "react"

import { useState } from "react"
import { Check } from "lucide-react"

type AddPatientModalProps = {
  onClose: () => void
  onAddPatient: (patientData: {
    name: string
    phoneNumber: string
  }) => void
}

export function AddPatientModal({ onClose, onAddPatient }: AddPatientModalProps) {
  const [step, setStep] = useState<"create" | "success">("create")
  const [patientName, setPatientName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Create the patient before showing success
    onAddPatient({
      name: patientName,
      phoneNumber: phoneNumber,
    })

    setStep("success")
  }

  const handleCancel = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        {step === "create" && (
          <>
            <h2 className="text-xl font-semibold mb-6 text-center">Add New Patient</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  placeholder="Enter patient name"
                  className="w-full p-2 border border-black rounded-md bg-white text-black"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full p-2 border border-black rounded-md bg-white text-black"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end mt-6 gap-2">
                <button type="button" onClick={handleCancel} className="px-4 py-2 border rounded-md text-sm">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
                  Add Patient
                </button>
              </div>
            </form>
          </>
        )}

        {step === "success" && (
          <div className="text-center py-8">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Check className="text-green-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Patient Added Successfully</h2>
            <p className="text-gray-500 mb-6">The patient has been added to your system.</p>
            <button onClick={handleCancel} className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm">
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
