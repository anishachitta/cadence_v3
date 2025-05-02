// stores/useTranscriptStore.ts
import { createStore } from "zustand/vanilla";
import { useStore } from "zustand";

export type TranscriptRow = {
  id: string;
  callId: string;
  protocolName: string;
  patientName: string;
  date: string;
  status: "Available" | "Pending" | "Failed";
  content?: string;
};

type TranscriptStore = {
  transcripts: TranscriptRow[];
  addTranscript: (row: TranscriptRow) => void;
};

// ✅ Create vanilla store
export const transcriptStore = createStore<TranscriptStore>((set) => ({
  transcripts: [],
  addTranscript: (row) =>
    set((state) => {
      if (state.transcripts.some((t) => t.id === row.id)) return state;
      return { transcripts: [row, ...state.transcripts] };
    }),
}));

// ✅ React hook to use in components
export const useTranscriptStore = <T>(
  selector: (state: TranscriptStore) => T
) => useStore(transcriptStore, selector);
