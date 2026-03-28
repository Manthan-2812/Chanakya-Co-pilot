import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
});

export default api;

// ── Chat ──────────────────────────────────────────────
export const sendChatMessage = (message) =>
  api.post("/chat", { message }).then((r) => r.data.reply);

// ── Goals ─────────────────────────────────────────────
export const getGoalAssets = () =>
  api.get("/goals/assets").then((r) => r.data);

export const calculateInvestment = (payload) =>
  api.post("/goals/calculate-investment", payload).then((r) => r.data);

export const createGoal = (payload) =>
  api.post("/goals/create", payload).then((r) => r.data);

export const getUserGoals = (userId) =>
  api.get(`/goals/${userId}`).then((r) => r.data);

// ── Portfolio ──────────────────────────────────────────
export const createPortfolio = (payload) =>
  api.post("/portfolio/create", payload).then((r) => r.data);

export const getUserPortfolio = (userId) =>
  api.get(`/portfolio/${userId}`).then((r) => r.data);

// ── Market ─────────────────────────────────────────────
export const getMarketSummary = () =>
  api.get("/market/summary").then((r) => r.data);

// ── Summary ────────────────────────────────────────────
export const getUserSummary = (userId) =>
  api.get(`/summary/${userId}`).then((r) => r.data);