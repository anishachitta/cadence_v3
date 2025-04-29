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
    const rawText = await response.text(); // <- first read raw text

    console.log("Raw response from Retell:", rawText);

    let data;
    try {
      data = JSON.parse(rawText); // try parsing the text
    } catch (e) {
      console.error("❌ Failed to parse JSON, got HTML or bad response:", e);
      return NextResponse.json(
        { success: false, error: `Invalid response from Retell (HTTP ${statusCode})` },
        { status: 500 }
      );
    }

    console.log("✅ Parsed Retell JSON:", data);

    if (data.call_status !== "completed") {
      return NextResponse.json({
        success: false,
        error: "Call not completed yet"
      });
    }

    if (!response.ok || !data.transcript) {
      throw new Error(data.message || "Transcript not available");
    }

    return NextResponse.json({
      success: true,
      transcript: data.transcript
    });

  } catch (error) {
    console.error("Error getting transcript:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
