import { transcriptStore } from "@/stores/useTranscriptStore";
import { callHistoryStore } from "@/stores/callHistoryStore";

export const pollForTranscript = async (
  callId: string,
  patientName: string,
  protocolName: string
) => {
const addTranscript = transcriptStore.getState().addTranscript;
  const maxWaitTimeMs = 5 * 60 * 1000;
  const pollingIntervalMs = 5000;
  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitTimeMs) {
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

export const pollForCallEnd = async (
  callId: string,
  patientName: string,
  protocolName: string
) => {
    const addToCallHistory = callHistoryStore.getState().addToCallHistory;
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
};
