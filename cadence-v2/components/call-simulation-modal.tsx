"use client"

import { useEffect, useState } from "react"
import { Phone, X, CheckCircle2, User, AlertCircle } from "lucide-react"
import { makePhoneCall } from "@/services/retellService"

type CallSimulationModalProps = {
  patientName: string
  phoneNumber: string
  onClose: () => void
  onCallComplete: (accepted: boolean) => void
}

export function CallSimulationModal({
  patientName,
  phoneNumber,
  onClose,
  onCallComplete,
}: CallSimulationModalProps) {
  const [callState, setCallState] = useState<"dialing" | "connecting" | "in-progress" | "completed" | "error">(
    "dialing"
  )
  const [callDuration, setCallDuration] = useState(0)
  const [accepted, setAccepted] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const simulateStatus = async () => {
      try {
        setCallState("dialing")
        await new Promise((res) => setTimeout(res, 1000))

        setCallState("connecting")
        await new Promise((res) => setTimeout(res, 1000))

        const success = await makePhoneCall(phoneNumber)

        if (success) {
          setCallState("in-progress")
          setAccepted(true)

          // Let call run for 5 seconds before marking as complete
          setTimeout(() => {
            setCallState("completed")
          }, 5000)
        } else {
          throw new Error("Call failed")
        }
      } catch (err) {
        setErrorMessage((err as Error).message || "Call failed")
        setCallState("error")
      }
    }

    simulateStatus()
  }, [phoneNumber])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (callState === "in-progress") {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [callState])

  useEffect(() => {
    if (callState === "completed" || callState === "error") {
      const timeout = setTimeout(() => onCallComplete(accepted), 2000)
      return () => clearTimeout(timeout)
    }
  }, [callState, accepted, onCallComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleEndCall = () => {
    setCallState("completed")
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Retell AI Call</h2>
          {callState !== "in-progress" && (
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="flex flex-col items-center justify-center py-8">
          {["dialing", "connecting"].includes(callState) && (
            <>
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6 relative">
                <User size={40} className="text-gray-600" />
                <div
                  className={`absolute inset-0 border-4 border-teal-500 rounded-full ${
                    callState === "dialing" ? "animate-ping opacity-75" : "animate-pulse"
                  }`}
                ></div>
              </div>
              <h3 className="text-xl font-medium mb-2">{patientName}</h3>
              <p className="text-gray-500 mb-6">{phoneNumber}</p>
              <p className="text-gray-600">
                {callState === "dialing" ? "Dialing..." : "Connecting with Retell AI..."}
              </p>
            </>
          )}

          {callState === "in-progress" && (
            <>
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
                <User size={40} className="text-teal-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">{patientName}</h3>
              <p className="text-gray-500 mb-2">{phoneNumber}</p>
              <div className="text-teal-600 font-medium mb-6">Call in progress</div>
              <div className="text-3xl font-mono">{formatTime(callDuration)}</div>
              <div className="mt-8 flex space-x-4">
                <button
                  onClick={handleEndCall}
                  className="p-4 bg-red-100 rounded-full text-red-600 hover:bg-red-200 transition-colors"
                >
                  <Phone className="h-6 w-6" />
                </button>
              </div>
            </>
          )}

          {callState === "completed" && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 size={40} className="text-green-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Call Completed</h3>
              <p className="text-gray-500 mb-2">{patientName} • {formatTime(callDuration)}</p>
              <div className="text-green-600 font-medium mb-6">Call was successful</div>
              <p className="text-gray-600 text-center max-w-xs">
                Retell AI successfully completed the call.
              </p>
            </>
          )}

          {callState === "error" && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-red-600" />
              </div>
              <h3 className="text-xl font-medium mb-2">Call Failed</h3>
              <p className="text-gray-500 mb-6">{phoneNumber}</p>
              <div className="text-red-600 font-medium mb-2">Error</div>
              <p className="text-gray-600 text-center max-w-xs">
                {errorMessage || "There was an error making the call. Please try again later."}
              </p>
            </>
          )}
        </div>

        {(callState === "completed" || callState === "error") && (
          <div className="flex justify-center mt-4">
            <button
              onClick={() => onCallComplete(accepted)}
              className="px-4 py-2 bg-gray-900 text-white rounded-md text-sm"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
