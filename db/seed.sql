USE tasktracker;

INSERT INTO tasks (title, description, status) VALUES
  ('Write Helm chart for backend', 'Values per environment, probes, secret via values', 'TODO'),
  ('Connect repo to ArgoCD', 'Auto-sync with self-heal enabled', 'TODO'),
  ('Trace frontend to backend traffic', 'Use ss, curl and tcpdump', 'IN_PROGRESS');
