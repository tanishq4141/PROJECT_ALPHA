import React, { useEffect, useState } from "react";
import { getStudentAssignments } from "../apiCalls/assignmentsCall";
import { useSelector } from "react-redux";

const StudentAssignments = () => {
  const user = useSelector((s) => s.auth?.user);
  const studentId = user?._id || user?.id;
  const [assignments, setAssignments] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    if (!studentId) return;
    setLoading(true);
    getStudentAssignments(studentId)
      .then((res) => setAssignments(res.assignments || []))
      .catch((e) => setErr(e?.message || JSON.stringify(e)))
      .finally(() => setLoading(false));
  }, [studentId]);

  if (!studentId)
    return (
      <div className="p-6">Please login as student to view assignments.</div>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Your Assignments</h2>
      {err && <div className="mb-3 text-red-600">{err}</div>}
      {loading && <div>Loading...</div>}
      {!loading && assignments.length === 0 && (
        <div>No assignments assigned yet.</div>
      )}
      <div className="space-y-4">
        {assignments.map((aObj) => {
          const a = aObj.assignment;
          if (!a) return null;
          return (
            <div key={a._id} className="p-4 border rounded">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="text-sm text-gray-600">{a.description}</p>
                  <p className="text-xs text-gray-500">
                    Due: {new Date(a.dueDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <button
                    onClick={() => setActive(a)}
                    className="px-3 py-1 bg-blue-600 text-white rounded"
                  >
                    Open
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      className="text-left p-2 border rounded hover:bg-gray-100"
                      onClick={() =>
                        alert(`Selected option ${oi} (no submit in phase 1)`)
                      }
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <button
              onClick={() => setActive(null)}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;
