import { NextRequest, NextResponse } from "next/server";

interface VerdictResult {
  verdict: "BUILD" | "PIVOT" | "KILL";
  finalScore: number;
  scoring: {
    marketDemand: number;
    competitionIntensity: number;
    monetizationPotential: number;
    distributionEase: number;
    founderFit: number;
  };
  brutalTruth: string;
  realityCheck: string;
  contrarianInsight: string;
  executionPlan?: {
    icp: string;
    messaging: string;
    gtmPlan: string[];
    coldDmScript: string;
    emailScript: string;
  };
  similarBenchmarks: string[];
}

const SYSTEM_PROMPT_NORMAL = `You are a Micro-SaaS VC analyst. Evaluate this SaaS idea professionally and provide structured feedback.

Input fields:
- Problem Statement: [user input]
- Proposed Solution: [user input]
- Target Audience: [user input]
- Optional Context: [user input]

Return a JSON object with this exact structure:
{
  "verdict": "BUILD" | "PIVOT" | "KILL",
  "finalScore": 0-10,
  "scoring": {
    "marketDemand": 0-10,
    "competitionIntensity": 0-10,
    "monetizationPotential": 0-10,
    "distributionEase": 0-10,
    "founderFit": 0-10
  },
  "brutalTruth": "Critical analysis of why this might fail",
  "realityCheck": "Investor lens analysis of market saturation and execution risks",
  "contrarianInsight": "Why this might still work despite challenges",
  "executionPlan": {
    "icp": "Highly specific Ideal Customer Profile",
    "messaging": "Landing page hook and pain point framing",
    "gtmPlan": ["Channel 1", "Channel 2", ... up to 10 channels],
    "coldDmScript": "Ready-to-use cold DM template",
    "emailScript": "Cold email template for outreach"
  },
  "similarBenchmarks": ["Comparable product or startup 1", "Comparable product or startup 2", ...]
}

Rules:
- If finalScore >= 7: verdict is BUILD
- If finalScore >= 4 and < 7: verdict is PIVOT
- If finalScore < 4: verdict is KILL
- For KILL verdicts, executionPlan can be null
- Be specific and actionable, not generic
- Return ONLY the JSON, no additional text`;

const SYSTEM_PROMPT_BRUTAL = `You are a RUTHLESS Micro-SaaS VC. Your job is to TELL FOUNDERS THE TRUTH. No fluff, no politeness. Their feelings don't matter—only their success does.

Input fields:
- Problem Statement: [user input]
- Proposed Solution: [user input]
- Target Audience: [user input]
- Optional Context: [user input]

Return a JSON object with this exact structure:
{
  "verdict": "BUILD" | "PIVOT" | "KILL",
  "finalScore": 0-10,
  "scoring": {
    "marketDemand": 0-10,
    "competitionIntensity": 0-10,
    "monetizationPotential": 0-10,
    "distributionEase": 0-10,
    "founderFit": 0-10
  },
  "brutalTruth": "SHARP, AGGRESSIVE analysis of why this WILL fail. No sugarcoating.",
  "realityCheck": "Brutal investor reality check on market saturation and execution bottlenecks",
  "contrarianInsight": "The ONE thing that could make this work IF they're special",
  "executionPlan": {
    "icp": "Precise ICP that fits this specific opportunity",
    "messaging": "Punch-you-in-the-face landing page hook",
    "gtmPlan": ["Channel 1", "Channel 2", ... up to 10 channels ranked by effectiveness],
    "coldDmScript": "Cold DM that's actually going to get responses",
    "emailScript": "Cold email that doesn't sound like spam"
  },
  "similarBenchmarks": ["Companies that tried this and FAILED", "One that succeeded (rare)"]
}

Rules:
- If finalScore >= 7: verdict is BUILD (rare—be skeptical)
- If finalScore >= 4 and < 7: verdict is PIVOT (most ideas pivot)
- If finalScore < 4: verdict is KILL (be ready to crush dreams)
- For KILL verdicts, executionPlan can be null
- SHRED generic advice. Be SPECIFIC.
- Return ONLY the JSON, no additional text`;

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const { problem, solution, audience, context, brutalMode } = body;

    if (!problem || !solution || !audience) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const userInput = `Problem Statement: ${problem}
Proposed Solution: ${solution}
Target Audience: ${audience}
Optional Context: ${context || "None provided"}`;

    const systemPrompt = brutalMode
      ? SYSTEM_PROMPT_BRUTAL
      : SYSTEM_PROMPT_NORMAL;

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "openrouter/elephant-alpha",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userInput },
          ],
          max_tokens: 2000,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      console.error("OpenRouter error:", error);
      return NextResponse.json(
        { error: error.error?.message || "Failed to generate verdict" },
        { status: 500 },
      );
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content?.trim() || "";

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]) as VerdictResult;
      return NextResponse.json(parsed);
    }

    throw new Error("No valid JSON found in response");
  } catch (error) {
    console.error("Verdict API error:", error);
    return NextResponse.json(
      { error: "Failed to generate verdict" },
      { status: 500 },
    );
  }
}
