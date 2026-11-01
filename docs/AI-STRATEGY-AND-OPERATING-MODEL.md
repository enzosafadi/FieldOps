# FieldOps — AI Strategy and Operating Model

Document status: consolidated requirements and proposed operating design.  
Updated: November 1, 2026. Application baseline: v1.3.0.  
Scope: technician reporting, data readiness and the lifecycle of a future reporting agent.

## 1. Business outcome and scope

Reduce the time technicians spend composing and reviewing service reports while maintaining factual accuracy and completeness. The assistant must fit the technician's workflow and add value after correction and review time are included.

The owner already established this outcome, English/French voice input, technician review, reliable current data and reporting measurement during requirements discussions. This document consolidates those requirements; it does not restart requirements discovery or establish measured results.

| Capability | Status |
| --- | --- |
| Live English/French dictation, editable preview, explicit insertion and report save | Implemented in v1.3.0; actual microphone quality remains pending device acceptance |
| Client/job-linked work records and retained issue versions | Implemented in the browser-local prototype |
| Five data-quality requirements | Documented in [Data readiness](DATA-READINESS.md); some structural checks exist |
| Active reporting-time measurement and blocker tracking | Required for a pilot; not implemented |
| Automatic structured report drafting grounded in job records/manuals | Proposed; not implemented |
| Shared verified-user access, server permissions and durable team storage | Required before real team use; not implemented |

The existing staffing analytics remain a separate deterministic simulation. No autonomous purchasing, billing, client messaging or appointment change is authorized by generating a report.

## 2. Success measures and acceptance

Compare equivalent typed and voice-assisted tasks using fictional or approved pilot data. Record language, job complexity and input method so differences are interpretable.

| Measure | Definition | Acceptance approach |
| --- | --- | --- |
| Active reporting time | Composition plus transcript/report review and correction time; exclude unrelated idle periods | Establish a typed baseline, then agree a reduction target before the pilot |
| Factual correction rate | Incorrect factual items needing correction divided by factual items reviewed | Compare with baseline; do not trade accuracy for speed |
| Completeness | Completed applicable required report elements divided by applicable elements | Required fields and client-impact details must remain complete |
| User acceptance | Technician assessment of usefulness and workflow fit | Record feedback and reasons for abandoning dictation |
| Reporting blockers | User-reported language, vocabulary, noise, connectivity, typing difficulty or other cause | Offer selectable reasons with optional notes; a timer alone cannot infer the cause |
| Future retrieval quality | Relevant/current sources retrieved, missing context and denied-access behavior | Test provenance, freshness and client isolation before enabling generative drafting |

No baseline, numerical target, achieved savings or operational KPI dashboard is claimed. Live dictation is the current option; uploaded-recording transcription remains outside the implemented feature.

## 3. Cloud setup and platform selection

Current deployment is an owner-private static Site. Business records are browser-local; browser speech recognition may use its provider's remote service. FieldOps stores no audio and currently requires no Azure credentials.

For a team pilot, select infrastructure against the agreed workflow, permissions, language quality, reliability and cost requirements. Evaluate extending a suitable prebuilt agent before custom development. Compare browser dictation with a managed speech service using representative devices, vocabulary and background noise. An Azure platform or provider has not been selected or provisioned.

A future cloud foundation must define environments for development/test/production, deployment identity, resource organization, networking, secret management, region requirements, storage, backup/restore, monitoring and spending controls. Record the selected architecture and alternatives in an architecture decision record before provisioning.

## 4. Reliable data and grounding

Apply [accuracy, relevance, timeliness, cleanliness and availability](DATA-READINESS.md). Link clients, jobs, equipment and issue history through stable IDs. Separate identical names from duplicate identities; define a review process for suspected duplicate client records.

For future generative reports, retrieve only approved context for the selected job and authorized client. Store source identity, version, update time, equipment association and access metadata. Establish source-specific freshness rules, retain historical versions, and flag missing or conflicting context instead of inventing findings. A timestamp proves when a record changed, not that its contents are true.

The technician verifies observations and technical terms. Proposed data owners: dispatcher for client/job/appointment corrections, technician for findings and report review, administrator for source access and refresh operations. These roles are not currently enforced.

