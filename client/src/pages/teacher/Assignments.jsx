import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAssignment } from "../../apiCalls/assignmentsCall.js";

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctOption: 0,
});

const CreateAssignment = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [batchId, setBatchId] = useState(""); // paste batch id or implement batch select later
  const [questions, setQuestions] = useState([emptyQuestion()]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const navigate = useNavigate();

  const addQuestion = () => setQuestions((q) => [...q, emptyQuestion()]);
  const removeQuestion = (i) => setQuestions((q) => q.filter((_, idx) => idx !== i));

  const updateQuestion = (idx, field, value, optIdx) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== idx) return q;
        if (field === "question") return { ...q, question: value };
        if (field === "option") {
          const options = [...q.options];
          options[optIdx] = value;
          return { ...q, options };
        }
        if (field === "correctOption") return { ...q, correctOption: Number(value) };
        return q;
      })
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const payload = { title, description, questions, dueDate, batchId: batchId || null };
      await createAssignment(payload);
      setMsg("Assignment created successfully.");
      setTimeout(() => navigate("/teacher/dashboard"), 800);
    } catch (err) {
      setMsg(err?.message || err?.message || JSON.stringify(err) || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Create MCQ Assignment</h2>
      {msg && <div className="mb-4 text-sm text-red-600">{msg}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Title</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Description</label>
          <textarea required value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Due Date</label>
          <input required type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="p-2 border rounded" />
        </div>
        <div>
          <label className="block text-sm">Batch ID (optional)</label>
          <input value={batchId} onChange={(e) => setBatchId(e.target.value)} className="w-full p-2 border rounded" placeholder="Paste batch id to auto-assign" />
        </div>

        <div>
          <h3 className="font-semibold mb-2">Questions</h3>
          {questions.map((q, i) => (
            <div key={i} className="mb-4 p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <strong>Q{i + 1}</strong>
                <button type="button" onClick={() => removeQuestion(i)} className="text-sm text-red-600">Remove</button>
              </div>
              <input required placeholder="Question text" value={q.question} onChange={(e) => updateQuestion(i, "question", e.target.value)} className="w-full p-2 border rounded mb-2" />
              <div className="grid grid-cols-2 gap-2">
                {q.options.map((opt, oi) => (
                  <div key={oi}>
                    <input required placeholder={`Option ${oi + 1}`} value={opt} onChange={(e) => updateQuestion(i, "option", e.target.value, oi)} className="w-full p-2 border rounded mb-1" />
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <label className="text-sm">Correct option (0-based index)</label>
                <input type="number" min="0" max={q.options.length - 1} value={q.correctOption} onChange={(e) => updateQuestion(i, "correctOption", e.target.value)} className="w-24 p-2 border rounded ml-2" />
              </div>
            </div>
          ))}
          <div>
            <button type="button" onClick={addQuestion} className="px-4 py-2 bg-blue-600 text-white rounded">Add Question</button>
          </div>
        </div>

        <div>
          <button disabled={loading} type="submit" className="px-6 py-2 bg-green-600 text-white rounded">
            {loading ? "Creating..." : "Create Assignment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAssignment;