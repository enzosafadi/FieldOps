# FieldOps v1.2.0 — Flowcharts

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

Current position: v1.2.0 has passed its recorded checks and been deployed owner-private. Owner review is pending. Commercial operation and monitoring are future stages, not completed milestones. See [ADLC](ADLC.md) for the requirements/evidence matrix and limitations.

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


## Repair changes and client ramifications

```mermaid
flowchart TD
    A["Open the client's repair"] --> B{"Appointment changes?"}
    B -->|Yes| C["Record reason, requester and revised slot"]
    C --> D["Retain original appointment and change history"]
    B -->|No| E["Record technician work and findings"]
    D --> E
    E --> F["Record priority, parts and client impact"]
    F --> G["Append client-linked issue version"]
    G --> H{"Unresolved emergency?"}
    H -->|Yes| I["Show Home attention link"]
    H -->|No| J["Review work and follow-up"]
    I --> J
    J --> E
```

Client impact includes the service consequence, downtime estimate, proposed additional CAD cost, recorded notification/authorization and next action. Recording these facts does not automatically contact, charge, purchase for, or reschedule the client. The appointment and issue forms are separate explicit actions.
