# SHPBL

SHPBL is a system for turning existing software into inspectable, reusable capability, and for
composing new software out of what it finds. This repository explains the system and points at
the evidence. It does not contain the system.

The running product is at **https://shpbl.com**.

## The system, and the capabilities it composes

Two different things share the name, and keeping them apart matters:

- **SHPBL** — the machine. A governed pipeline plus the Strategic Master Library it draws on.
  Private, and the private part is the point: the harvested corpus and the composition engine
  are the asset.
- **A capability** — one thing the machine produced. Each is a small, standalone, separately
  licensed repository that anyone can read, run and test without access to SHPBL.

This repository explains the first. The repositories it links to *are* the second.

## How a run works

**Harvest → Library → Compose → Gauntlet → Ship.**

1. **Harvest** — read a repository and extract capability: units of behaviour with their
   resolved dependencies, classified by whether they are pure, hold a seam to outside state, or
   need a port supplied.
2. **Library** — admit what passes into a catalogue, recorded with where it came from.
3. **Compose** — assemble a requested capability from catalogued units, adding the integration
   needed to make them work together while preserving provenance to the underlying
   capabilities.
4. **Gauntlet** — exercise the result against its stated contract. Failure is reported as
   failure; a harness that could not exercise an artefact at all is reported as inconclusive,
   which is a limit of the harness, not a defect in the artefact.
5. **Ship** — release only what passed, sealed by checksums.

## Provenance and traceability

Every composed artefact records the units it was built from, and every unit records the source
it was harvested from. A composition can be read back to its inputs. That is what makes an
SHPBL output auditable rather than merely plausible.

Two claims that get conflated, kept separate here:

- **Deterministic** — the composition pipeline does not depend on a model generating the
  implementation. Given the same governed inputs, catalogue state and configuration, its
  decisions are traceable to those inputs.
- **Byte-reproducible** — a separate, narrower property about re-running a build and getting
  identical bytes. Claimed only where it has been demonstrated.

## The Governor boundary

A human approves. Authority is asked as a separate question per proposal, and silence is never
approval. Nothing is admitted to the catalogue, published, or released because a pipeline
decided it was ready.

## Public interfaces

- **MCP server** — SHPBL as tools, for use inside your own assistant. The tools never call a
  model; your assistant does the reasoning.
- **`@shpbl/sdk`** — the typed client, on npm: <https://www.npmjs.com/package/@shpbl/sdk>
- **Free evaluation** — <https://shpbl.com/try> runs a real audit on a public repository.

## Independently reviewed contributions

Capabilities created through SHPBL have been submitted to Tenable's CyberAgents Exchange and
reviewed there. Accepted submissions are published as contributed listings.

Precisely what that means, and does not:

- It means Tenable reviewers inspected a submitted implementation and accepted it into a
  community catalogue.
- It does **not** mean Tenable endorses, certifies, or validates SHPBL; that Tenable reviewed
  the SHPBL architecture; that Tenable partners with SHPBL; or that Tenable uses SHPBL.

Three separate layers, worth naming: **SHPBL** composes the capability, an **individual
repository** is the inspectable implementation, and the **CyberAgents Exchange** is independent
external review and publication.

<!-- TENABLE-TABLE:START -->

_Generated from `TENABLE-LISTINGS.json` — 2 accepted, 12 submitted in total._

