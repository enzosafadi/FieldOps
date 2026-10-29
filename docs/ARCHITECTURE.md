# FieldOps — Architecture

## Implemented application

| Layer | Implementation |
| --- | --- |
| UI | Buildless HTML, CSS and JavaScript ES modules, six workspaces |
| Data | Deterministic generator for 60 fictional workers; three project snapshots; three initial incidents; seven daily aggregate chart values |
| Operations model | Pure calculations in `dist/model.mjs` for collection, QA, projected accepted delivery and direct cost |
| Actions | Availability and qualification validation, one assignment per shared shift, reserve QA limits, incident transitions and audit history |
| Persistence | Versioned browser local storage; scenario reset |
| Reporting | Downloadable CSV and print-ready client summary |
| Tests | Node.js assertions for operational constraints and scenario behavior |
| Hosting | Static assets; no application server or shared database |

## Calculation rules

All projects share the same simulated snapshot (2026-10-28 14:00 UTC) and deadline (18:00 UTC). Collection capacity excludes offline and absent workers. Connectivity stress applies a 35% reduction to Home routines collection capacity.

Let r = first-pass accepted / completed first reviews, C = active collection units/hour × 4 hours, B = submissions awaiting review, Q = current review units/hour × 4 hours.

Projected additional accepted = min(floor(C × r) + floor(B × r), floor(Q × r)).

Projected accepted = historical accepted + projected additional accepted. Shortfall = max(0, commitment − projected accepted). Projections may exceed a target; target attainment does not cap physical output.

The model assumes current rates and observed acceptance continue. It does not model a stochastic timeline, upload latency or correlated quality failures. Historical accepted units, first-review counts and first-pass acceptance do not change when a manager allocates future capacity.

Remaining-window direct cost = active assigned collection hourly rates × 4 + added QA review capacity/hour × 4 × $3 per unit. One reserve QA block adds 6 units/hour and costs $72 over the window, with a maximum of two blocks per project. Existing QA cost and overhead are excluded. No profit or realized ROI is inferred.

## Delivery scope

The initial 90-day SQL/Python simulation was a planning direction. This release delivers a focused, deterministic browser prototype instead. A relational backend, historical event generator, multiple shifts, probabilistic forecasting and real integrations remain future extensions.

## Repository structure

`dist/` contains the reviewed runnable demo; `tests/` contains model validation; `docs/` contains the business case, introduction, validation and screenshots. The hosting identity is maintained in the Site source, outside the public portfolio snapshot.

## Workflow history upgrade — October 29, 2026

The Workflows workspace adds individually identified deliverables, qualified owners, controlled stage transitions, required work/review notes, output references, and complete per-item timelines. `workflow.mjs` implements the lifecycle and structured change events; `workflow-ui.mjs` renders the record explorer. Stages: Assigned → In progress → Submitted → Accepted, Rework, or Rejected. Rework returns through In progress and Submitted; previous submissions and review reasons remain in history.

Each event includes a sequential identifier, UTC timestamp, self-declared operator name, entity type/ID, project, action, note, and before/after snapshots. Worker assignments, QA allocations, incident status changes and connectivity interventions are also recorded. Staffing-scenario reset retains work items and historical decisions and records resulting operational changes. Workflow records illustrate individual lifecycle tracking; they do not retroactively change the aggregate simulated delivery snapshot.

`workspace.mjs` validates local state and JSON backups before use. Backups include structured workflow history. Validation rejects broken event sequences and a current work record that differs from its final historical snapshot. Invalid browser data is preserved for recovery and not silently overwritten. Restore requires explicit confirmation; download a current backup before replacing a scenario. CSV exports neutralize spreadsheet formula prefixes.

Existing browser saves migrate to three clearly labeled simulated starting work records. Earlier plain-text activity is retained, but historical structured events are not invented. The operator name is editable demo attribution, not authentication. Browser state and imported backups can be edited: history is not a tamper-proof compliance audit. Shared persistence, verified identities, permissions, server timestamps and immutable retention are still required for real team use.
