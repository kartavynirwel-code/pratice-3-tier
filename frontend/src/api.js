// Baked in at build time by Vite. See docs/PRACTICE.md for why this matters.
export const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

async function request(path, options) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok && res.status !== 503) {
    throw new Error(`${options?.method ?? "GET"} ${path} failed with ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export const api = {
  listTasks: () => request("/api/tasks"),
  createTask: (task) => request("/api/tasks", { method: "POST", body: JSON.stringify(task) }),
  updateTask: (id, task) => request(`/api/tasks/${id}`, { method: "PUT", body: JSON.stringify(task) }),
  deleteTask: (id) => request(`/api/tasks/${id}`, { method: "DELETE" }),
  health: () => request("/api/health"),
  info: () => request("/api/info"),
};
