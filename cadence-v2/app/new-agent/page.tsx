"use client";

import React, { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { usePatientStore } from "@/stores/patientStore";
import { toast } from "sonner";
import { useProtocolStore } from "@/stores/protocolStore";

const protocols = [
  { id: "1", name: "Insurance Policy Updates", status: "Active", description: "Policy update calls" },
  { id: "2", name: "Appointment Reminders", status: "Active", description: "Remind patients of appointments" },
  { id: "3", name: "Clinic Feedback Survey", status: "Draft", description: "Collect feedback from patients" },
];

// Place postVisitCareTemplate here, outside of any other array/object
const postVisitCareTemplate = [
  {
    question: "We're following up on your recent visit with {{provider_name}} on {{appointment_date}} at {{clinic_location}}. Ask for feedback.",
    response: 'Positive: We\'re glad to hear that!\n Negative or unsure: feedback is passed along to the clinic team.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Since appointment, have any symptoms worsened or changed",
    response: 'Yes: Recommend calling the clinic to speak with your provider as soon as possible.\nNo: If anything changes, feel free to contact clinic.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Would you like us to schedule a follow-up appointment, or would you prefer the clinic to contact you to check in?",
    response: 'Yes: I\'ll let the clinic know you\'d like to follow up.\nNo: Okay — no action needed. ',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
];

const appointmentReminderTemplate = [
  {
    question: "Inform the patient of the {{appointment_date}} and the {{clinic_location}}. Ask the patient if this appointment still works for them.",
    response: "If the patient indicates that the appointment still works for them, provide thanks and end the call.\n\nIf the patient indicated that the appointment doesn't work, continue forward.",
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
];

// Add Billing Followup template
const billingFollowupTemplate = [
  {
    question: "Notify the patient of a billing issue or overdue balance related to their recent appointment.",
    response: 'If acknowledged, proceed.\nIf confused or denies knowledge, offer to direct them to support.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Ask if the patient would like to pay over the phone, receive a callback, or handle it online.",
    response: 'If phone payment requested, route to live agent or collect callback preference.\nIf online preferred, provide the website or send a follow-up message.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Check if the patient has any questions or needs help understanding the bill.",
    response: 'If yes, offer to connect with billing support.\nIf no, end call politely.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
];

// Add Pre-Procedure (Colonoscopy) template
const preProcedureColonoscopyTemplate = [
  {
    question: "Confirm that the patient is scheduled for a colonoscopy on a specific date with their provider.",
    response: 'If confirmed, continue to next steps.\nIf denied or unsure, end call or redirect to support.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Verify whether the patient has begun following the low-fiber diet as instructed in the days leading up to the procedure.",
    response: 'If yes, proceed.\nIf no, recommend reviewing their preparation instructions.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Ask if the patient understands that they must follow a clear liquid diet the day before the procedure.",
    response: 'If yes, proceed.\nIf no, recommend contacting the clinic for clarification.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
  {
    question: "Confirm that the patient has picked up and plans to take the bowel prep solution or laxative as instructed.",
    response: 'If yes, end call positively.\nIf no, recommend prompt pickup and review of instructions.',
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
];

// Add Test template
const testTemplate = [
  {
    question: "Calling to remind you of your check-up at {{appointment_date}}",
    response: "Yes: See you soon\nNo: Reschedule appointment",
    placeholder: "Enter a question for the voice agent to ask...",
    responsePlaceholder: "Let the voice agent know how you want it to respond....",
    expanded: true,
  },
];

type QuestionBlock = {
  question: string;
  response: string;
  placeholder: string;
  responsePlaceholder: string;
  expanded: boolean;
};

const QuestionBlockDraggable = () => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "QUESTION_BLOCK",
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));
  return (
    <button
      ref={drag as unknown as React.Ref<HTMLButtonElement>}
      className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      type="button"
    >
      <span className="mb-2">
        <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M10.4998 1.66699C15.1022 1.66699 18.8332 5.39793 18.8332 10.0003C18.8332 14.6027 15.1022 18.3337 10.4998 18.3337C5.89748 18.3337 2.1665 14.6027 2.1665 10.0003C2.1665 5.39793 5.89748 1.66699 10.4998 1.66699ZM10.4998 12.7087C9.92447 12.7087 9.45811 13.175 9.45811 13.7503C9.45811 14.3256 9.92451 14.792 10.4998 14.792C11.0751 14.792 11.5415 14.3256 11.5415 13.7503C11.5415 13.175 11.0751 12.7087 10.4998 12.7087M10.3607 5.31289C9.54959 5.31289 8.86783 5.53387 8.31627 5.97461C7.66268 6.50258 7.33615 7.28227 7.33615 8.31437H9.1081V8.3025C9.1081 7.90871 9.19104 7.5857 9.35654 7.33375C9.58486 6.99508 9.95525 6.82555 10.4673 6.82555C10.7824 6.82555 11.0506 6.90828 11.2708 7.07344C11.5463 7.30227 11.6846 7.64863 11.6846 8.11344C11.6846 8.40496 11.6133 8.66477 11.4717 8.89336C11.3535 9.09812 11.1645 9.29883 10.9042 9.4959C10.3529 9.87399 9.99436 10.2482 9.8292 10.6187C9.68736 10.9259 9.61611 11.4143 9.61611 12.0837H11.2827C11.2827 11.6424 11.3413 11.3118 11.4601 11.0911C11.5544 10.9099 11.7516 10.7171 12.051 10.5121C12.5711 10.126 12.941 9.76742 13.1617 9.43656C13.4294 9.04281 13.5636 8.58184 13.5636 8.05387C13.5636 6.95973 13.1186 6.18363 12.2279 5.72652C11.6925 5.45086 11.0701 5.31281 10.3608 5.31281" fill="black"/>
        </svg>
      </span>
      <span className="text-sm">Question Block</span>
    </button>
  );
};

interface DropZoneProps {
  onDrop: () => void;
  children: React.ReactNode;
}
const QuestionBlockDropZone = ({ onDrop, children }: DropZoneProps) => {
  const [, drop] = useDrop(() => ({
    accept: "QUESTION_BLOCK",
    drop: () => onDrop(),
  }));
  return (
    <div ref={drop as unknown as React.Ref<HTMLDivElement>} className="space-y-4 min-h-[200px]">
      {children}
    </div>
  );
};

const VariableChip = ({ variable }: { variable: string }) => {
  const [, drag] = useDrag(() => ({
    type: "VARIABLE",
    item: { variable },
  }));
  return (
    <div
      ref={drag as unknown as React.Ref<HTMLDivElement>}
      className="bg-gray-50 border rounded px-3 py-2 text-sm font-mono cursor-pointer inline-block"
      style={{ display: "inline-block" }}
    >
      {variable}
    </div>
  );
};

const DropTextarea = ({
  value,
  onChange,
  placeholder,
  rows,
  className,
}: {
  value: string;
  onChange: (v: string | ((prev: string) => string)) => void;
  placeholder: string;
  rows: number;
  className?: string;
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const [, drop] = useDrop(() => ({
    accept: "VARIABLE",
    drop: (item: { variable: string }) => {
      const textarea = textareaRef.current;
      if (!textarea) return;
      onChange((prev: string) => {
        const newValue = prev + item.variable;
        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = textarea.selectionEnd = newValue.length;
        }, 0);
        return newValue;
      });
    },
  }));

  return (
    <textarea
      ref={node => {
        textareaRef.current = node;
        drop(node as unknown as HTMLTextAreaElement);
      }}
      className={`w-full border border-black rounded-md px-3 py-2 text-lg mb-2 bg-white text-black ${className || ''}`}
      value={value}
      onChange={e => {
        onChange(e.target.value);
      }}
      placeholder={placeholder}
      rows={rows}
    />
  );
};

// Appointment Reminder agentId from active protocols/new-protocol-modal
const APPOINTMENT_REMINDER_AGENT_ID = "agent_d17ee681fe233635ed77b0989c";

export default function NewAgentPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [assigned, setAssigned] = useState<{ [id: string]: boolean }>({});
  const [activeTab, setActiveTab] = useState("General Info");
  const [search, setSearch] = useState("");
  const [questionBlocks, setQuestionBlocks] = useState<QuestionBlock[]>([]);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
  const [agentId, setAgentId] = useState<string>("");
  const router = useRouter();
  const { addProtocol } = useProtocolStore();

  const filteredProtocols = protocols.filter((protocol) =>
    protocol.name.toLowerCase().includes(search.toLowerCase())
  );

  const patients = usePatientStore((state) => state.patients);

  const handleToggleBlock = (idx: number) => {
    setQuestionBlocks(blocks =>
      blocks.map((block, i) =>
        i === idx ? { ...block, expanded: !block.expanded } : block
      )
    );
  };

  const handleDeleteBlock = (idx: number) => {
    setQuestionBlocks(blocks => blocks.filter((_, i) => i !== idx));
  };

  const handleQuestionChange = (idx: number, valueOrUpdater: string | ((prev: string) => string)) => {
    setQuestionBlocks(blocks =>
      blocks.map((block, i) =>
        i === idx
          ? {
              ...block,
              question: typeof valueOrUpdater === "function"
                ? valueOrUpdater(block.question)
                : valueOrUpdater,
            }
          : block
      )
    );
  };

  const handleResponseChange = (idx: number, valueOrUpdater: string | ((prev: string) => string)) => {
    setQuestionBlocks(blocks =>
      blocks.map((block, i) =>
        i === idx
          ? {
              ...block,
              response: typeof valueOrUpdater === "function"
                ? valueOrUpdater(block.response)
                : valueOrUpdater,
            }
          : block
      )
    );
  };

  useEffect(() => {
    if (
      agentId === "agent_ca57f8759377a25df1203cf17a" &&
      questionBlocks.length === 2 &&
      questionBlocks[0].question === appointmentReminderTemplate[0].question
    ) {
      setAgentId("agent_777c087bdb2a794a7c3c9cb8f4");
    }
  }, [questionBlocks, agentId]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex h-screen bg-[#EFF1F2]">
        <Sidebar />
        <div className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow-sm p-8 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl ">Create New Agent</h3>
              <div className="flex gap-2">
                <button
                  className="px-4 py-2 border rounded-md text-sm"
                  onClick={() => router.push("/active-protocols")}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-white text-[#1F796E] border border-black rounded-md text-sm"
                  onClick={async () => {
                    // Get selected patients
                    const selectedPatientIds = Object.keys(assigned).filter(id => assigned[id]);
                    const selectedPatients = patients.filter(p => selectedPatientIds.includes(p.id));
                    if (!agentId) {
                      toast.error("Please select a template to set the agent type.");
                      return;
                    }
                    // Call each selected patient
                    for (const patient of selectedPatients) {
                      try {
                        const response = await fetch("/api/make-call", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            toNumber: patient.phoneNumber,
                            patientName: patient.name,
                            agentId: agentId,
                          }),
                        });
                        if (response.ok) {
                          toast.success(`Call initiated to ${patient.name} at ${patient.phoneNumber}`);
                        } else {
                          toast.error(`Failed to call ${patient.name}`);
                        }
                      } catch (err) {
                        toast.error(`Error calling ${patient.name}`);
                      }
                    }
                    // Add protocol/agent to the store
                    addProtocol({
                      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
                      name: name || "New Agent",
                      status: "Active",
                      patientsEnrolled: selectedPatients.length,
                      callsCompleted: `0/${selectedPatients.length}`,
                      successRate: "0%",
                      agentId: agentId,
                      patientIds: selectedPatientIds,
                    });
                    router.push("/active-protocols");
                  }}
                >
                  Save Agent
                </button>
              </div>
            </div>
            <div className="mb-6">
              <div className="flex border border-[#264653] rounded-lg overflow-hidden">
                {['General Info', 'Call Script', 'Voice Settings'].map(tab => (
                  <button
                    key={tab}
                    className={`flex-1 px-8 py-2 text-sm transition-colors
                      ${activeTab === tab
                        ? 'bg-[#264653] text-white'
                        : 'bg-white text-black'}
                    `}
                    style={{ borderRadius: 0 }}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            {activeTab === "General Info" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <div className="font-medium mb-2">Basic Information</div>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm mb-4 bg-white"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Voice Agent Name"
                    />
                    <textarea
                      className="w-full border rounded-md px-3 py-2 text-sm bg-white"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Enter a short description..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <div className="font-medium mb-2">Scheduling</div>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm mb-4 bg-white"
                      placeholder="Choose a start and end date..."
                    />
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white mb-4">
                      <option>Choose call frequency...</option>
                      <option>Once</option>
                      <option>Daily</option>
                      <option>Weekly</option>
                      <option>Monthly</option>
                    </select>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white">
                      <option>Define when the calls should take place...</option>
                      <option>Morning</option>
                      <option>Afternoon</option>
                      <option>Evening</option>
                      <option>Custom</option>
                    </select>
                  </div>
                </div>
                <div className="mb-4 font-medium">Patient Assignment</div>
                <div className="mb-4 flex items-center gap-2">
                  <div className="relative w-full max-w-xs">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                    <input
                      type="text"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      placeholder="Search your patients..."
                      className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white w-full"
                    />
                  </div>
                  <button className="p-2 border rounded-md bg-white">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h7" /></svg>
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="py-3 px-4 font-medium text-center">Patient Name</th>
                        <th className="py-3 px-4 font-medium text-center">Status</th>
                        <th className="py-3 px-4 font-medium text-center">DOB</th>
                        <th className="py-3 px-4 font-medium text-center">Patient ID #</th>
                        <th className="py-3 px-4 font-medium text-center">Success Rate</th>
                        <th className="py-3 px-4 font-medium text-center">Assigned?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.id} className="border-b">
                          <td className="py-3 px-4 text-center">{patient.name}</td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className="px-3 py-1 rounded-md text-xs"
                              style={{ backgroundColor: '#F1FFFA', border: '1px solid #1F796E' }}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">{patient.dob}</td>
                          <td className="py-3 px-4 text-center">{patient.id}</td>
                          <td className="py-3 px-4 text-center">{patient.successRate}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="relative flex items-center justify-center">
                              <input
                                type="checkbox"
                                checked={!!assigned[patient.id]}
                                onChange={() => setAssigned(a => ({ ...a, [patient.id]: !a[patient.id] }))}
                                className={`h-5 w-5 rounded appearance-none cursor-pointer transition-colors duration-150 border-2 border-black
                                  ${assigned[patient.id] ? 'bg-[#1F796E]' : 'bg-white'}`}
                              />
                              {assigned[patient.id] && (
                                <svg className="absolute left-1 top-1 w-3 h-3 text-white pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                  <path d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {activeTab === "Call Script" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left column: Question Blocks with drop zone */}
                <QuestionBlockDropZone
                  onDrop={() =>
                    setQuestionBlocks((blocks) => [
                      ...blocks,
                      {
                        question: "",
                        response: "",
                        placeholder: "Enter a question for the voice agent to ask...",
                        responsePlaceholder: "Let the voice agent know how you want it to respond....",
                        expanded: true,
                      },
                    ])
                  }
                >
                  {questionBlocks.length === 0 ? (
                    <div className="border-2 border-dashed rounded-lg p-8 text-gray-400 text-center">
                      New Elements Added Here
                    </div>
                  ) : (
                    questionBlocks.map((block, idx) => (
                      <div key={idx} className={`bg-white border border-black rounded-lg p-4 relative mb-4 ${block.expanded ? "" : "cursor-pointer"}`}>
                        <div className="flex items-center mb-2">
                          <span className="mr-2 text-lg text-red-500">
                            <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M10.4998 1.66699C15.1022 1.66699 18.8332 5.39793 18.8332 10.0003C18.8332 14.6027 15.1022 18.3337 10.4998 18.3337C5.89748 18.3337 2.1665 14.6027 2.1665 10.0003C2.1665 5.39793 5.89748 1.66699 10.4998 1.66699ZM10.4998 12.7087C9.92447 12.7087 9.45811 13.175 9.45811 13.7503C9.45811 14.3256 9.92451 14.792 10.4998 14.792C11.0751 14.792 11.5415 14.3256 11.5415 13.7503C11.5415 13.175 11.0751 12.7087 10.4998 12.7087M10.3607 5.31289C9.54959 5.31289 8.86783 5.53387 8.31627 5.97461C7.66268 6.50258 7.33615 7.28227 7.33615 8.31437H9.1081V8.3025C9.1081 7.90871 9.19104 7.5857 9.35654 7.33375C9.58486 6.99508 9.95525 6.82555 10.4673 6.82555C10.7824 6.82555 11.0506 6.90828 11.2708 7.07344C11.5463 7.30227 11.6846 7.64863 11.6846 8.11344C11.6846 8.40496 11.6133 8.66477 11.4717 8.89336C11.3535 9.09812 11.1645 9.29883 10.9042 9.4959C10.3529 9.87399 9.99436 10.2482 9.8292 10.6187C9.68736 10.9259 9.61611 11.4143 9.61611 12.0837H11.2827C11.2827 11.6424 11.3413 11.3118 11.4601 11.0911C11.5544 10.9099 11.7516 10.7171 12.051 10.5121C12.5711 10.126 12.941 9.76742 13.1617 9.43656C13.4294 9.04281 13.5636 8.58184 13.5636 8.05387C13.5636 6.95973 13.1186 6.18363 12.2279 5.72652C11.6925 5.45086 11.0701 5.31281 10.3608 5.31281" fill="black"/>
                            </svg>
                          </span>
                          <span className="font-medium">Question Block</span>
                          <button
                            className="ml-auto text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteBlock(idx)}
                            type="button"
                          >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path fillRule="evenodd" clipRule="evenodd" d="M2.09758 3.00242C2.20669 2.99328 2.31654 3.00574 2.42084 3.03909C2.52514 3.07243 2.62184 3.126 2.70543 3.19673C2.78901 3.26747 2.85783 3.35399 2.90796 3.45134C2.95809 3.54868 2.98854 3.65496 2.99758 3.76408L3.70508 12.3041C3.73958 12.7209 3.9295 13.1094 4.23716 13.3927C4.54481 13.676 4.94771 13.8332 5.36591 13.8332H10.6342C11.0524 13.8332 11.4553 13.676 11.763 13.3927C12.0707 13.1094 12.2606 12.7209 12.2951 12.3041L13.0034 3.76408C13.0238 3.54545 13.1297 3.34371 13.298 3.2027C13.4663 3.06169 13.6835 2.99282 13.9023 3.01104C14.1211 3.02927 14.3239 3.13312 14.4666 3.30004C14.6093 3.46695 14.6803 3.68342 14.6642 3.90242L13.9559 12.4416C13.8869 13.275 13.5072 14.052 12.8921 14.6185C12.2769 15.185 11.4713 15.4996 10.6351 15.4999H5.36675C4.5302 15.5 3.72419 15.1856 3.10871 14.6191C2.49322 14.0525 2.11326 13.2753 2.04425 12.4416L1.33591 3.90242C1.32678 3.7933 1.33924 3.68345 1.37258 3.57915C1.40592 3.47486 1.45949 3.37815 1.53023 3.29457C1.60097 3.21099 1.68748 3.14216 1.78483 3.09203C1.88218 3.0419 1.98845 3.01145 2.09758 3.00242Z" fill="#B61515"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M0.5 3.83333C0.5 3.61232 0.587797 3.40036 0.744078 3.24408C0.900358 3.0878 1.11232 3 1.33333 3H14.6667C14.8877 3 15.0996 3.0878 15.2559 3.24408C15.4122 3.40036 15.5 3.61232 15.5 3.83333C15.5 4.05435 15.4122 4.26631 15.2559 4.42259C15.0996 4.57887 14.8877 4.66667 14.6667 4.66667H1.33333C1.11232 4.66667 0.900358 4.57887 0.744078 4.42259C0.587797 4.26631 0.5 4.05435 0.5 3.83333ZM6.33333 5.5C6.55435 5.5 6.76631 5.5878 6.92259 5.74408C7.07887 5.90036 7.16667 6.11232 7.16667 6.33333V11.3333C7.16667 11.5543 7.07887 11.7663 6.92259 11.9226C6.76631 12.0789 6.55435 12.1667 6.33333 12.1667C6.11232 12.1667 5.90036 12.0789 5.74408 11.9226C5.5878 11.7663 5.5 11.5543 5.5 11.3333V6.33333C5.5 6.11232 5.5878 5.90036 5.74408 5.74408C5.90036 5.5878 6.11232 5.5 6.33333 5.5ZM9.66667 5.5C9.88768 5.5 10.0996 5.5878 10.2559 5.74408C10.4122 5.90036 10.5 6.11232 10.5 6.33333V9.66667C10.5 9.88768 10.4122 10.0996 10.2559 10.2559C10.0996 10.4122 9.88768 10.5 9.66667 10.5C9.44565 10.5 9.23369 10.4122 9.07741 10.2559C8.92113 10.0996 8.83333 9.88768 8.83333 9.66667V6.33333C8.83333 6.11232 8.92113 5.90036 9.07741 5.74408C9.23369 5.5878 9.44565 5.5 9.66667 5.5Z" fill="#B61515"/>
                              <path fillRule="evenodd" clipRule="evenodd" d="M6.7007 2.16667C6.52587 2.1668 6.35551 2.22191 6.21374 2.32421C6.07196 2.4265 5.96594 2.5708 5.9107 2.73667L5.45737 4.09667C5.38753 4.30641 5.23723 4.47982 5.03953 4.57874C4.84184 4.67767 4.61294 4.69401 4.4032 4.62417C4.19346 4.55433 4.02005 4.40403 3.92112 4.20633C3.8222 4.00864 3.80586 3.77974 3.8757 3.57L4.32903 2.20917C4.495 1.71144 4.81336 1.27855 5.23901 0.9718C5.66466 0.665049 6.17603 0.49999 6.7007 0.5H9.2982C9.82287 0.49999 10.3342 0.665049 10.7599 0.9718C11.1855 1.27855 11.5039 1.71144 11.6699 2.20917L12.124 3.57C12.1586 3.67385 12.1724 3.7835 12.1646 3.89268C12.1568 4.00187 12.1276 4.10844 12.0786 4.20633C12.0296 4.30422 11.9618 4.3915 11.8791 4.46319C11.7964 4.53489 11.7004 4.58958 11.5965 4.62417C11.4927 4.65875 11.383 4.67254 11.2738 4.66474C11.1647 4.65695 11.0581 4.62772 10.9602 4.57874C10.7625 4.47982 10.6122 4.30641 10.5424 4.09667L10.089 2.73667C10.0338 2.57093 9.92794 2.42673 9.78633 2.32445C9.64472 2.22217 9.47455 2.16697 9.29987 2.16667H6.70237H6.7007Z" fill="#B61515"/>
                            </svg>
                          </button>
                          <button
                            className="ml-2 text-black hover:text-gray-700"
                            onClick={() => handleToggleBlock(idx)}
                            type="button"
                          >
                            {block.expanded ? (
                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M6 9l6 6 6-6" />
                              </svg>
                            ) : (
                              <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 6l6 6-6 6" />
                              </svg>
                            )}
                          </button>
                        </div>
                        {block.expanded && (
                          <>
                            <DropTextarea
                              value={block.question}
                              onChange={v => handleQuestionChange(idx, v)}
                              placeholder={block.placeholder}
                              rows={2}
                              className="text-sm"
                            />
                            <div className="bg-[#f7f8fa] border border-black rounded-md p-3 mt-2">
                              <div className="text-sm font-normal mb-1 text-black">Response Handling</div>
                              <DropTextarea
                                value={block.response}
                                onChange={v => handleResponseChange(idx, v)}
                                placeholder={block.responsePlaceholder}
                                rows={3}
                                className="text-sm"
                              />
                            </div>
                          </>
                        )}
                      </div>
                    ))
                  )}
                </QuestionBlockDropZone>
                {/* Right column: Actions and Variables */}
                <div className="space-y-6">
                  <div className="bg-white border rounded-lg p-4 mb-4">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="relative w-full max-w-[285px]">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        <input
                          type="text"
                          placeholder="Search for elements..."
                          className="pl-9 pr-4 py-2 border rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary text-gray-600 bg-white w-full"
                        />
                      </div>
                      <div className="relative">
                        <button
                          className="px-3 py-2 border rounded-md text-sm bg-gray-100"
                          onClick={() => setShowTemplateDropdown((v) => !v)}
                          type="button"
                        >
                          Import Template
                        </button>
                        {showTemplateDropdown && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow z-10">
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setQuestionBlocks(appointmentReminderTemplate);
                                setAgentId("agent_ca57f8759377a25df1203cf17a");
                                setShowTemplateDropdown(false);
                              }}
                            >
                              Appointment Reminder
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setQuestionBlocks(postVisitCareTemplate);
                                setAgentId("agent_a2e0d17efe33e761555a304da0");
                                setShowTemplateDropdown(false);
                              }}
                            >
                              Post Visit Care
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setQuestionBlocks(billingFollowupTemplate);
                                setAgentId("agent_2a623efda3f2d32653517d2724");
                                setShowTemplateDropdown(false);
                              }}
                            >
                              Billing Followup
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setQuestionBlocks(preProcedureColonoscopyTemplate);
                                setAgentId("agent_4ad3954ff0715c92289274f66e");
                                setShowTemplateDropdown(false);
                              }}
                            >
                              Pre-Procedure (Colonoscopy)
                            </button>
                            <button
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => {
                                setQuestionBlocks(testTemplate);
                                setAgentId("agent_64913079bea9be785f696a6399");
                                setShowTemplateDropdown(false);
                              }}
                            >
                              Test
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                        <span className="mb-2">
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3124 14.6405C12.9921 13.9804 12.578 13.4999 11.8632 13.7929L10.453 14.3163C9.32411 14.8397 8.76161 14.3163 8.1952 13.5272L5.65614 7.7538C5.33973 7.09364 5.50379 6.47255 6.21864 6.17958L8.19129 5.39052C8.90614 5.09364 8.79286 4.47646 8.47254 3.8163L6.78895 0.667863C6.46864 0.00770688 5.81239 -0.152449 5.09754 0.140519C3.66395 0.730363 2.48036 1.65614 1.71473 3.02724C0.777232 4.70302 1.24598 7.03505 1.43348 8.01552C1.62098 8.99599 2.27723 10.7147 3.12489 12.4765C3.97254 14.2421 4.71864 15.6288 5.3827 16.414C6.04676 17.1991 7.64051 19.3475 9.61317 19.828C11.2304 20.2186 12.9765 19.8905 14.4061 19.3007C15.121 19.0077 15.1249 18.3866 14.8046 17.7226L13.3124 14.6405ZM19.6171 5.3788L18.078 3.83974L15.7694 6.14833L13.4608 3.83974L11.9218 5.3788L14.2304 7.68739L11.9218 9.99989L13.4608 11.539L15.7694 9.23036L18.078 11.539L19.6171 9.99989L17.3085 7.6913L19.6171 5.3788Z" fill="black"/>
                          </svg>
                        </span>
                        <span className="text-sm">End Call</span>
                      </button>
                      <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                        <span className="mb-2">
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_366_1202)">
                              <path d="M12.6603 14.6366C12.34 13.9765 11.9259 13.496 11.2111 13.789L9.80091 14.3124C8.67201 14.8358 8.10951 14.3124 7.54701 13.5272L5.01185 7.7538C4.69544 7.09364 4.85951 6.47255 5.57435 6.17958L7.54701 5.39443C8.26185 5.10146 8.14857 4.48036 7.82826 3.82021L6.13685 0.671769C5.81654 0.0116131 5.16029 -0.148543 4.44544 0.144426C3.01576 0.738176 1.83216 1.66005 1.06654 3.03114C0.129039 4.70693 0.597789 7.03505 0.785289 8.01552C0.972789 8.99599 1.62904 10.7108 2.47669 12.4765C3.32435 14.2421 4.06654 15.6288 4.7306 16.414C5.39466 17.1991 6.98451 19.3476 8.95716 19.8241C10.5744 20.2147 12.3165 19.8866 13.7462 19.2968C14.4611 19.0038 14.465 18.3827 14.1447 17.7186L12.6603 14.6366ZM16.6525 4.61318H14.3439L17.422 7.6913H10.5001V9.23036H17.422L14.3478 12.3046H16.6564L20.504 8.45693L16.6525 4.61318Z" fill="black"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_366_1202">
                                <rect width="20" height="20" fill="white" transform="translate(0.5)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                        <span className="text-sm">Transfer Call</span>
                      </button>
                      <button className="flex flex-col items-center justify-center border rounded-lg p-4 bg-white hover:bg-gray-50">
                        <span className="mb-2">
                          <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_366_1206)">
                              <path d="M17.5559 6.41184L17.7609 5.94017C18.1213 5.10577 18.7814 4.43677 19.6109 4.06517L20.2434 3.78267C20.3201 3.74737 20.3851 3.69081 20.4307 3.61969C20.4763 3.54857 20.5005 3.46588 20.5005 3.38142C20.5005 3.29695 20.4763 3.21426 20.4307 3.14314C20.3851 3.07203 20.3201 3.01547 20.2434 2.98017L19.6459 2.71434C18.7956 2.33215 18.1242 1.6384 17.7701 0.776002L17.5584 0.266835C17.5274 0.187963 17.4734 0.12025 17.4034 0.0725227C17.3334 0.0247952 17.2506 -0.000732422 17.1659 -0.000732422C17.0812 -0.000732422 16.9984 0.0247952 16.9284 0.0725227C16.8584 0.12025 16.8044 0.187963 16.7734 0.266835L16.5626 0.775169C16.2088 1.63773 15.5377 2.33178 14.6876 2.71434L14.0892 2.981C14.0127 3.0164 13.948 3.07295 13.9026 3.14398C13.8572 3.21501 13.833 3.29754 13.833 3.38184C13.833 3.46613 13.8572 3.54866 13.9026 3.61969C13.948 3.69072 14.0127 3.74727 14.0892 3.78267L14.7226 4.06434C15.5519 4.43631 16.2117 5.10561 16.5717 5.94017L16.7767 6.41184C16.9267 6.75683 17.4051 6.75683 17.5559 6.41184ZM12.4884 4.44934C12.7167 4.81045 13.029 5.07739 13.4251 5.25017L13.8959 5.456C14.2126 5.59378 14.4692 5.78767 14.6659 6.03767V8.3335C14.6659 9.43857 14.2269 10.4984 13.4455 11.2798C12.6641 12.0612 11.6043 12.5002 10.4992 12.5002C9.39416 12.5002 8.33435 12.0612 7.55295 11.2798C6.77155 10.4984 6.33257 9.43857 6.33257 8.3335V5.00017C6.33256 4.22672 6.54785 3.46854 6.95431 2.81051C7.36076 2.15247 7.94236 1.62056 8.63398 1.27432C9.3256 0.928077 10.0999 0.781174 10.8703 0.850056C11.6407 0.918938 12.3767 1.20089 12.9959 1.66434C12.7959 1.81434 12.6265 1.99878 12.4876 2.21767C12.2753 2.55092 12.1639 2.93841 12.1667 3.3335C12.1667 3.73684 12.2742 4.10878 12.4892 4.44934M3.0459 9.16684H4.72507C4.92698 10.5542 5.62162 11.8224 6.68193 12.7396C7.74223 13.6567 9.0973 14.1615 10.4992 14.1615C11.9012 14.1615 13.2562 13.6567 14.3165 12.7396C15.3768 11.8224 16.0715 10.5542 16.2734 9.16684H17.9534C17.7639 10.8574 17.0056 12.4335 15.8027 13.6364C14.5999 14.8394 13.024 15.598 11.3334 15.7877V19.1668H9.66673V15.7877C7.97601 15.5982 6.39988 14.8397 5.19688 13.6367C3.99387 12.4337 3.23541 10.8576 3.0459 9.16684Z" fill="black"/>
                            </g>
                            <defs>
                              <clipPath id="clip0_366_1206">
                                <rect width="20" height="20" fill="white" transform="translate(0.5)"/>
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                        <span className="text-sm">AI Prompt</span>
                      </button>
                      <QuestionBlockDraggable />
                    </div>
                  </div>
                  <div className="bg-white border rounded-lg p-4">
                    <div className="font-medium mb-2">Available Variables</div>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto pr-2">
                      {["{{clinic_name}}", "{{patient_name}}", "{{provider_name}}", "{{appointment_date}}", "{{clinic_location}}", "{{appointment_type}}"].map((v) => (
                        <VariableChip key={v} variable={v} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "Voice Settings" && (
              <div className="py-12 text-gray-400 text-center">Voice Settings configuration coming soon...</div>
            )}
          </div>
        </div>
      </div>
    </DndProvider>
  );
} 