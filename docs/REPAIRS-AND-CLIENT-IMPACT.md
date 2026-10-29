# FieldOps v1.2.0 — Repairs, Technician Work & Client Impact

## Technician home

Home is the initial screen. It features real repair-technician photography, upcoming fictional repair visits, pending confirmation and appointment-change counts. Unresolved emergency cases produce an attention banner linking directly to the affected client's repair record. The photograph is illustrative stock imagery, not the assigned fictional technician. See ASSET-CREDITS.md.

## Rescheduling

Select a repair under Repairs, enter a revised Toronto appointment and technician, choose who requested it and why, describe the request/follow-up, and record whether the client confirmed. The original appointment remains visible. Each change retains requester, recorder, UTC event timestamp, reason, notes, and before/after appointment, technician and confirmation.

Reasons: client unavailable; client requested another time; no property access; parts/materials delayed; technician unavailable; previous job overran; unsafe conditions/weather; repair scope changed; Other. Notes are mandatory, including Other. Past, unchanged and conflicting technician windows are rejected. Ambiguous/nonexistent Toronto daylight-saving times are rejected. Conflict checks apply to the three modeled repair orders; they do not establish whole-business availability or account for travel time.

## Expanded technician issue updates

Create an issue for the selected repair/client or append to an existing one. The 25 types cover:

- Visit started, initial inspection, diagnosis in progress, fault identified, diagnostic test completed.
- Repair started, completed or unsuccessful; preventive maintenance; quality check completed; visit closed.
- Safety concern, emergency intervention, urgent replacement required, replacement recommended, equipment taken out of service, temporary repair.
- Part ordered, part unavailable, additional damage discovered, warranty review.
- Client approval requested, client declined work, return visit required, waiting for access.

Each update records work performed, findings, required parts/replacement, next action, severity (Normal/Urgent/Emergency) and current issue status (Open/In progress/Waiting for parts/Waiting for client/Monitoring/Resolved).

## Ramifications for the specific client

Every issue/update retains its repair ID and immutable client link, primary service impact, narrative impact details, estimated downtime, proposed additional cost in CAD, client-informed flag, recorded authorization status and optional Toronto follow-up deadline. Urgent/emergency updates require an explicit client impact. The client record shows the latest issue state and a versioned journal retaining earlier work, estimates, approval statuses, time and operator.

Estimates are per issue, not additive invoice totals. A technician's recorded approval is not a verified signature or transaction. Recording an issue does not automatically order parts, purchase replacements, charge the client, send messages, approve work or change the appointment. Rescheduling is an explicit separate operation.

## History, backups and scope

Appointment changes and issue summaries also enter the structured operations history. JSON backups retain the complete client-linked records; the generic workflow CSV exports concise issue event summaries, not every long-form finding. Full work/impact detail remains in the client journal and JSON backup. Staffing reset retains repairs, issue cases and prior versions.

The release adds a focused field-service demonstration alongside the earlier recording/staffing simulation. The three repair orders and three technicians are fictional fixtures. There is no creation/import interface for arbitrary real customers or repair orders yet. User identities are self-declared, storage is browser-local, and records are editable outside the application. Shared verified accounts, protected retention, attachments, billing, inventory, automated client communications and live integrations remain future work.
