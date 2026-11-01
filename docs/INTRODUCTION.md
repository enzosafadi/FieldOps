# FieldOps — Introduction

Current product baseline: v1.3.0, reviewed November 1, 2026. Working browser prototype with simulated data; owner and pilot acceptance remain pending.

FieldOps helps repair and field-service teams keep the history of a client visit together. A technician or dispatcher can inspect appointments, record why a visit moved, retain the original booking, document work and urgent replacement requirements, and show what changed for the specific client.

The service demonstration contains three fictional repair orders and three technicians. It supports nine rescheduling reasons, 25 technician update types, retained client-linked issue versions, proposed CAD cost and downtime, recorded client notification/authorization, and validated JSON backups. Operator names and approval statuses are self-declared demonstration records.

Version 1.3.0 adds optional English/French browser dictation. Text enters an editable preview and only enters report fields after an explicit insertion. The technician reviews the report and saves it. Browser/provider support, permission and a secure context are required. The app stores no audio; the browser provider may process speech remotely. Actual microphone quality still needs device acceptance.

Earlier staffing analytics remain a separate deterministic simulation with 60 fictional workers and three data-collection projects. Those recording forecasts do not represent measured repair-company results or a connected service scheduling system.

The current product uses explicit rules and human review. Grounded generative reports, active reporting-time measurement, verified users and shared durable storage are documented future requirements, not implemented features.

For a prospective customer, the next commercial step is a scoped discovery and pilot: map the current dispatch/reporting workflow, establish a baseline, verify device usability, agree the required data integration and access controls, and evaluate a defined service team. No customer adoption, time savings, production readiness or purchase interest is claimed.

[Current capabilities and pilot readiness](PRODUCT-READINESS.md) · [Business case](BUSINESS-CASE.md) · [ADLC](ADLC.md)
