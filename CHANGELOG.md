# Changelog

Product versions describe the FieldOps application. They are separate from Sites deployment version numbers, JSON backup format version 1, and internal workspace schema version 2.

## 1.2.0 — October 29, 2026

### Added

- Technician Home with sourced/credited repair photographs, upcoming visits and unresolved-emergency attention links.
- Repair rescheduling with nine reasons, requester/recorder, mandatory notes, original/revised Toronto appointments and client confirmation.
- Three fictional repair orders, stable client links and modeled technician collision/DST checks.
- Twenty-five technician work/issue update types, including emergency intervention, urgent replacement, diagnostics, parts, repair outcomes and follow-up.
- Versioned client-linked work/findings/parts/next-action records and per-issue service impact, downtime, proposed CAD cost, recorded notification/authorization and follow-up.
- Validated migration and backup of complete service records; staffing reset retains them.
- Eight rescheduling and eight service-issue test cases; current screenshots, ADLC, release notes, guides, asset credits and flowchart.

### Preserved and limited

v1.1.0 and v1.0.0 baselines remain intact. Previous operational views remain available. Service records are a separate local field-service prototype; no verified shared users, arbitrary real order intake, attachments, billing, parts purchasing, client messaging or protected server retention is claimed. Recording an issue has no automatic financial or appointment effect.

## 1.1.0 — October 29, 2026

Documentation/media follow-up: refreshed the public README with authentic SS1–SS3 captures, explicit reproduction states, ADLC and work-item flowcharts, and clear links to historical v1.0.0 evidence. Application behavior and product version remain unchanged.

### Added

- Workflows workspace with individually identified deliverables, project/worker ownership, controlled stage transitions and terminal acceptance/rejection.
- A complete per-item sequence of assignment, execution, submission, review and rework. Required notes, output references, operator attribution, timestamps and before/after snapshots are retained for every recorded work step.
- Structured history for staffing assignments, reserve QA allocations, incident transitions and connectivity interventions; project/operator filters and full-history CSV export.
- Validated JSON workspace backup/restore, explicit restore confirmation, damaged-data preservation, visible storage-failure messages, and reset confirmation with a backup option.
- ADLC traceability, documented previous/current releases, and automated workflow/recovery validation.

### Changed

- White/green interface replaced by light gray/violet across navigation, cards, controls, progress indicators and charts; semantic warnings remain amber/red.
- Staffing-scenario reset retains work records and earlier decisions, recording operational changes instead of deleting history.
- Existing browser saves are validated and migrated without inventing structured actions from earlier plain-text logs.
- CSV output neutralizes spreadsheet-formula prefixes in text fields.

### Preserved

- Existing workforce eligibility rules, QA limits, deterministic capacity model, fixed simulated historical delivery snapshot and private hosting audience.
- v1.0.0 source snapshots in each repository's `releases/v1.0.0` branch, identified by exact commits in `docs/releases/V1.0.0.md`.

### Known limits

Browser-local simulated prototype. Operator names are self-declared, no shared database or role enforcement exists, and history is not tamper-proof. Restoring a backup replaces the scenario/history with that backup; export the current workspace first. Individual work records do not reconcile into the aggregate historical delivery snapshot. Output references do not upload or verify files. Full mobile viewport testing remains pending.

## 1.0.0 — October 28, 2026

Initial six-workspace portfolio prototype: Overview, Workforce, Quality, Incidents, Scenarios and Reports. Included 60 fictional workers, three project snapshots, eligibility checks, reserve staffing/QA, connectivity stress, incident coordination, plain-text intervention history, browser-local persistence, CSV reporting, documentation and presentation assets. Commercial team deployment was outside scope.
