import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarLoader } from "react-spinners";
import { Sparkles, FileText, Lightbulb, Copy, Check, AlertCircle } from "lucide-react";

const ResumeRefine = () => {
  const [resumeText, setResumeText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleRefine = async () => {
    if (!resumeText.trim()) {
      setError("Please paste your resume text first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/resume/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText }),
      });

      // Check HTTP status BEFORE attempting to parse JSON
      if (!response.ok) {
        let errMsg = "Something went wrong. Please try again.";
        try {
          const errData = await response.json();
          if (errData?.error) errMsg = errData.error;
        } catch (_) {
          // Server returned a non-JSON error body — use the generic message
        }
        throw new Error(errMsg);
      }

      // Parse the successful response
      let data;
      try {
        data = await response.json();
      } catch (_) {
        throw new Error("Received an invalid response from the server. Please try again.");
      }

      if (!data?.improvedResume) {
        throw new Error("The AI returned an incomplete response. Please try again.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedResume);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero */}
      <div className="text-center mb-10">
        <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl pb-3">
          AI Resume Refiner
        </h1>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Paste your resume below and let AI improve it for clarity, impact, and ATS compatibility.
        </p>
      </div>

      {/* Input Card */}
      <div className="rounded-xl border border-border bg-card p-6 mb-5 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <FileText size={18} className="text-muted-foreground" />
          <h2 className="text-base font-semibold">Your Resume</h2>
        </div>
        <Textarea
          className="min-h-[320px] text-sm leading-7 font-mono resize-y bg-background border-input focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground/50"
          placeholder="Paste your resume content here — work experience, skills, education, etc."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-2 text-right">
          {resumeText.trim().split(/\s+/).filter(Boolean).length} words
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-start gap-3 text-sm text-red-400 bg-red-950/40 border border-red-900/60 rounded-lg px-4 py-3 mb-5">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleRefine}
        disabled={loading}
        variant="blue"
        size="lg"
        className="w-full mb-4 font-semibold tracking-wide transition-opacity disabled:opacity-60"
      >
        <Sparkles size={18} className="mr-2" />
        {loading ? "Refining your resume…" : "Refine Resume with AI"}
      </Button>

      {/* Progress Bar */}
      {loading && (
        <div className="mb-6">
          <BarLoader width="100%" color="#36d7b7" />
          <p className="text-xs text-center text-muted-foreground mt-2">
            This may take a few seconds…
          </p>
        </div>
      )}

      {/* Output */}
      {result && (
        <div className="flex flex-col gap-5 mt-2">
          {/* Improved Resume Card */}
          <div className="rounded-xl border border-emerald-900/50 bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-emerald-900/40 bg-emerald-950/20">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-emerald-400" />
                <h2 className="text-sm font-semibold text-emerald-400 uppercase tracking-wide">
                  Improved Resume
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="h-8 text-xs gap-1.5 border-emerald-900/50 hover:bg-emerald-950/30"
              >
                {copied ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
                {copied ? "Copied!" : "Copy text"}
              </Button>
            </div>
            <div className="px-6 py-5">
              <pre className="whitespace-pre-wrap text-sm leading-7 text-foreground/90 font-mono">
                {result.improvedResume}
              </pre>
            </div>
          </div>

          {/* Suggestions Card */}
          {result.suggestions?.length > 0 && (
            <div className="rounded-xl border border-yellow-900/50 bg-card shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-6 py-4 border-b border-yellow-900/40 bg-yellow-950/20">
                <Lightbulb size={16} className="text-yellow-400" />
                <h2 className="text-sm font-semibold text-yellow-400 uppercase tracking-wide">
                  Suggestions for Improvement
                </h2>
              </div>
              <ul className="px-6 py-5 flex flex-col gap-3">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-3 text-sm text-foreground/80 leading-relaxed">
                    <span className="text-yellow-400 font-bold shrink-0 mt-px">
                      {i + 1}.
                    </span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ResumeRefine;
