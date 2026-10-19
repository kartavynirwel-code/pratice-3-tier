import { useEffect, useState } from "react";
import { api, API_BASE } from "./api.js";

const STATUSES = ["TODO", "IN_PROGRESS", "DONE"];
const LABELS = { TODO: "To do", IN_PROGRESS: "In progress", DONE: "Done" };

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const load = () =>
    api.listTasks().then(setTasks).catch((e) => setError(e.message));

  useEffect(() => { load(); }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setError("");
      await api.createTask({ title, description: "", status: "TODO" });
      setTitle("");
      load();
    } catch (err) { setError(err.message); }
  };

  const change = async (t, status) => {
    try { await api.updateTask(t.id, { ...t, status }); load(); }
    catch (err) { setError(err.message); }
  };

  const remove = async (id) => {
    try { await api.deleteTask(id); load(); }
    catch (err) { setError(err.message); }
  };

  return (
    <section>
      <form className="add" onSubmit={add}>
        <input value={title} onChange={(e) => setTitle(e.target.value)}
               placeholder="What needs doing?" maxLength={120} aria-label="Task title" />
        <button type="submit">Add task</button>
      </form>
      {error && <p className="error" role="alert">{error}. Check the Status tab.</p>}
      {tasks.length === 0 && !error && <p className="muted">No tasks yet. Add your first one above.</p>}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.status === "DONE" ? "done" : ""}>
            <div>
              <strong>{t.title}</strong>
              {t.description && <span className="muted">{t.description}</span>}
            </div>
            <select value={t.status} onChange={(e) => change(t, e.target.value)} aria-label={`Status for ${t.title}`}>
              {STATUSES.map((s) => <option key={s} value={s}>{LABELS[s]}</option>)}
            </select>
            <button className="ghost" onClick={() => remove(t.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Status() {
  const [info, setInfo] = useState(null);
  const [health, setHealth] = useState(null);
  const [error, setError] = useState("");

  const refresh = () => {
    setError("");
    Promise.all([api.info(), api.health()])
      .then(([i, h]) => { setInfo(i); setHealth(h); })
      .catch((e) => { setInfo(null); setHealth(null); setError(`Backend unreachable at ${API_BASE} (${e.message})`); });
  };

  useEffect(refresh, []);

  return (
    <section>
      <button onClick={refresh}>Refresh</button>
      {error && <p className="error" role="alert">{error}</p>}
      {health && <p className={health.status === "UP" ? "ok" : "error"}>Backend: {health.status}, Database: {health.db}</p>}
      <dl className="grid">
        <dt>API base URL (frontend build)</dt><dd>{API_BASE}</dd>
        {info && Object.entries(info).map(([k, v]) => (
          <div key={k} className="row"><dt>{k}</dt><dd>{String(v)}</dd></div>
        ))}
      </dl>
    </section>
  );
}

export default function App() {
  const [tab, setTab] = useState("tasks");
  return (
    <main>
      <h1>Task Tracker</h1>
      <nav>
        <button className={tab === "tasks" ? "active" : ""} onClick={() => setTab("tasks")}>Tasks</button>
        <button className={tab === "status" ? "active" : ""} onClick={() => setTab("status")}>Status</button>
      </nav>
      {tab === "tasks" ? <Tasks /> : <Status />}
    </main>
  );
}
