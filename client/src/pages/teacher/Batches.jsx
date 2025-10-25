import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { createBatch, getBatches } from "../../apiCalls/batchCall";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import BatchCard from "../../components/BatchCard";
import Button from "../../components/Button";
import Card from "../../components/Card";

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
    try {
      const data = await getBatches();
      setBatches(data);
    } catch (err) {
      setError(err.message || "Failed to load batches");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const emails = studentEmails
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email);

      const newBatch = await createBatch({
        name,
        description,
        studentEmails: emails,
      });

      setBatches((prev) => [...prev, newBatch]);
      setShowForm(false);
      resetForm();
    } catch (err) {
      setError(err.message || "Failed to create batch");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setStudentEmails("");
  };

  return (
    <div className="flex">
      <Navbar />
      <Sidebar role="teacher" />

      <main className="ml-64 p-6 w-full min-h-screen relative">
        <h1 className="text-3xl font-bold mb-6">Batches</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {batches.map((batch) => (
            <BatchCard key={batch._id} batch={batch} role="teacher" />
          ))}
        </div>

        {/* Fixed position Create Batch button */}
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={() => setShowForm(true)}
            className="shadow-lg bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Batch
          </Button>
        </div>

        {/* Modal for create batch form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Batch Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
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
                    required
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
                    placeholder="student1@example.com, student2@example.com"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Batch"}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setShowForm(false)}
                    variant="secondary"
                  >
                    Cancel
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