| Capability | Implementation repository | Behaviour specification | Submission | Review state | Published listing |
| --- | --- | --- | --- | --- | --- |
| Retrieval Context Provenance Auditor | [`shpbl-retrieval-auditor`](https://github.com/SweetKenneth/shpbl-retrieval-auditor) | [spec](https://github.com/SweetKenneth/shpbl-spec-retrieval-auditor) | [#164](https://github.com/tenable/cyberagents-exchange/pull/164) | accepted | [listing](https://github.com/tenable/cyberagents-exchange/blob/main/mcp-servers/shpbl-retrieval-auditor.md) |
| Agent Action Evidence Ledger | [`shpbl-action-ledger`](https://github.com/SweetKenneth/shpbl-action-ledger) | [spec](https://github.com/SweetKenneth/shpbl-spec-action-ledger) | [#165](https://github.com/tenable/cyberagents-exchange/pull/165) | accepted | [listing](https://github.com/tenable/cyberagents-exchange/blob/main/mcp-servers/shpbl-action-ledger.md) |
| Cross-Agent Handoff Attestor | [`shpbl-handoff-attestor`](https://github.com/SweetKenneth/shpbl-handoff-attestor) | [spec](https://github.com/SweetKenneth/shpbl-spec-handoff-attestor) | [#166](https://github.com/tenable/cyberagents-exchange/pull/166) | submitted, under review | — |
| Agent Behaviour Drift Sentinel | [`shpbl-drift-sentinel`](https://github.com/SweetKenneth/shpbl-drift-sentinel) | [spec](https://github.com/SweetKenneth/shpbl-spec-drift-sentinel) | [#167](https://github.com/tenable/cyberagents-exchange/pull/167) | submitted, under review | — |
| Canary Evidence Chain | [`shpbl-canary-chain`](https://github.com/SweetKenneth/shpbl-canary-chain) | [spec](https://github.com/SweetKenneth/shpbl-spec-canary-chain) | [#168](https://github.com/tenable/cyberagents-exchange/pull/168) | submitted, under review | — |
| Counterfactual Immune Forge | [`shpbl-immune-forge`](https://github.com/SweetKenneth/shpbl-immune-forge) | in-repo | [#169](https://github.com/tenable/cyberagents-exchange/pull/169) | submitted, under review | — |
| Nightmare Probe Engine | [`shpbl-nightmare-probe-engine`](https://github.com/SweetKenneth/shpbl-nightmare-probe-engine) | in-repo | [#171](https://github.com/tenable/cyberagents-exchange/pull/171) | submitted, under review | — |
| Fleet Immune System | [`shpbl-fleet-immune-system`](https://github.com/SweetKenneth/shpbl-fleet-immune-system) | in-repo | [#172](https://github.com/tenable/cyberagents-exchange/pull/172) | submitted, under review | — |
| Security Genome Reactor | [`shpbl-security-genome-reactor`](https://github.com/SweetKenneth/shpbl-security-genome-reactor) | in-repo | [#173](https://github.com/tenable/cyberagents-exchange/pull/173) | submitted, under review | — |
| Remediation Flight Recorder | [`shpbl-remediation-flight-recorder`](https://github.com/SweetKenneth/shpbl-remediation-flight-recorder) | in-repo | [#174](https://github.com/tenable/cyberagents-exchange/pull/174) | submitted, under review | — |
| Counterfactual Exposure Planner | [`shpbl-counterfactual-exposure-planner`](https://github.com/SweetKenneth/shpbl-counterfactual-exposure-planner) | in-repo | [#175](https://github.com/tenable/cyberagents-exchange/pull/175) | submitted, under review | — |
| Scan Coverage Autopilot | [`shpbl-scan-coverage-autopilot`](https://github.com/SweetKenneth/shpbl-scan-coverage-autopilot) | in-repo | [#176](https://github.com/tenable/cyberagents-exchange/pull/176) | submitted, under review | — |

<!-- TENABLE-TABLE:END -->

The table above is generated from [`TENABLE-LISTINGS.json`](TENABLE-LISTINGS.json) by
[`scripts/render-tenable-section.mjs`](scripts/render-tenable-section.mjs). A newly accepted
contribution is a one-row JSON edit plus `node scripts/render-tenable-section.mjs`.

## SHPBL and SHPBL.com

SHPBL is the system. SHPBL.com is where you use it: the free evaluation, the subscription that
runs the full gauntlet, and the Strategic Master Library itself. This repository is neither — it
is the explanation and the index.

## Repository map

See [`REPOSITORIES.md`](REPOSITORIES.md) for the full map.

| | |
| --- | --- |
| `shpbl` | this repository — the public front door |
| `shpbl-master` | the private canonical machine. Not published. |
| `shpbl-<capability>` | public inspectable outputs, individually licensed |
| `shpbl-spec-<capability>` | permanent clean-room specifications, cited by each implementation's `PROVENANCE.md` |
| `*-provenance`, `cmpsbl*`, `*-ascended` | research and historical provenance, preserved and unmaintained |

## Licence

The documentation in this repository is licensed
[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). Each linked implementation
repository carries its own licence; most are MIT. Nothing here licenses the SHPBL system
itself.

© Kenneth E. Sweet Jr.
