// app/api/analyze-transcript/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { transcript } = await req.json();

    const prompt = `
You are a clinical assistant reviewing a transcript between a healthcare agent and a patient. Identify and output a list of potential healthcare flags based on the transcript.

For each concern you find, return a bullet point with:
- Flag level: Red Flag (high risk) or Yellow Flag (moderate risk)
- Short reason: why it’s flagged
- The exact quote: the statement from the transcript
- (Optional) a brief suggestion for follow-up

Only list each concern once — even if multiple issues are raised in one sentence, split them out.

Format the response as:
---
🟥 Red Flag  
• Reason:  
• Quote:  
• Suggestion:  

🟡 Yellow Flag  
• Reason:  
• Quote:  
• Suggestion:  

Transcript:
${transcript}
`;


    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const analysis = response.choices[0].message?.content ?? null;
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    return NextResponse.json({ error: "Failed to analyze transcript" }, { status: 500 });
  }
}
