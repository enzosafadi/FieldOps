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
