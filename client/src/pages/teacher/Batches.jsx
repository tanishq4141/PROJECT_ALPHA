import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import BatchCard from "../../components/BatchCard";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { createBatch, getBatches } from "../../apiCalls/batchCall";

const TeacherBatches = () => {
  const dispatch = useDispatch();
  const [batches, setBatches] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [studentEmails, setStudentEmails] = useState("");

  useEffect(() => {
    loadBatches();
  }, []);

  const loadBatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getBatches();
      // backend returns { batches: [...] } — normalize to array
      const list = Array.isArray(res) ? res : res?.batches || [];
      setBatches(list);
    } catch (err) {
      setError(
        err?.message ||
          err?.message ||
          JSON.stringify(err) ||
          "Failed to load batches"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const emails = studentEmails
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const res = await createBatch({
        name,
        description,
        studentEmails: emails,
      });
      // backend returns { batch, missingEmails }
      const newBatch = res?.batch || res;
      setBatches((prev) => [newBatch, ...(Array.isArray(prev) ? prev : [])]);
      setShowForm(false);
      setName("");
      setDescription("");
      setStudentEmails("");
      if (res?.missingEmails && res.missingEmails.length) {
        alert("These emails were not found: " + res.missingEmails.join(", "));
      }
    } catch (err) {
      setError(err?.message || JSON.stringify(err) || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="teacher" />

      <main className="ml-80 p-6 w-full min-h-screen relative">
        <h1 className="text-3xl font-bold mb-6">Batches</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {loading && <div className="mb-4">Loading...</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {Array.isArray(batches) && batches.length
            ? batches.map((batch) => (
                <BatchCard key={batch._id} batch={batch} role="teacher" />
              ))
            : !loading && <div>No batches yet.</div>}
        </div>

        {/* Fixed Create Batch button */}
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={() => setShowForm(true)}
            className="shadow-lg bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-full"
          >
            Create Batch
          </Button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Batch Name
                  </label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Student Emails (comma-separated)
                  </label>
                  <textarea
                    value={studentEmails}
                    onChange={(e) => setStudentEmails(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="s1@example.com, s2@example.com"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Batch"}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default TeacherBatches;
