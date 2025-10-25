import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import Card from "../../components/Card";
import Button from "../../components/Button";
import { motion } from "framer-motion";
import { getBatches } from "../../apiCalls/batchCall";
import { getTeacherAssignments } from "../../apiCalls/assignmentsCall";

const TeacherDashboard = () => {
  const authUser = useSelector((state) => state.auth.user);
  const teacherId = authUser?._id || authUser?.id;
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [batches, setBatches] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      if (!teacherId) return;
      setLoading(true);
      setError(null);
      try {
        const bRes = await getBatches();
        const batchesList = Array.isArray(bRes) ? bRes : bRes?.batches || [];
        setBatches(batchesList);

        const aRes = await getTeacherAssignments(teacherId);
        const assignmentsList = Array.isArray(aRes)
          ? aRes
          : aRes?.assignments || [];
        setAssignments(assignmentsList);
      } catch (err) {
        setError(err?.message || JSON.stringify(err));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teacherId]);

  // derive students set from batches
  const studentMap = {};
  batches.forEach((b) => {
    (b.students || []).forEach((s) => {
      if (s && s._id) studentMap[s._id] = s;
    });
  });
  const students = Object.values(studentMap);

  // compute stats
  const totalSubmissions = assignments.reduce(
    (acc, a) => acc + (a.submissions?.length || 0),
    0
  );
  const avgScore =
    assignments.length > 0
      ? Math.round(
          (assignments.reduce((acc, a) => acc + (a.avgScore || 0), 0) /
            assignments.length) *
            10
        ) / 10
      : 0;

  const stats = [
    {
      label: "Total Batches",
      value: batches.length,
      color: "text-primary-600 dark:text-primary-400",
      bg: "bg-primary-50 dark:bg-primary-900/20",
      icon: "👥",
      change: "+2 this month",
    },
    {
      label: "Active Students",
      value: students.length,
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-900/20",
      icon: "👨‍🎓",
      change: "+12 this week",
    },
    {
      label: "Total Assignments",
      value: assignments.length,
      color: "text-accent-600 dark:text-accent-400",
      bg: "bg-accent-50 dark:bg-accent-900/20",
      icon: "📝",
      change: "+5 this week",
    },
    {
      label: "Submissions",
      value: totalSubmissions,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-900/20",
      icon: "📊",
      change: "+23 today",
    },
    {
      label: "Avg Score",
      value: `${avgScore}%`,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-50 dark:bg-purple-900/20",
      icon: "⭐",
      change: "+3% this month",
    },
  ];

  const recentActivity = [
    // lightweight dynamic recent activity from assignments/batches
    ...assignments.slice(0, 2).map((a) => ({
      type: "assignment",
      title: `Assignment: ${a.title}`,
      description: `${a.questions?.length || 0} questions • Due ${
        a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "N/A"
      }`,
      time: a.createdAt ? new Date(a.createdAt).toLocaleString() : "recent",
      icon: "📝",
      color: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    })),
    ...batches.slice(0, 2).map((b) => ({
      type: "batch",
      title: `Batch: ${b.name}`,
      description: `${(b.students || []).length} students`,
      time: b.createdAt ? new Date(b.createdAt).toLocaleString() : "recent",
      icon: "👥",
      color:
        "bg-purple-100 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400",
    })),
  ];

  return (
    <div className="min-h-screen bg-secondary-50 dark:bg-secondary-900">
      <Navbar />
      <Sidebar
        role="teacher"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed top-20 left-4 z-40 p-3 bg-white dark:bg-secondary-800 rounded-xl shadow-medium"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      <main className="lg:ml-80 pt-20 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-display font-bold text-secondary-900 dark:text-secondary-100 mb-2">
                Teacher Dashboard 📚
              </h1>
              <p className="text-lg text-secondary-600 dark:text-secondary-400">
                Manage your classes and track student progress.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate("/teacher/create-assignment")}
                variant="primary"
                className="whitespace-nowrap"
              >
                Create Assignment
              </Button>
              <Button
                onClick={() => navigate("/teacher/batches")}
                variant="secondary"
              >
                Manage Batches
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`${stat.bg} border-0`}>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}
                    >
                      {stat.icon}
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${stat.color}`}>
                        {stat.value}
                      </div>
                      <div className="text-xs text-secondary-600 dark:text-secondary-400">
                        {stat.change}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">
                    {stat.label}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="mb-8">
                <Card.Header>
                  <Card.Title>Quick Actions</Card.Title>
                  <Card.Description>Common tasks</Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-3">
                    <Button
                      onClick={() => navigate("/teacher/create-assignment")}
                      variant="primary"
                      className="w-full justify-start"
                      icon="📝"
                    >
                      Create Assignment
                    </Button>
                    <Button
                      onClick={() => navigate("/teacher/batches")}
                      variant="secondary"
                      className="w-full justify-start"
                      icon="👥"
                    >
                      Manage Batches
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      icon="📊"
                    >
                      View Analytics
                    </Button>
                  </div>
                </Card.Content>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card>
                <Card.Header>
                  <Card.Title>Recent Activity</Card.Title>
                  <Card.Description>
                    Latest updates from your classes
                  </Card.Description>
                </Card.Header>
                <Card.Content>
                  <div className="space-y-4">
                    {loading && <div>Loading...</div>}
                    {error && <div className="text-red-600">{error}</div>}
                    {!loading && !error && recentActivity.length === 0 && (
                      <div>No recent activity</div>
                    )}
                    {recentActivity.map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center space-x-4 p-4 bg-secondary-50 dark:bg-secondary-800 rounded-xl"
                      >
                        <div
                          className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center`}
                        >
                          <span className="text-lg">{activity.icon}</span>
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-secondary-900 dark:text-secondary-100">
                            {activity.title}
                          </div>
                          <div className="text-sm text-secondary-600 dark:text-secondary-400">
                            {activity.description}
                          </div>
                        </div>
                        <div className="text-xs text-secondary-500 dark:text-secondary-400">
                          {activity.time}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card.Content>
              </Card>
            </div>
          </div>

          <Card className="mt-8">
            <Card.Header>
              <Card.Title>Upcoming Deadlines</Card.Title>
              <Card.Description>Assignments due soon</Card.Description>
            </Card.Header>
            <Card.Content>
              <div className="space-y-4">
                {assignments.slice(0, 3).map((a) => (
                  <div
                    key={a._id}
                    className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                        <span className="text-yellow-600 dark:text-yellow-400">
                          ⚠️
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-secondary-900 dark:text-secondary-100">
                          {a.title}
                        </div>
                        <div className="text-sm text-secondary-600 dark:text-secondary-400">
                          Due{" "}
                          {a.dueDate
                            ? new Date(a.dueDate).toLocaleDateString()
                            : "N/A"}{" "}
                          •{" "}
                          {a.batch && a.batch.students
                            ? a.batch.students.length
                            : "—"}{" "}
                          students
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(`/teacher/assignments/${a._id}`)}
                    >
                      View
                    </Button>
                  </div>
                ))}
                {assignments.length === 0 && (
                  <div className="p-4 text-sm text-secondary-600">
                    No upcoming assignments
                  </div>
                )}
              </div>
            </Card.Content>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default TeacherDashboard;
