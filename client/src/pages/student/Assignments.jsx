import React, { useEffect, useState } from "react";
import {
  getStudentAssignments,
  submitAssignment,
} from "../../apiCalls/assignmentsCall.js";
import { useSelector } from "react-redux";

const StudentAssignments = () => {
  const user = useSelector((s) => s.auth?.user);
  const studentId = user?._id || user?.id;
  const [assignments, setAssignments] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [answers, setAnswers] = useState([]); // current answers for active assignment
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getStudentAssignments(studentId)
      .then((res) => {
        const list = res.assignments || [];
        setAssignments(list);
      })
      .catch((e) => setErr(e?.message || JSON.stringify(e)))
      .finally(() => setLoading(false));
  }, [studentId]);

  const openAssignment = (a) => {
    setActive(a);
    setSubmitResult(null);
    // initialize answers with -1 for unanswered
    setAnswers(Array.from({ length: (a.questions || []).length }, () => -1));
  };

  const chooseOption = (qIdx, optIdx) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[qIdx] = optIdx;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (!active) return;
    setSubmitting(true);
    setSubmitResult(null);
    try {
      const payload = { assignmentId: active._id, answers };
      const res = await submitAssignment(payload);
      setSubmitResult(res);
      // update local assignments state: mark this assignment completed and set score
      setAssignments((prev) =>
        prev.map((entry) =>
          entry.assignment && entry.assignment._id === active._id
            ? { ...entry, status: "completed", score: res.score }
            : entry
        )
      );
    } catch (err) {
      setSubmitResult({ error: err?.message || JSON.stringify(err) });
    } finally {
      setSubmitting(false);
    }
  };

  if (!studentId)
    return (
      <div className="p-6">Please login as student to view assignments.</div>
    );

  const pending = assignments.filter((a) => a.status !== "completed");
  const completed = assignments.filter((a) => a.status === "completed");

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      {loading && <div>Loading...</div>}

      <div className="mb-6">
        <strong>Pending:</strong> {pending.length} &nbsp;{" "}
        <strong>Completed:</strong> {completed.length}
      </div>

      <div className="space-y-4">
        {assignments.map((aObj) => {
          const a = aObj.assignment;
          if (!a) return null;
          const status =
            aObj.status || (aObj.completed ? "completed" : "pending");
          return (
            <div
              key={a._id}
              className="p-4 border rounded flex justify-between items-center"
            >
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-gray-600">{a.description}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(a.dueDate).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-sm">
                  {status === "completed"
                    ? `Score: ${aObj.score ?? "-"}`
                    : "Pending"}
                </div>
                <button
                  onClick={() => openAssignment(a)}
                  className="px-3 py-1 bg-blue-600 text-white rounded"
                >
                  Open
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active assignment view */}
      {active && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">{active.title}</h3>
          <p className="mb-2">{active.description}</p>

          <div className="space-y-3">
            {active.questions.map((q, qi) => (
              <div key={qi} className="p-3 border rounded">
                <div className="font-medium">
                  {qi + 1}. {q.question}
                </div>
                <div className="mt-2 grid grid-cols-1 gap-2">
                  {q.options.map((opt, oi) => {
                    const selected = answers[qi] === oi;
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => chooseOption(qi, oi)}
                        className={`text-left p-2 border rounded ${
                          selected
                            ? "bg-blue-600 text-white"
                            : "hover:bg-gray-100"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <button
              onClick={() => {
                setActive(null);
                setAnswers([]);
                setSubmitResult(null);
              }}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-4 py-2 bg-green-600 text-white rounded"
            >
              {submitting ? "Submitting..." : "Submit Assignment"}
            </button>
          </div>

          {submitResult && (
            <div className="mt-4 p-3 rounded bg-white border">
              {submitResult.error ? (
                <div className="text-red-600">Error: {submitResult.error}</div>
              ) : (
                <div>
                  <div>Score: {submitResult.score} / 100</div>
                  <div>
                    Correct: {submitResult.correctAnswers} /{" "}
                    {submitResult.totalQuestions}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
