# FieldOps — AI Development Lifecycle (ADLC)

Current product release: **v1.1.0**. Updated October 29, 2026. This document records AI-assisted requirements, engineering decisions, validation and release evidence. It does not imply the application itself uses AI inference. FieldOps uses deterministic rules; staffing decisions are human-directed.

## 1. Business problem and human ownership

The project owner defines scope and acceptance. The current goal is to strengthen FieldOps before proceeding to other applications. Operations teams need to understand each deliverable's previous handling and current state, including who performed work, what changed, and why a review resulted in acceptance, rejection or rework. The owner explicitly required version documentation and a light-gray/violet interface.

AI assistance was used to inspect existing source, propose and implement modules, write documentation, run tests and prepare the release. Owner requests are treated as requirements, not evidence of actual customer demand or achieved business results. Owner acceptance remains pending.

## 2. Baselines and change control

v1.0.0 is documented in releases/V1.0.0.md with exact public/private source commits and preserved `releases/v1.0.0` branches. v1.1.0 is the subsequent product release. CHANGELOG.md, VERSION and releases/V1.1.0.md describe its implemented scope. Site deployment numbers, backup format versions and internal state schema numbers are tracked separately.

Existing prototype documents and presentation assets remain historical evidence for their original scope. New release documentation supersedes older current-state descriptions without rewriting what existed previously. Do not silently relabel an old screenshot, test result or presentation as evidence for a newer version.

## 3. Requirements-to-evidence traceability

| ID | Owner requirement | Implementation | Verification / status |
| --- | --- | --- | --- |
| F-01 | History for each product/deliverable | Identified work records; dedicated per-item timeline | Work creation and full lifecycle tests passed |
| F-02 | Preserve the workflow taken, beyond a text log | Controlled transitions, required notes/output references, immutable-by-UI previous step snapshots | Rework/resubmission/acceptance and sequence-integrity tests passed |
| F-03 | Track what each user did | Self-declared operator retained on structured work/operational events | Attribution tests and browser operator/step checks passed; verified identity NOT implemented |
| F-04 | Track operational changes | Worker, QA, incident and connectivity before/after events | Four action types tested; record/project links retained |
| F-05 | Light gray and violet | Shared theme, navigation/cards/actions/charts | Desktop visual inspection completed; full mobile viewport QA pending |
| F-06 | Safer retained work | Validated backups, corruption preservation, restore/reset confirmation; staffing reset retains workflow | Recovery/storage tests and browser round trip passed |
| F-07 | Document earlier/new release | Exact v1.0.0 snapshots, version file, changelog and release notes | Repository/source documentation delivered with v1.1.0 |
| F-08 | Document ADLC and stay on FieldOps first | This lifecycle record; no other project modified | Scope constrained to FieldOps |

## 4. Design decisions and assumptions

- Build on the existing static ES-module prototype instead of claiming a shared backend exists.
- Model individual work separately from fixed aggregate historical delivery metrics; task completion must not inflate simulated accepted totals.
- Require explicit work/review notes and an output reference for submission. Output references identify a deliverable; they do not verify a file exists.
- Reject invalid stage jumps. Rework keeps earlier submission/review snapshots.
- Keep old plain-text actions and seed clearly labeled starting records when migrating old saves. Do not invent earlier operator identities or workflows.
- Validate restored record histories against their final work state. Escape displayed text and neutralize formula-like CSV cells.
- Use editable operator names only as demo attribution. Do not label them authenticated users or claim tamper-proof retention.

## 5. Data, risks and controls

All workers, clients, work examples, costs and outcomes are simulated. Browser-local storage and downloaded JSON are user-controlled; they are not an authoritative multiuser database. Backup restore can replace the current history, so the UI requires confirmation and offers export. Clearing browser data can destroy unsaved history. Staffing reset retains work/history and records operational changes.

Before real customer use, implement verified identities, organization/role isolation, durable shared storage, server timestamps and permissions, concurrent-update controls, retention and restore policies, independent event integrity, real input validation, and task-to-delivery reconciliation. Determine retention requirements from the actual customer's obligations rather than inventing a universal compliance promise.

## 6. Validation actually performed

Original model assertion suite: passed. Node test-runner: 13 cases passed across workspace.test.mjs and workflow.test.mjs. Coverage includes backup round trips, invalid/oversized files, damaged-data preservation, blocked/full storage, CSV formula escaping, complete work lifecycle/rework, attribution, operational snapshots, history consistency and legacy migration.

Browser preview: JSON download, file chooser, restore preview/confirmation, restored persistence, reset cancellation, operator selection, execution, submitted output, return for rework, four-step timeline after reload and CSV history download passed. Desktop theme inspected. No customer dataset, production backend, true concurrent users or full mobile viewport validation was performed. VALIDATION.md records details.

## 7. Release, review and next gate

Source is maintained in the existing GitHub repositories; preserve public/private visibility and the hosted app's owner-private audience. Source must be pushed before deploying its matching archive. Release evidence consists of the versioned source commit, preserved v1.0.0 baseline, current notes, actual validation and the matching deployment result.

The owner must review the workflow behavior and visual design. This is an implemented prototype upgrade, not commercial acceptance. The next engineering gate is shared verified-user persistence and protected workflow retention, followed by business-data reconciliation and a customer-specific pilot. Other applications remain outside this release.
