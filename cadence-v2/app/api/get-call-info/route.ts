import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { callId } = await request.json();
    const apiKey = process.env.RETELL_API_KEY;

    const response = await fetch(`https://api.retellai.com/v2/get-call/${callId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    const durationMs = data.end_timestamp - data.start_timestamp;
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    const readable_duration = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const formattedDate = new Date(data.end_timestamp).toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    return NextResponse.json({
      call_status: data.call_status,
      disconnection_reason: data.disconnection_reason,
      readable_duration,
      timestamp: formattedDate,
    });

  } catch (error) {
    console.error("Failed to fetch call info:", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
