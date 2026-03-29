import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BarLoader } from "react-spinners";
import { Sparkles, FileText, Lightbulb, Copy, Check } from "lucide-react";

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

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");

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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="gradient-title font-extrabold text-5xl sm:text-6xl text-center pb-2">
        AI Resume Refiner
      </h1>
      <p className="text-center text-gray-400 mb-10 text-sm">
        Paste your resume and let AI improve it for clarity, impact, and ATS compatibility.
      </p>

      {/* Input Section */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3">
          <FileText size={18} />
          <h2 className="text-lg font-semibold">Your Resume</h2>
        </div>
        <Textarea
          className="min-h-[280px] text-sm leading-relaxed font-mono"
          placeholder="Paste your resume content here..."
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-4 border border-red-800 rounded px-3 py-2">
          {error}
        </p>
      )}

      <Button
        onClick={handleRefine}
        disabled={loading}
        variant="blue"
        size="lg"
        className="w-full mb-6"
      >
        <Sparkles size={18} className="mr-2" />
        {loading ? "Refining your resume..." : "Refine Resume"}
      </Button>

      {loading && <BarLoader width="100%" color="#36d7b7" className="mb-6" />}

      {/* Output Section */}
      {result && (
        <div className="flex flex-col gap-6">
          {/* Improved Resume */}
          <div className="border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-emerald-400" />
                <h2 className="text-lg font-semibold text-emerald-400">
                  Improved Resume
                </h2>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="flex items-center gap-1.5"
              >
                {copied ? (
                  <Check size={14} className="text-emerald-400" />
                ) : (
                  <Copy size={14} />
                )}
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <pre className="whitespace-pre-wrap text-sm leading-relaxed text-gray-200 font-mono">
              {result.improvedResume}
            </pre>
          </div>

          {/* Suggestions */}
          {result.suggestions?.length > 0 && (
            <div className="border border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb size={18} className="text-yellow-400" />
                <h2 className="text-lg font-semibold text-yellow-400">
                  Suggestions for Improvement
                </h2>
              </div>
              <ul className="flex flex-col gap-2">
                {result.suggestions.map((suggestion, i) => (
                  <li key={i} className="flex gap-3 text-sm text-gray-300">
                    <span className="text-yellow-400 font-bold shrink-0">•</span>
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
