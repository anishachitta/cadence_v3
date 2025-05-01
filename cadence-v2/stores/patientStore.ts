import { create } from 'zustand'

type Patient = {
  id: string;
  name: string;
  status: "Completed" | "Active" | "Draft" | "Called";
  dob: number | string;
  phoneNumber: string;
  callsCompleted: string;
  successRate: string;
};

interface PatientStore {
  patients: Patient[];
  setPatients: (patients: Patient[]) => void;
}

// Initialize with the same data
export const usePatientStore = create<PatientStore>((set) => ({
  patients: [
    {
      id: "1",
      name: "Anisha Chitta",
      status: "Completed",
      dob: 132,
      phoneNumber: "+19498129268",
      callsCompleted: "127/132",
      successRate: "96%",
    },
    {
      id: "2",
      name: "John Doe",
      status: "Active",
      dob: 132,
      phoneNumber: "+15552345678",
      callsCompleted: "22/132",
      successRate: "57%",
    },
    {
<<<<<<< Updated upstream
      id: "3",
=======
      id: "375241",
      name: "Alisha Merchant",
      status: "Active",
      dob: "01141984",
      phoneNumber: "+12014684556",
      successRate: "40%",
    },
    {
      id: "573244",
>>>>>>> Stashed changes
      name: "Ashwani Chitta",
      status: "Active",
      dob: 144,
      phoneNumber: "+19493789040",
      callsCompleted: "-",
      successRate: "-",
    },
  ],
  setPatients: (patients) => set({ patients }),
})); 