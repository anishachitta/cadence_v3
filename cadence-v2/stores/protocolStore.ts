import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Protocol = {
  id: string;
  name: string;
  status: "Active" | "Completed" | "Draft";
  patientsEnrolled: number;
  callsCompleted: string;
  successRate: string;
  agentId: string;
  patientIds: string[];
};

interface ProtocolStore {
  protocols: Protocol[];
  addProtocol: (protocol: Protocol) => void;
  setProtocols: (protocols: Protocol[]) => void;
  clearProtocols: () => void;
}

export const useProtocolStore = create(
  persist<ProtocolStore>(
    (set) => ({
      protocols: [],
      addProtocol: (protocol) => set((state) => ({ protocols: [protocol, ...state.protocols] })),
      setProtocols: (protocols) => set({ protocols }),
      clearProtocols: () => set({ protocols: [] }),
    }),
    {
      name: 'protocols-storage',
    }
  )
); 