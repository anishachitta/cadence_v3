
import { toast } from "sonner";
import { RetellConfig, PhoneCallRequest } from "@/types";

export const makePhoneCall = async (toNumber: string): Promise<boolean> => {
  const apiKey = process.env.RETELL_API_KEY;
  const fromNumber = process.env.RETELL_CALLER_NUMBER;
  const agentId = process.env.RETELL_AGENT_ID;

  if (!apiKey || !fromNumber || !agentId) {
    console.error("Missing Retell API env variables");
    return false;
  }

  const requestData = {
    from_number: fromNumber,
    to_number: toNumber,
    override_agent_id: agentId,
  };

  const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Call failed");
  }

  return true;
};