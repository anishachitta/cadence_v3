import { create } from 'zustand'

type Patient = {
  id: string;
  name: string;
  status: "Completed" | "Active" | "Draft" | "Called";
  dob: number | string;
  phoneNumber: string;
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
      successRate: "96%",
    },
    {
      id: "2",
      name: "Bona Suh",
      status: "Active",
      dob: 132,
      phoneNumber: "+12136569648",
      successRate: "57%",
    },
    {
      id: "375241",
      name: "Alisha Merchant",
      status: "Active",
      dob: "01141984",
      phoneNumber: "+12014684556",
      successRate: "40%",
    },
    {
      id: "573244",
      name: "Devin Hayden",
      status: "Active",
      dob: 144,
      phoneNumber: "+19712460548",
      successRate: "-",
    },
  ],
  setPatients: (patients) => set({ patients }),
})); 