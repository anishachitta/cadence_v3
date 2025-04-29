import { create } from 'zustand'

type Patient = {
  id: string;
  name: string;
  status: "Completed" | "Active" | "Draft" | "Called";
  dob: string;
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
      id: "123923",
      name: "Anisha Chitta",
      status: "Active",
      dob: "01322004",
      phoneNumber: "+19498129268",
      successRate: "96%",
    },
    {
      id: "543239",
      name: "Bona Suh",
      status: "Active",
      dob: "02012005",
      phoneNumber: "+12136569648",
      successRate: "27%",
    },
    {
      id: "543139",
      name: "Devin Hayden",
      status: "Active",
      dob: "07212004",
      phoneNumber: "+15552345678",
      successRate: "57%",
    },
    {
      id: "375241",
      name: "Alisha Merchant",
      status: "Active",
      dob: "01141984",
      phoneNumber: "+19343789040",
      successRate: "40%",
    },
    {
      id: "573244",
      name: "Ashwani Chitta",
      status: "Active",
      dob: "01141984",
      phoneNumber: "+19493789040",
      successRate: "70%",
    },
  ],
  setPatients: (patients) => set({ patients }),
})); 