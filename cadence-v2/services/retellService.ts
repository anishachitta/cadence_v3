import { toast } from "sonner";
import { RetellConfig, PhoneCallRequest } from "@/types";

export const makePhoneCall = async (
  phoneNumber: string,
  patientName: string,
  agentId: string
): Promise<{ success: boolean; callId?: string }> => {  // Update return type
  console.log('makePhoneCall service - raw agentId:', agentId);
  console.log('makePhoneCall service - typeof agentId:', typeof agentId);
  
  const payload = {
    toNumber: phoneNumber,
    patientName: patientName,
    agentId: agentId
  };
  console.log('makePhoneCall service - payload:', payload);

  try {
    const response = await fetch('/api/make-call', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('makePhoneCall service - response:', data);

    if (!response.ok) {
      throw new Error(data.error || 'Call failed');
    }

    // Update return value to include callId
    return {
      success: data.success,
      callId: data.callId
    };
  } catch (error) {
    console.error('Error in makePhoneCall:', error);
    return { success: false };
  }
};