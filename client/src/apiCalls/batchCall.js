import axios from "axios";
import { API_BASE_URL } from "./config";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const createBatch = async (batchData) => {
  try {
    const res = await api.post("/api/batches/create", batchData);
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getBatches = async () => {
  try {
    const res = await api.get("/api/batches");
    return res.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};