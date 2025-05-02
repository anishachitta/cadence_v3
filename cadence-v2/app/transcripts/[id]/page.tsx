// app/transcripts/[id]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { useTranscriptStore } from "@/stores/useTranscriptStore";

export default function TranscriptDetailPage() {
  const { id } = useParams();
  const transcript = useTranscriptStore((state) =>
    state.transcripts.find((t) => t.id === id)
  );

  const [content, setContent] = useState<string | null>(null);
  const [highlighted, setHighlighted] = useState<string | null>(null);
  const [redInsights, setRedInsights] = useState<string[]>([]);
  const [yellowInsights, setYellowInsights] = useState<string[]>([]);

  useEffect(() => {
    const fetchTranscript = async () => {
      if (!transcript) return;

      try {
        // Get the raw transcript
        const res = await fetch("/api/get-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ callId: transcript.callId }),
        });

        const data = await res.json();
        if (!data.success || !data.transcript) {
          setContent("Transcript not available yet.");
          return;
        }

        const transcriptText = data.transcript;
        setContent(transcriptText);

        // Analyze the transcript
        const analysisRes = await fetch("/api/analyze-transcript", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript: transcriptText }),
        });

        const analysisData = await analysisRes.json();
        const rawInsights = analysisData.analysis;
        const insightBlocks = rawInsights.split("---").filter(Boolean);

        // Prepare red/yellow insight lists
        const reds: string[] = [];
        const yellows: string[] = [];

        // Start with original transcript
        let marked = transcriptText;

        for (const block of insightBlocks) {
          const isRed = block.includes("🟥") || block.includes("Red Flag");
          const colorClass = isRed ? "bg-red-200" : "bg-yellow-200";

          const quoteMatch = block.match(/• Quote:\s*(?:"([^"]+)"|(.+))/);
          const quote = quoteMatch?.[1] ?? quoteMatch?.[2];
          if (!quote) {
            console.warn("⚠️ Quote not found in block:", block);
            continue;
          }
          const escaped = quote.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const quoteRegex = new RegExp(escaped, "g");

          marked = marked.replace(
            quoteRegex,
            `<mark class="${colorClass}">${quote}</mark>`
          );

          // Store full block
          const formatted = block.trim();
          if (isRed) reds.push(formatted);
          else yellows.push(formatted);
        }

        setHighlighted(marked);
        setRedInsights(reds);
        setYellowInsights(yellows);
      } catch (err) {
        console.error("Error loading transcript or analysis:", err);
        setContent("Failed to load transcript.");
      }
    };

    fetchTranscript();
  }, [transcript]);

  if (!transcript) {
    return <div className="p-10">Transcript not found.</div>;
  }

  return (
    <div className="flex h-screen bg-[#EFF1F2]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-xl font-semibold mb-4">
            Transcript for {transcript.patientName}
          </h1>
          <p className="text-gray-600 text-sm mb-4">{transcript.date}</p>

          {/* Scrollable transcript box */}
          <div className="whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded-md border border-gray-200 text-sm max-h-[400px] overflow-y-auto">
            {highlighted ? (
              <div dangerouslySetInnerHTML={{ __html: highlighted }} />
            ) : (
              content ?? "Loading transcript..."
            )}
          </div>

          {/* Insights Grid */}
          <div className="mt-6">
            <h2 className="text-md font-medium mb-4">Insights</h2>

            {redInsights.length === 0 && yellowInsights.length === 0 ? (
              <div className="bg-green-100 border border-green-300 text-green-900 p-4 rounded-md text-sm whitespace-pre-wrap">
                ✅ No clinical concerns or deviations detected.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Red Flags */}
                <div className="space-y-4">
                  {redInsights.map((insight, index) => (
                    <div
                      key={`red-${index}`}
                      className="bg-red-100 border border-red-300 text-red-900 p-4 rounded-md text-sm whitespace-pre-wrap"
                    >
                      {insight}
                    </div>
                  ))}
                </div>

                {/* Yellow Flags */}
                <div className="space-y-4">
                  {yellowInsights.map((insight, index) => (
                    <div
                      key={`yellow-${index}`}
                      className="bg-yellow-100 border border-yellow-300 text-yellow-900 p-4 rounded-md text-sm whitespace-pre-wrap"
                    >
                      {insight}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
