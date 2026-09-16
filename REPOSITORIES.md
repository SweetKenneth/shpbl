# SHPBL repository map

Written for an outside reader. Last reviewed **2026-09-16**.

Several repositories under this account share a lineage but play very different roles. This is
which is which, and what you can rely on.

## The two SHPBL repositories that are not the same thing

| Repository | Visibility | Role |
| --- | --- | --- |
| [`shpbl`](https://github.com/SweetKenneth/shpbl) | public | **The front door.** Explanation and index. Contains no part of the machine. |
| `shpbl-master` | private | **The canonical machine.** The harvested corpus, the composition engine and the Governor tooling. Deliberately not published; it is the asset, not a demo. |

If you are looking for something to read, run or audit, it is one of the implementation
repositories below — not either of these.

## Public inspectable outputs

Each is a capability SHPBL composed, submitted to Tenable's CyberAgents Exchange and reviewed
there. Each is standalone, separately licensed, and readable without any access to SHPBL. Their
names, URLs, commit history, licences, tests and provenance files are stable — external
submissions cite them.

| Capability | Repository |
| --- | --- |
| Retrieval Context Provenance Auditor | [`shpbl-retrieval-auditor`](https://github.com/SweetKenneth/shpbl-retrieval-auditor) |
| Agent Action Evidence Ledger | [`shpbl-action-ledger`](https://github.com/SweetKenneth/shpbl-action-ledger) |
| Cross-Agent Handoff Attestor | [`shpbl-handoff-attestor`](https://github.com/SweetKenneth/shpbl-handoff-attestor) |
| Agent Behaviour Drift Sentinel | [`shpbl-drift-sentinel`](https://github.com/SweetKenneth/shpbl-drift-sentinel) |
| Canary Evidence Chain | [`shpbl-canary-chain`](https://github.com/SweetKenneth/shpbl-canary-chain) |
| Counterfactual Immune Forge | [`shpbl-immune-forge`](https://github.com/SweetKenneth/shpbl-immune-forge) |
| Nightmare Probe Engine | [`shpbl-nightmare-probe-engine`](https://github.com/SweetKenneth/shpbl-nightmare-probe-engine) |
| Fleet Immune System | [`shpbl-fleet-immune-system`](https://github.com/SweetKenneth/shpbl-fleet-immune-system) |
| Security Genome Reactor | [`shpbl-security-genome-reactor`](https://github.com/SweetKenneth/shpbl-security-genome-reactor) |
| Remediation Flight Recorder | [`shpbl-remediation-flight-recorder`](https://github.com/SweetKenneth/shpbl-remediation-flight-recorder) |
| Counterfactual Exposure Planner | [`shpbl-counterfactual-exposure-planner`](https://github.com/SweetKenneth/shpbl-counterfactual-exposure-planner) |
| Scan Coverage Autopilot | [`shpbl-scan-coverage-autopilot`](https://github.com/SweetKenneth/shpbl-scan-coverage-autopilot) |

Submission and review state for each is in the generated table in
[`README.md`](README.md), from [`TENABLE-LISTINGS.json`](TENABLE-LISTINGS.json).

## Permanent clean-room provenance

Each of these publishes the behaviour specification an implementation was written from. Every
corresponding implementation's `PROVENANCE.md` cites its spec repository by URL, which is what
makes the clean-room claim checkable by someone who does not trust us.

[`shpbl-spec-retrieval-auditor`](https://github.com/SweetKenneth/shpbl-spec-retrieval-auditor) ·
[`shpbl-spec-action-ledger`](https://github.com/SweetKenneth/shpbl-spec-action-ledger) ·
[`shpbl-spec-handoff-attestor`](https://github.com/SweetKenneth/shpbl-spec-handoff-attestor) ·
[`shpbl-spec-drift-sentinel`](https://github.com/SweetKenneth/shpbl-spec-drift-sentinel) ·
[`shpbl-spec-canary-chain`](https://github.com/SweetKenneth/shpbl-spec-canary-chain)

These are frozen. They are evidence, not projects.

## Research and historical provenance

Preserved, unmaintained, and not expected to build. Each carries a `PROVENANCE.md` and a README
banner saying so. They exist because their URLs and commit history are part of the record.

`cmpsbl` · `cmpsbl-daily-drop` · `cmpsbl-modeling-utils-apex` ·
`cmpsbl-langchain-ascended-agent` · `transformers-ascended` · `transformers-ascended-verified` ·
`express-ascended` · `langgraph-ascended-verified` · `openai-agents-js-ascended` ·
`auth-starter-backend-CMPSBL` · `cmpsbl-build-provenance` · `shpbl-listen-provenance`

`cmpsbl-build-provenance` and `shpbl-listen-provenance` were renamed from hash-suffixed names
on 2026-09-16 so the name states the role. Each holds material not represented in the current
canonical repositories, which is why it survived a cleanup that removed redundant snapshots.

`cyberagents-exchange` is a fork of Tenable's repository. Every submission above is a pull
request opened from it.

## The story in one line each

- `shpbl` — the public front door.
- `shpbl-master` — the private machine.
- `shpbl-*` submission repositories — things the machine produced, each independently
  inspectable and independently licensed.
- `shpbl-spec-*` — permanent clean-room provenance.
- CyberAgents Exchange — independent external review and publication of qualifying outputs.
- `cmpsbl-*`, `*-ascended`, `*-provenance` — research and historical provenance.

© Kenneth E. Sweet Jr.
