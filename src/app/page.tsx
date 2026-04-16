"use client";

import { useState, useEffect } from "react";

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

interface HistoryItem {
  id: string;
  idea: {
    problem: string;
    solution: string;
    audience: string;
    context?: string;
  };
  verdict: VerdictResult;
  timestamp: number;
}

const LOADING_MESSAGES = [
  "Neural networks firing up...",
  "Scanning 10,000+ startup patterns...",
  "Cross-referencing market signals...",
  "Calculating competitive moat index...",
  "Evaluating monetization vectors...",
  "Analyzing distribution channels...",
  "Running founder-market fit algorithm...",
  "Processing contrarian insights...",
  "Benchmarking against unicorn data...",
  "Synthesizing brutal truths...",
  "Generating execution blueprint...",
  "Finalizing your fate...",
];

export default function Home() {
  const [problem, setProblem] = useState("");
  const [solution, setSolution] = useState("");
  const [audience, setAudience] = useState("");
  const [context, setContext] = useState("");
  const [brutalMode, setBrutalMode] = useState(false);
  const [verdict, setVerdict] = useState<VerdictResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("buildorkill-history");
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("buildorkill-history", JSON.stringify(history));
  }, [history]);

  const runLoadingAnimation = () => {
    let index = 0;
    setLoadingMessage(LOADING_MESSAGES[0]);
    const interval = setInterval(() => {
      index = (index + 1) % LOADING_MESSAGES.length;
      setLoadingMessage(LOADING_MESSAGES[index]);
    }, 2000);
    return interval;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!problem.trim() || !solution.trim() || !audience.trim()) return;

    setIsLoading(true);
    setVerdict(null);
    const interval = runLoadingAnimation();

    try {
      const response = await fetch("/api/verdict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          problem,
          solution,
          audience,
          context,
          brutalMode,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to get verdict");
      }

      const result: VerdictResult = await response.json();
      setVerdict(result);

      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        idea: { problem, solution, audience, context },
        verdict: result,
        timestamp: Date.now(),
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error("Error getting verdict:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to get verdict. Please check your API key.",
      );
    } finally {
      clearInterval(interval);
      setIsLoading(false);
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  const copyExecutionPlan = () => {
    if (!verdict?.executionPlan) return;
    const plan = verdict.executionPlan;
    const text = `BUILD OR KILL - EXECUTION PLAN

ICP: ${plan.icp}

MESSAGING: ${plan.messaging}

GTM PLAN:
${plan.gtmPlan.map((channel, i) => `${i + 1}. ${channel}`).join("\n")}

COLD DM SCRIPT:
${plan.coldDmScript}

COLD EMAIL SCRIPT:
${plan.emailScript}
`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getVerdictColor = (v: string) => {
    switch (v) {
      case "BUILD":
        return "border-green-500 bg-green-500/10";
      case "PIVOT":
        return "border-yellow-500 bg-yellow-500/10";
      case "KILL":
        return "border-red-500 bg-red-500/10";
      default:
        return "border-gray-500";
    }
  };

  const getVerdictTextColor = (v: string) => {
    switch (v) {
      case "BUILD":
        return "text-green-500";
      case "PIVOT":
        return "text-yellow-500";
      case "KILL":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            BUILD<span className="text-green-500">OR</span>KILL
          </h1>
          <p className="text-zinc-400 text-lg">
            AI that decides whether to build your SaaS idea
          </p>
        </header>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4 bg-zinc-900 rounded-full p-1">
            <button
              onClick={() => setBrutalMode(false)}
              className={`px-6 py-2 rounded-full transition-all ${!brutalMode
                  ? "bg-green-600 text-white font-semibold"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              NORMAL
            </button>
            <button
              onClick={() => setBrutalMode(true)}
              className={`px-6 py-2 rounded-full transition-all ${brutalMode
                  ? "bg-red-600 text-white font-semibold animate-pulse-glow"
                  : "text-zinc-400 hover:text-white"
                }`}
            >
              BRUTAL
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 mb-12">
          <div className="bg-zinc-900 rounded-2xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-zinc-300">
                PROBLEM STATEMENT *
              </label>
              <textarea
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What specific problem does your SaaS solve?"
                className="w-full h-24 bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-zinc-300">
                PROPOSED SOLUTION *
              </label>
              <textarea
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="How does your SaaS solve this problem?"
                className="w-full h-24 bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-zinc-300">
                TARGET AUDIENCE *
              </label>
              <textarea
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Who is your ideal customer? Be specific."
                className="w-full h-20 bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-zinc-300">
                OPTIONAL CONTEXT
              </label>
              <textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Pricing model, USP, current traction, etc."
                className="w-full h-20 bg-black border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-500 focus:border-red-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !problem || !solution || !audience}
            className="w-full py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xl rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "ANALYZING..." : "DECIDE MY FATE"}
          </button>
        </form>

        {isLoading && (
          <div className="bg-zinc-900 rounded-2xl p-8 text-center mb-12">
            <div className="text-4xl mb-4 animate-pulse">⚡</div>
            <p className="text-xl text-zinc-300 animate-pulse-glow">
              {loadingMessage}
            </p>
          </div>
        )}

        {verdict && !isLoading && (
          <div
            className={`rounded-2xl p-6 border-2 mb-12 ${getVerdictColor(verdict.verdict)}`}
          >
            <div className="text-center mb-8">
              <div
                className={`text-6xl font-bold ${getVerdictTextColor(verdict.verdict)}`}
              >
                {verdict.verdict}
              </div>
              <div className="text-2xl mt-2 text-zinc-400">
                Score: {verdict.finalScore.toFixed(1)}/10
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-2">Market Demand</div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${i < verdict.scoring.marketDemand
                          ? verdict.scoring.marketDemand >= 7
                            ? "bg-green-500"
                            : verdict.scoring.marketDemand >= 4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : "bg-zinc-700"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right text-sm mt-1">
                  {verdict.scoring.marketDemand}/10
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-2">
                  Competition Intensity
                </div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${i < verdict.scoring.competitionIntensity
                          ? verdict.scoring.competitionIntensity >= 7
                            ? "bg-red-500"
                            : verdict.scoring.competitionIntensity >= 4
                              ? "bg-yellow-500"
                              : "bg-green-500"
                          : "bg-zinc-700"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right text-sm mt-1">
                  {verdict.scoring.competitionIntensity}/10
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-2">
                  Monetization Potential
                </div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${i < verdict.scoring.monetizationPotential
                          ? verdict.scoring.monetizationPotential >= 7
                            ? "bg-green-500"
                            : verdict.scoring.monetizationPotential >= 4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : "bg-zinc-700"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right text-sm mt-1">
                  {verdict.scoring.monetizationPotential}/10
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4">
                <div className="text-sm text-zinc-400 mb-2">
                  Distribution Ease
                </div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${i < verdict.scoring.distributionEase
                          ? verdict.scoring.distributionEase >= 7
                            ? "bg-green-500"
                            : verdict.scoring.distributionEase >= 4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : "bg-zinc-700"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right text-sm mt-1">
                  {verdict.scoring.distributionEase}/10
                </div>
              </div>

              <div className="bg-black/50 rounded-lg p-4 md:col-span-2">
                <div className="text-sm text-zinc-400 mb-2">Founder Fit</div>
                <div className="flex gap-1">
                  {[...Array(10)].map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 flex-1 rounded ${i < verdict.scoring.founderFit
                          ? verdict.scoring.founderFit >= 7
                            ? "bg-green-500"
                            : verdict.scoring.founderFit >= 4
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          : "bg-zinc-700"
                        }`}
                    />
                  ))}
                </div>
                <div className="text-right text-sm mt-1">
                  {verdict.scoring.founderFit}/10
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-black/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-red-400 mb-3 flex items-center gap-2">
                  <span>💣</span> BRUTAL TRUTH
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {verdict.brutalTruth}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <span>📊</span> REALITY CHECK
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {verdict.realityCheck}
                </p>
              </div>

              <div className="bg-black/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-green-400 mb-3 flex items-center gap-2">
                  <span>🔄</span> CONTRARIAN INSIGHT
                </h3>
                <p className="text-zinc-300 leading-relaxed">
                  {verdict.contrarianInsight}
                </p>
              </div>

              {verdict.executionPlan && (
                <div className="bg-black/50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2">
                      <span>🚀</span> EXECUTION PLAN
                    </h3>
                    <button
                      onClick={copyExecutionPlan}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition-colors"
                    >
                      {copied ? "COPIED!" : "COPY PLAN"}
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-semibold text-zinc-400 mb-1">
                        IDEAL CUSTOMER PROFILE
                      </div>
                      <p className="text-zinc-200">
                        {verdict.executionPlan.icp}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-400 mb-1">
                        MESSAGING
                      </div>
                      <p className="text-zinc-200">
                        {verdict.executionPlan.messaging}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-400 mb-1">
                        GTM PLAN - FIRST 10 CHANNELS
                      </div>
                      <ul className="list-disc list-inside text-zinc-200 space-y-1">
                        {verdict.executionPlan.gtmPlan.map((channel, i) => (
                          <li key={i}>{channel}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-400 mb-1">
                        COLD DM SCRIPT
                      </div>
                      <p className="text-zinc-200 whitespace-pre-wrap">
                        {verdict.executionPlan.coldDmScript}
                      </p>
                    </div>

                    <div>
                      <div className="text-sm font-semibold text-zinc-400 mb-1">
                        COLD EMAIL SCRIPT
                      </div>
                      <p className="text-zinc-200 whitespace-pre-wrap">
                        {verdict.executionPlan.emailScript}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(verdict.similarBenchmarks?.length ?? 0) > 0 && (
                <div className="bg-black/50 rounded-lg p-6">
                  <h3 className="text-xl font-bold text-purple-400 mb-3 flex items-center gap-2">
                    <span>🏢</span> SIMILAR BENCHMARKS
                  </h3>
                  <ul className="list-disc list-inside text-zinc-300 space-y-1">
                    {verdict.similarBenchmarks.map((benchmark, i) => (
                      <li key={i}>{benchmark}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="bg-zinc-900 rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-6">PAST DECISIONS</h2>
            <div className="space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`bg-black rounded-xl p-4 border-l-4 ${getVerdictColor(item.verdict.verdict)}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span
                          className={`font-bold ${getVerdictTextColor(item.verdict.verdict)}`}
                        >
                          {item.verdict.verdict}
                        </span>
                        <span className="text-zinc-500 text-sm">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                        <span className="text-zinc-600 text-sm">
                          Score: {item.verdict.finalScore.toFixed(1)}
                        </span>
                      </div>
                      <p className="text-zinc-400 text-sm line-clamp-2">
                        {item.idea.problem}
                      </p>
                    </div>
                    <button
                      onClick={() => deleteHistoryItem(item.id)}
                      className="text-zinc-500 hover:text-red-500 transition-colors ml-4"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <footer className="text-center text-zinc-600 mt-12 text-sm">
          Built for founders who need the truth, not comfort.
        </footer>
      </div>
    </div>
  );
}
