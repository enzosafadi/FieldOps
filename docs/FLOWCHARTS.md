# FieldOps v1.1.0 — Flowcharts

## ADLC — AI Development Lifecycle

```mermaid
flowchart TD
    A["Business problem"] --> B["Requirements and acceptance criteria"]
    B --> C["Design and build"]
    C --> D["Test and inspect"]
    D --> E{"Meets the requirements?"}
    E -->|No| C
    E -->|Yes| F["Document changes and release version"]
    F --> G["Owner review"]
    G --> H{"Accepted?"}
    H -->|Changes needed| B
    H -->|Yes| I["Operate and monitor"]
    I --> B
```

Current position: v1.1.0 has passed its recorded checks and been deployed owner-private. Owner review is pending. Commercial operation and monitoring are future stages, not completed milestones. See [ADLC](ADLC.md) for the requirements/evidence matrix and limitations.

## Work-item workflow

```mermaid
flowchart TD
    A["Assign qualified owner"] --> B["Record work in progress"]
    B --> C["Submit output reference and notes"]
    C --> D{"Review outcome"}
    D -->|Accept| E["Accepted"]
    D -->|Reject| F["Rejected"]
    D -->|Rework| G["Record corrections required"]
    G --> B
```

Each recorded transition retains operator, timestamp, work/project IDs, notes and before/after values. Previous steps remain visible after rework. Operator identity and history are browser-local demo data; authenticated shared retention is not implemented.
