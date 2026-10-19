# Practice checklist

Solutions are not included on purpose. Do each item yourself, then note what broke.

## Phase 0: Containerise and run (prerequisite)
- [ ] Write Dockerfiles for backend and frontend, push images to your registry
- [ ] Decide how the DB gets `schema.sql` (init script, Job, or initContainer)

## Phase 1: Linux networking
- [ ] List listening sockets for each tier with `ss -tlnp`
- [ ] From the frontend host, `curl -v` the backend `/api/health` and read the TCP/HTTP phases
- [ ] Stop MySQL, then watch `/api/health` return 503 and `/api/info` show `dbReachable: false`
- [ ] Capture backend-to-DB traffic with `tcpdump -i any port 3306` and identify the handshake
- [ ] Resolve service names with `dig` / `getent hosts` and break DNS on purpose (wrong `DB_HOST`)
- [ ] Block the backend port with `iptables` and observe timeout vs connection refused
- [ ] Reproduce a port mismatch (`SERVER_PORT` vs what the frontend calls) and debug it with only CLI tools
- [ ] Trace the CORS failure when `CORS_ORIGIN` is wrong (browser dev tools + `curl -H "Origin: ..."`)

## Phase 2: Helm
- [ ] One chart per tier, or one umbrella chart. Compare and decide
- [ ] Map every variable in `.env.example` to values.yaml, ConfigMap or Secret
- [ ] Separate `values-dev.yaml` and `values-prod.yaml`
- [ ] Liveness and readiness probes using the actuator endpoints
- [ ] `helm lint`, `helm template`, `helm install --dry-run`, `helm diff upgrade`
- [ ] Upgrade with a bad image tag, then `helm rollback`
- [ ] Use `helm test` to hit `/api/health`

## Phase 3: ArgoCD
- [ ] Install ArgoCD and register your Git repo
- [ ] Create an Application per environment pointing at the chart and values file
- [ ] Enable auto-sync, prune and self-heal
- [ ] Drift test: `kubectl edit` a Deployment and watch ArgoCD revert it
- [ ] Sync waves so the DB comes up before backend and backend before frontend
- [ ] Break a manifest in Git and practice the rollback from Git history
- [ ] App-of-apps pattern for all three tiers

## Known gotcha to solve
`VITE_API_BASE_URL` is baked in at **build time**, so one image cannot serve different environments with different backend URLs. Decide how to handle it:
build per environment, serve the frontend behind one ingress with `/api` routed to the backend (same-origin), or inject runtime config at container start.
