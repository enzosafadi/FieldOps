# FieldOps — AI Development Lifecycle (ADLC)

Current product release: **v1.2.0**. Updated October 29, 2026. Working browser prototype; owner acceptance pending.

## 1. Human requirements and business scope

The owner requested FieldOps be improved first, with other applications deferred. v1.1.0 introduced per-deliverable workflow history and a gray/violet interface. The subsequent v1.2.0 requirements add repair rescheduling, technician-centered Home imagery, an expanded work/issue update list, emergencies/urgent replacements, and documented ramifications for the specific client.

The owner supplies requirements and acceptance. AI assistance inspected source, implemented modules, sourced/inspected imagery, wrote documentation, executed checks and prepared release assets. FieldOps itself uses deterministic rules; it does not run an autonomous AI model. Requests establish scope, not actual customer demand or measured business benefits.

## 2. Version and evidence control

Product versions are independent of Site deployment numbers, backup format version 1 and internal workspace schema version 2. VERSION and the UI now identify v1.2.0. The exact previous application baselines remain in releases/v1.0.0 and releases/v1.1.0. Earlier galleries and presentations retain their historical identities. Current SS1–SS3 are in screenshots/v1.2.0; reproduction details distinguish the simulated states shown.

No old screenshot is overwritten or relabeled as new evidence. CHANGELOG.md and releases/V1.2.0.md record additions and limitations. GitHub source is pushed before deploying the matching archive; preserve owner-private hosting.

## 3. Requirements and validation traceability

| ID | Owner requirement | Implemented evidence | Validation/status |
| --- | --- | --- | --- |
| F-01 | Per-work workflow history | Identified deliverables, controlled steps, notes/output and history | Existing lifecycle/rework checks pass |
| F-02 | Track what the user did | Structured operator/time/record before/after events | Attribution checked; identity is self-declared |
| F-03 | Gray/violet interface | Shared theme and real screenshots | Desktop inspected; full mobile viewport QA pending |
| F-04 | Preserve releases and ADLC | Version file, release branches, changelog, this record | v1.0/v1.1 retained; v1.2 documented |
| F-05 | Client repair rescheduling with reasons | Nine reasons, requester/recorder, original/revised slots, notes/confirmation | Eight repair cases and browser scenario passed |
| F-06 | Technician-centered homepage | Two sourced repair photographs, visit cards and emergency attention links | Images inspected and rendered in browser |
| F-07 | Expanded technician updates | 25 update types, work, findings, parts and next action | Expanded-list and record tests passed |
| F-08 | Emergencies and urgent replacements | Priority/status, replacement requirements, unresolved-emergency Home flag | Tested emergency/client impact; browser flag visible |
| F-09 | Document ramifications for each client | Immutable client link, per-issue impact, downtime, proposed CAD costs, notification/authorization and follow-up | Client isolation/version/estimate tests; browser two-version history passed |
| F-10 | Retain previous work | Append-only UI versions, validated backups, staffing-reset preservation | Continuity/migration/backup tests passed |

## 4. Design decisions and alternatives

Retain the static ES-module prototype and previous operational views. Add a focused field-service extension with three fictional repair orders and three technicians; do not pretend the prior recording workforce model is already a fully integrated repair company system.

Model rescheduling and technician issue updates as separate explicit operations. An emergency or return-visit note must not silently reschedule the client, order parts, spend money or send a message. Store original appointments and versioned impact/work records rather than overwriting previous notes. Require a reason and request notes, and explicit client impact for urgent/emergency reports.

Treat CAD costs as proposed per-issue estimates, not invoice totals. Client-informed and authorization fields reflect the operator's report, not verified signatures or automatically sent communications. Aggregate staffing forecasts remain separate fixed simulations.

Use authentic licensed stock imagery with credits, not a fictional claim that the pictured person is the assigned technician. Source/visual inspection and license information are in ASSET-CREDITS.md.

## 5. Validation actually performed

The Node test runner reports **30 passing entries**: the original model assertion script plus 29 feature cases. New coverage includes scheduling conflicts, past/invalid/unchanged times, Toronto DST gaps/overlaps, reason/requester validation, repeated reschedules, client isolation, issue versions, retained earlier estimates/approval status, invalid fields, migration and absence of automatic financial/scheduling effects.

Browser checks confirmed migration from existing v1.1 data; rendered technician Home images; retained original October 30 and revised November 2 booking; creation of an emergency linked to CLIENT-01; unresolved-emergency Home attention; and a later urgent replacement update retaining CAD185/Pending and CAD195/Approved-as-recorded records. Histories survived reload. Current SS1–SS3 were visually inspected. Existing workflow/recovery browser evidence remains in the v1.1 documentation.

No real customer, attachment, live parts system, shared backend, real concurrent-user or full mobile viewport verification was performed.

## 6. Data and risk boundaries

All clients, technicians, equipment records, estimates and outcomes are fictional. Editable local operator names are not authentication. Browser storage and imported JSON are user-controlled and are not tamper-proof, shared or authoritative. Clearing browser data or replacing a backup can lose/replace history; export first. Staffing reset retains service records.

Issue priorities are operator-entered labels. An emergency banner is an application attention cue, not a dispatched emergency response or monitoring service. Recorded approvals do not authorize the app to buy, bill or contact anyone. Proposed estimates are not summed automatically. Full findings and impact history are in the client journal/JSON; the generic workflow CSV contains concise summaries.

## 7. Release and next gate

The existing public/private repositories retain source, version notes and evidence. Current deployment must use its exact pushed source/archive and retain owner-private access. Owner acceptance of the repair and technician-work behavior remains pending.

Before a real customer pilot: implement verified roles and client isolation in shared storage, server timestamps/concurrency/retention, validated real order intake, attachments when required, scheduling availability/travel rules, approved billing/inventory integrations, and task-to-delivery reconciliation. No other project is upgraded as part of this release.

[Lifecycle and repair/client-impact flowcharts](FLOWCHARTS.md) · [Usage and scope](REPAIRS-AND-CLIENT-IMPACT.md) · [Validation](VALIDATION.md)