## 5. Access boundaries and human control

| Boundary | Required behavior | Current position |
| --- | --- | --- |
| Client/job context | Prevent records from another job/client entering the report | Structural client/job validation exists; server authorization remains future work |
| User identity | Authenticate users and grant only the access their role needs | Operator names are self-declared demo attribution |
| Voice capture | Start explicitly, show status, allow stop, disclose provider processing | Implemented browser controls; device/provider acceptance pending |
| Report approval | Technician reviews text before explicitly saving | Implemented preview/insert/save; no automated factual sign-off |
| External actions | Require a separately authorized workflow for messages, bookings, orders or charges | Reporting performs none of these automatically |
| Retention | Define approved retention, deletion, recovery and access logging | Browser backup exists; protected shared retention remains future work |

Review hosting access separately from data authorization. Owner-private hosting does not turn editable local records into a secure multiuser database.

## 6. Development, testing and release

Use modular components so transcription, retrieval, drafting and storage can evolve independently. Keep typing as a fallback. For future model use, version prompts, model configuration, retrieval rules and evaluation fixtures alongside application changes.

Develop on isolated changes, run relevant regression checks, record evidence, retain release history, and deploy the matching reviewed source. Product version remains v1.3.0 for this documentation-only consolidation.

Existing evidence: 36 automated test entries passed for v1.3.0, including six speech controller cases. Speech browser integration could not run because the test browser download failed. Real microphone quality, noisy environments, accents and full mobile behavior require manual acceptance.

Before a team pilot, test actual English/French devices, permission denial, unavailable speech service, interrupted input, correction time, save/restore and user workflow. Before generative drafting, additionally test wrong-client sources, obsolete manuals, missing context, source instructions that attempt to override agent rules, access denial, unsupported claims and technician approval. See [Validation](VALIDATION.md).

## 7. Monitoring, costs and incident handling

Monitor reporting quality and time, transcription/retrieval failures, latency, user overrides, provider availability and cost per completed approved report. Avoid collecting unnecessary client text/audio in telemetry. Define alerts and escalation owners before production.

Budget for speech processing, model requests, retrieval/indexing, storage, hosting and operational support. Include failed/retried requests and human review time. Set approved budgets, quotas and alerts; stop or degrade to typed/manual reporting when limits or reliability thresholds are reached. No paid service or spending commitment is created by this plan.

The operator should be able to disable the failing assistant component, preserve already saved records, use manual reporting, investigate the incident and restore a known-good version. Assign named support owners and numeric service thresholds before a pilot; these are currently unassigned.

## 8. Retirement and lifecycle ownership

Retire an agent, model or integration when superseded, unsupported, persistently unreliable, unused or no longer cost-effective. Inventory dependencies and affected users; export required records, apply approved retention/deletion rules, disable triggers, revoke service credentials, remove obsolete indexes and stop billing resources. Retain release/evaluation evidence and keep manual reporting available during transition.

The project owner accepts business scope and pilot targets. Proposed future operating roles are technician reviewer, dispatch/data owner, administrator/security owner and application operator. Assign actual people and escalation coverage before real deployment.

## 9. Roadmap and decision gates

| Gate | Completion evidence |
| --- | --- |
| Current prototype acceptance | Real-device dictation trial and technician review of workflow fit |
| Measurement readiness | Active-time measurement, blocker capture, typed baseline and agreed targets |
| Team foundation | Verified identities, authorized shared data, recovery, retention and cost controls |
| Grounded drafting readiness | Approved sources, version/freshness metadata, scoped retrieval and evaluation evidence |
| Production readiness | Named owners, monitoring, incident/rollback process, budget and acceptance results |
| Ongoing operation / retirement | Periodic quality/cost review and documented disable/replace/retire decisions |

Each gate requires evidence; documenting a requirement does not implement it.

## Related records

[ADLC](ADLC.md) · [Data readiness](DATA-READINESS.md) · [Voice reporting](VOICE-REPORTING.md) · [Architecture](ARCHITECTURE.md) · [Validation](VALIDATION.md) · [Release v1.3.0](releases/V1.3.0.md)
