# FieldOps v1.2.0 — Current Screenshot Evidence

Captured October 29, 2026 from the current v1.2.0 browser preview. All client/work records are simulated. The gallery represents different points in the same demonstration, not real service work.

| File | Actual evidence |
| --- | --- |
| SS1_FieldOps_v1_2_0_Technician_Home.jpg | Real credited technician imagery, repair-visit cards and an unresolved-emergency attention link after the first issue report |
| SS2_FieldOps_v1_2_0_Repair_Rescheduling.jpg | Original October 30 appointment, revised November 2 client request, reason/recorder/confirmation and the client's latest replacement impact |
| SS3_FieldOps_v1_2_0_Client_Issue_History.jpg | Two retained technician/impact versions: emergency intervention and urgent replacement requirement; CAD185 → CAD195 and Pending → Approved as recorded |

## Reproduction

For REP-001, reschedule October 30 09:00 to November 2 10:00 Toronto, requested by Client, reason Client unavailable, mandatory explanatory note, and recorded confirmation. Create a fictional Emergency intervention issue with work/findings/parts, Equipment unusable impact, 1,440-minute estimated downtime, CAD185 proposed cost and Pending approval. Home shows the unresolved emergency.

Append an Urgent replacement required update for the same issue, Waiting for parts, describing the follow-up work and changing the proposed estimate to CAD195 with Approved-as-recorded status. Earlier work, estimate and approval remain visible. Reload and inspect both journals. No actual client contact, authorization, parts order or repair occurs.

The photos are illustrative stock imagery; see ASSET-CREDITS.md. Screenshot files are under screenshots/v1.2.0/. Earlier v1.1.0 captures remain under screenshots/v1.1.0/ and their preserved release branch. v1.0.0 evidence remains preserved in its release branch.

---

# FieldOps v1.1.0 — Screenshot Evidence

Captured October 29, 2026 from the current local preview of the deployed product source. The light-gray/violet interface is the v1.1.0 design. No ChatGPT interface or real client data appears in these images.

| File | Actual state shown | Evidence |
| --- | --- | --- |
| SS1_FieldOps_v1_1_0_Overview.jpg | Baseline capacity scenario; existing workflow activity does not change fixed historical aggregates | 45 active workers, 712 accepted units, 89.6% first-pass acceptance, one risk |
| SS2_FieldOps_v1_1_0_Workflow_History.jpg | WORK-001 assigned → in progress → submitted → rework | Four retained steps; operator/time/reason/output and before/after values |
| SS3_FieldOps_v1_1_0_Scenario_Comparison.jpg | Lucia Martin assigned to P01, one QA block added to P02, P01 connectivity stress applied | 1,062 → 1,061 projected units; $4,072 modeled direct cost; $168 increase |

All screenshots are in `screenshots/v1.1.0/`. They illustrate different valid scenario states rather than a single continuous snapshot.

## Reproduce SS2

Open Workflows, set a demo operator name, select WORK-001, record In progress with notes, submit with output reference BATCH-014-v1, and return it for Rework with a review reason. Scroll to the complete workflow history. Earlier work and review entries remain present after reload.

## Reproduce SS3

Starting from baseline staffing, open Scenarios → Review candidates, assign Lucia Martin (FO-049) to Home routines (P01), close the investigation drawer, add one Retail QA block, and apply Home connectivity stress. The recorded interventions generate operational history.

These are simulated model outcomes, including an adverse net output change. They are not measured customer savings. Operator names are editable demo labels, and output references do not verify uploaded files.

## Historical evidence

The earlier six-screen gallery and presentation remain preserved in the exact v1.0.0 release branch. They depict the earlier design and should not be used as v1.1.0 screenshots. No historical screenshot was overwritten or relabeled.
