# FieldOps — Business Case

Current scope: v1.3.0 technician-work and client-impact prototype. Reviewed November 1, 2026. All operational records and outcomes are simulated.

## Business problem

A repair appointment can move because the client is unavailable, access fails, parts are delayed or the previous job overruns. Technicians then record diagnosis, work, urgent replacements and proposed costs. A dispatcher and client need a consistent account of the original plan, the reason for each change, what work occurred and the next agreed action. Disconnected notes can require clarification and make follow-up harder.

This is the problem hypothesis behind FieldOps. It does not prove that a particular repair company has these problems or that its existing software lacks these capabilities.

## Users and value hypotheses

| User | Supported decision | Value to test in a pilot |
| --- | --- | --- |
| Technician | What should I record about this job and the client's consequences? | Less composition and correction time without losing required facts |
| Dispatcher/service manager | Why did the appointment move and what needs follow-up? | Less reconstruction of visit history and fewer clarification handoffs |
| Client-service team | What changed for this specific client? | Clearer service, downtime, proposed-cost and approval records |
| Operations owner | Can this fit the team's existing system and device workflow? | An acceptable integrated workflow at an agreed implementation/support cost |

## Implemented evidence

- Technician home with three fictional orders and stock repair photography.
- Nine explicit rescheduling reasons, original/revised Toronto appointments, requester, recorder, notes and confirmation.
- Twenty-five work/issue update types with client-linked retained versions.
- Explicit work, diagnosis, parts, next action, urgency, client impact, downtime, proposed CAD cost and reported notification/authorization.
- Optional English/French browser dictation with review before insertion and explicit save. Actual microphone acceptance remains pending.
- Browser-local storage, validated JSON recovery and concise event exports. Identity remains self-declared.

A November 1 browser check retained the October 30 booking after moving REP-001 to November 3 at 10:00 Toronto. Manually entered fictional preview text entered the work field after review and then saved as a client-linked issue with a CAD185 proposed estimate and pending authorization. No real repair, message, approval, charge or speech transcription occurred.

## Commercial options

| Option | When it may fit | Constraint |
| --- | --- | --- |
| Improve the existing service platform configuration | Current software already supports the required history and reports | Verify actual workflow and adoption before proposing another application |
| Add a focused technician reporting/history layer | The buyer wants a specific gap addressed around its current dispatch system | Requires integration, verified users and clear data ownership |
| Replace the service-management platform | The buyer explicitly wants a broad replacement | Outside this prototype's scope; would need order intake, dispatch, inventory, billing and production controls |

The recommended first offer is a focused paid pilot or custom module after discovery. Interest, budget, buying authority and deployment requirements must be confirmed with each prospect. Avoid promising replacement of an established field-service platform.

## Measurement and economics

Establish a typed-report baseline and compare similar jobs by language and complexity. Include review/correction time, report completeness, factual corrections, dispatcher clarification requests, rebooking reasons and technician acceptance. Agree targets with the buyer before a pilot. No target percentage, measured time savings or ROI is claimed.

Calculate pilot net value from verified labor time released and agreed avoided administrative costs, less implementation, integration, hosting, speech-provider charges, support and human review costs. Prevent double counting. Benefits remain hypothetical until actual measurements support them.

## Pilot prerequisites and decision gate

Current three-order, browser-local data is a demonstration. A real team pilot needs actual order intake, authenticated roles, server-side client isolation, durable shared records and concurrency handling. Validate English/French microphones and mobile devices, backup/restore, data retention and the buyer's integrations. The buyer must approve collection and use of any real customer data. See PRODUCT-READINESS.md and the AI strategy document for the full gate.

## Historical staffing case

The original v1.0 example modeled 60 recording workers and three collection projects. A collector plus QA intervention changed projected retail output from 320 to 341 units and modeled remaining-window cost by USD168. Those deterministic recording-simulation figures are historical portfolio evidence. They do not establish repair-service productivity, current CAD pricing, customer savings or current commercial readiness. Earlier source, media and closeout remain historical records.
