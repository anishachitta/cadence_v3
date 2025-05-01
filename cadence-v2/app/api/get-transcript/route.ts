import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { callId } = await request.json();
    console.log("Fetching transcript for callId:", callId);

    const apiKey = process.env.RETELL_API_KEY;

    const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const statusCode = response.status;
    const rawText = await response.text();
    console.log("Raw response from Retell:", rawText);

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e);
      return NextResponse.json(
        { success: false, error: `Invalid JSON from Retell (HTTP ${statusCode})` },
        { status: 500 }
      );
    }

    console.log("✅ Parsed Retell JSON:", data);

    return NextResponse.json({
      success: !!data.transcript,
      transcript: data.transcript || null,
      call_status: data.call_status,
      disconnection_reason: data.disconnection_reason || null,
    });

  } catch (error) {
    console.error("Error getting transcript:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
