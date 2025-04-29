import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { toNumber, patientName, agentId } = await request.json();
    console.log('make-call API - patient name:', patientName); // Debug log
    console.log('make-call API - agentId:', agentId); // Debug log
    
    const apiKey = process.env.RETELL_API_KEY;
    const fromNumber = process.env.RETELL_CALLER_NUMBER;

    if (!apiKey || !fromNumber) {
      console.error("Missing Retell API env variables");
      return NextResponse.json({ success: false, error: "API configuration error" }, { status: 500 });
    }

    const response = await fetch("https://api.retellai.com/v2/create-phone-call", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from_number: fromNumber,
        to_number: toNumber,
        override_agent_id: agentId,
        retell_llm_dynamic_variables: {
          patient_name: patientName
        },
        metadata: {
          patientName
        }
      }),
    });

    const data = await response.json();
    console.log('make-call API - response data:', data); // Add debug log

    if (!response.ok) {
      throw new Error(data.message || "Call failed");
    }

    return NextResponse.json({ 
      success: true,
      callId: data.call_id 
    });

  } catch (error) {
    console.error("Error making call:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
} 