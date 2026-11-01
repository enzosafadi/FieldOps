# FieldOps — Data readiness and grounding requirements

Updated November 1, 2026. Application release remains v1.3.0. This document records requirements and distinguishes existing controls from planned AI features.

## Business purpose

Reduce active technician report composition and review time without reducing report accuracy or completeness. Compare typed and voice-assisted reports in a pilot; no measured savings or reporting timer is implemented.

Grounding means supplying relevant business information to a generative model. FieldOps currently transcribes live speech into a technician-reviewed preview; it does not retrieve business context for a generative model or automatically write reports.

## Five data-quality checks

| Check | Reporting requirement | Current evidence and remaining work |
| --- | --- | --- |
| Accuracy | Technician verifies equipment identifiers, diagnosis, quantities, measurements and dictated technical terms against the actual job. | Editable transcript and explicit insert/save exist. Automatic factual verification does not. |
| Relevance | Use only the selected repair, its client, equipment and linked issue history as report context. | recordServiceIssue rejects an issue from another repair; backup validation verifies repair/client links. Future model retrieval must enforce those filters and authorized access on the server. |
| Timeliness | Use the latest authoritative job state and current visit findings. Retain source update time and identify stale context before generation. | Versioned issue events retain timestamps and continuity. No shared source refresh or stale-data detector exists. Define freshness thresholds per source before a pilot; age alone is not proof that a record is wrong. |
| Cleanliness | Require complete fields, consistent units and status labels, unique identifiers and valid formats; resolve conflicting or duplicate source records before retrieval. | Existing required fields, enums, numeric bounds, identifier checks and history validation cover structure. Semantic deduplication and cross-source reconciliation remain planned. |
| Availability | Authorized technicians can obtain necessary context when needed; missing or inaccessible context must be visible. | Browser-local records and backup/recovery exist; speech failure has a typing fallback. Verified roles, shared storage and permission-aware retrieval remain planned. |

## Ownership and organization

For a future team pilot, the dispatcher owns client/job/appointment corrections and the technician owns current findings and report review. These are proposed operating responsibilities, not enforced roles. A system administrator must own permissions, retention and source refresh monitoring.

Use repairId and clientId as stable links, issueId and version for report history, UTC event timestamps and explicit units. Future retrieved documents need source ID, source version/update time, equipment association and access metadata. Keep older versions as history rather than treating them as the latest facts. Separate maintenance history from the fixed aggregate staffing simulation.

## Future grounding gate

Before introducing generative report drafting: verify authorized client/job linkage, retrieve relevant current context, flag missing/stale/conflicting sources, show provenance, and require technician review before save. Never substitute another client's data when context is missing. A missing source must lead to a clear request for information or a manual draft, not invented findings.

## Acceptance evidence

Existing tests/service-issues.test.mjs verifies cross-repair rejection, exact client linkage, version history and backup integrity; tests/workspace.test.mjs covers invalid backups and storage failure. Speech controller tests cover review-before-insertion and failure recovery. These checks establish structural safeguards, not factual accuracy, acoustic accuracy, production access isolation or end-to-end grounding. Future retrieval tests must include valid but irrelevant another-client records, outdated source versions, inconsistent units, unavailable sources and denied permissions.

Pilot measures: active composition plus review time, factual correction rate, completeness, technician acceptance and missing/stale-context frequency. Establish a baseline and acceptance targets before claiming improvement.
