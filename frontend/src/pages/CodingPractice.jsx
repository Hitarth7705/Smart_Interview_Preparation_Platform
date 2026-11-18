
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import Navbar from "../components/Navbar";
import API_BASE from "../config";
import "./styles/CodingPractice.css";

const STARTER_CODE = {
  c: "",
  cpp: "",
  java: "",
  python: "",
};

const LANGUAGE_LABELS = {
  c: "C",
  cpp: "C++",
  java: "Java",
  python: "Python",
};

export default function CodingPractice() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [question, setQuestion] = useState(null);
  const [language, setLanguage] = useState("cpp");
  const [codes, setCodes] = useState(STARTER_CODE);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [verdict, setVerdict] = useState("");
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState({
    totalQuestions: 0,
    solvedQuestions: 0,
    totalAttempts: 0,
  });

  const loadQuestion = useCallback(async (excludeId) => {
    setLoading(true);
    setError("");
    setOutput("");
    setVerdict("");
    setCodes(STARTER_CODE);
    setStdin("");

    try {
  console.log("Token exists:", !!token);
  console.log("API URL:", `${API_BASE}/api/coding/random`);

  const query = excludeId ? `?exclude=${excludeId}` : "";

  const res = await fetch(`${API_BASE}/api/coding/random${query}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  console.log("HTTP Status:", res.status);
  console.log("API Response:", data);

  if (!res.ok) {
    throw new Error(data.message || "Could not load question");
  }

  setQuestion(data.question);
} catch (err) {
  console.error("Random question error:", err);
  setError(err.message);
} finally {
  setLoading(false);
}
}, [token]);

  const loadProgress = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/coding/progress`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setProgress(await res.json());
    } catch (_) {}
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    loadQuestion();
    loadProgress();
  }, [token, navigate, loadQuestion, loadProgress]);

  const updateCode = (value) => {
    setCodes((previous) => ({
      ...previous,
      [language]: value || "",
    }));
  };

  const runCode = async () => {
    if (!codes[language].trim()) {
      setOutput("Please write your code first.");
      return;
    }

    setRunning(true);
    setOutput("Running your code...");
    setVerdict("");

    try {
      const res = await fetch(`${API_BASE}/api/coding/run`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          code: codes[language],
          language,
          stdin,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Execution failed");

      setVerdict(data.status);
      setOutput(
        data.compileOutput ||
        data.stderr ||
        data.stdout ||
        data.message ||
        "Program executed with no output."
      );
    } catch (err) {
      setOutput(err.message);
      setVerdict("Execution Error");
    } finally {
      setRunning(false);
    }
  };

  const submitCode = async () => {
    if (!codes[language].trim()) {
      setOutput("Please write your code before submitting.");
      return;
    }

    setSubmitting(true);
    setOutput("Checking your solution against test cases...");
    setVerdict("");

    try {
      const res = await fetch(`${API_BASE}/api/coding/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionId: question._id,
          code: codes[language],
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Submission failed");

      setVerdict(data.verdict);
      setOutput(
        `${data.verdict}\nPassed: ${data.passedTests}/${data.totalTests}\nExecution time: ${data.executionTime}s`
      );
      loadProgress();
    } catch (err) {
      setVerdict("Submission Error");
      setOutput(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="coding-page">
      <Navbar />

      <main className="coding-container">
        <header className="coding-header">
          <div>
            <p className="coding-eyebrow">PRACTICE • SOLVE • IMPROVE</p>
            <h1>Coding Practice</h1>
            <p>One random challenge. Your own solution.</p>
          </div>
          <div className="coding-progress">
            <span>Solved</span>
            <strong>{progress.solvedQuestions}/{progress.totalQuestions}</strong>
            <small>{progress.totalAttempts} submissions</small>
          </div>
        </header>

        {error && <div className="coding-error">{error}</div>}

        {loading ? (
          <div className="coding-loading">Finding your next challenge...</div>
        ) : question ? (
          <div className="coding-workspace">
            <section className="problem-panel">
              <div className="problem-meta">
                <span>Question #{question.questionNumber}</span>
                <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                  {question.difficulty}
                </span>
              </div>

              <h2>{question.title}</h2>
              <span className="topic-tag">{question.topic}</span>

              <h3>Problem Description</h3>
              <p className="problem-description">{question.description}</p>

              {question.constraints?.length > 0 && (
                <>
                  <h3>Constraints</h3>
                  <ul>
                    {question.constraints.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </>
              )}

              <h3>Examples</h3>
              {question.examples?.map((example, index) => (
                <div className="example-box" key={index}>
                  <strong>Example {index + 1}</strong>
                  <p><b>Input:</b> <code>{example.input}</code></p>
                  <p><b>Output:</b> <code>{example.output}</code></p>
                  {example.explanation && (
                    <p>{example.explanation}</p>
                  )}
                </div>
              ))}

              <button
                className="next-question-button"
                onClick={() => loadQuestion(question._id)}
                disabled={loading || running || submitting}
              >
                Get Another Random Question →
              </button>
            </section>

            <section className="editor-panel">
              <div className="editor-toolbar">
                <label htmlFor="language">Language</label>
                <select
                  id="language"
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                >
                  {Object.entries(LANGUAGE_LABELS).map(([value, label]) => (
                    <option value={value} key={value}>{label}</option>
                  ))}
                </select>
              </div>

              <Editor
                height="440px"
                language={language === "cpp" ? "cpp" : language}
                theme="vs-dark"
                value={codes[language]}
                onChange={updateCode}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  tabSize: 4,
                  wordWrap: "on",
                }}
              />

              <div className="custom-input-panel">
                <label htmlFor="custom-input">Custom Input (stdin)</label>
                <textarea
                  id="custom-input"
                  value={stdin}
                  onChange={(event) => setStdin(event.target.value)}
                  placeholder="Enter input for your program..."
                  rows={4}
                />
              </div>

              <div className="editor-actions">
                <button
                  className="run-button"
                  onClick={runCode}
                  disabled={running || submitting}
                >
                  {running ? "Running..." : "▶ Run Code"}
                </button>
                <button
                  className="submit-button"
                  onClick={submitCode}
                  disabled={running || submitting}
                >
                  {submitting ? "Checking..." : "✓ Submit Solution"}
                </button>
              </div>

              <div className="output-panel">
                <div className="output-heading">
                  <strong>Execution Result</strong>
                  {verdict && <span className="verdict-label">{verdict}</span>}
                </div>
                <pre>{output || "Your program output will appear here."}</pre>
              </div>
            </section>
          </div>
        ) : (
          <div className="coding-loading">
            No question is available. Add questions to the database first.
          </div>
        )}
      </main>
    </div>
  );
}
