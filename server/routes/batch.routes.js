import express from "express";
import { createBatch, getBatches } from "../controllers/batch.controller.js";
import { authenticate, requireTeacher } from "../middleware/auth.middleware.js";

const batchRouters = express.Router();

batchRouters.post("/create", authenticate, requireTeacher, createBatch);
batchRouters.get("/", authenticate, requireTeacher, getBatches);

export default batchRouters;