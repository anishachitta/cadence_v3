// stores/callHistoryStore.ts
import { createStore, type StoreApi } from "zustand/vanilla";
import { persist } from "zustand/middleware"; // ✅ use this, NOT /vanilla
import { useStore } from "zustand";

export type CallRow = {
  name: string;
  status: string;
  protocol: string;
  duration: string;
  date: string;
};

type CallHistoryStore = {
  callHistory: CallRow[];
  addToCallHistory: (row: CallRow) => void;
};

// ✅ Create store with persistence
export const callHistoryStore = createStore(
  persist<CallHistoryStore>(
    (set) => ({
      callHistory: [],
      addToCallHistory: (row) => {
        console.log("🧠 Adding call row:", row);
        set((state) => ({
          callHistory: [...state.callHistory, row],
        }));
      },
    }),
    {
      name: "call-history-storage",
      onRehydrateStorage: () => {
        console.log("📦 Rehydrating call history store...");
        return (state) => {
          console.log("✅ Rehydrated with state:", state);
        };
      },
    }
  )
);

// ✅ React hook for usage
export const useCallHistoryStore = <T>(
  selector: (state: CallHistoryStore) => T
) => useStore<StoreApi<CallHistoryStore>, T>(callHistoryStore, selector);
