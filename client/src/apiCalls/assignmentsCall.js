import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const getStudentAssignments = async (studentId) => {
  try {
    const res = await api.get(`/api/assignments/student/${studentId}`);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const createAssignment = async (payload) => {
  try {
    const res = await api.post("/api/assignments/create", payload);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const submitAssignment = async ({ assignmentId, answers }) => {
  try {
    const res = await api.post("/api/assignments/submit", { assignmentId, answers });
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};

export const getTeacherAssignments = async (teacherId) => {
  try {
    const res = await api.get(`/api/assignments/teacher/${teacherId}`);
    return res.data;
  } catch (err) {
    throw err?.response?.data || err;
  }
};