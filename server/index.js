import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { MongoClient, ObjectId } from "mongodb";

import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const client = new MongoClient(process.env.MONGODB_URI);
let books;
let borrows;

app.use(cors({
  origin: (process.env.CLIENT_ORIGIN || "http://localhost:3000").split(","),
  credentials: true
}));
app.use(express.json({ limit: "2mb" }));

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) return res.status(401).json({ message: "Authentication required." });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: "Your session has expired. Please sign in again." });
  }
}

function validId(id) {
  return ObjectId.isValid(id);
}

app.get("/health", (_req, res) => res.json({ status: "ok", service: "BookNook API" }));

