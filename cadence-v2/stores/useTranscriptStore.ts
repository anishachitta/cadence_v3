// stores/useTranscriptStore.ts
import { create } from "zustand";

export type TranscriptRow = {
  id: string;
  callId: string;
  protocolName: string;
  patientName: string;
  date: string;
  status: "Available" | "Pending" | "Failed";
  content?: string; // added for fetched content
};

type TranscriptStore = {
  transcripts: TranscriptRow[];
  addTranscript: (row: TranscriptRow) => void;
};

export const useTranscriptStore = create<TranscriptStore>((set) => ({
  transcripts: [],
  addTranscript: (row) =>
    set((state) => {
      if (state.transcripts.some((t) => t.id === row.id)) return state;
      return { transcripts: [row, ...state.transcripts] };
    }),
}));
