# Audit Translation
Audit Changes are written to the database by a trigger function (see audit.if_Modified() ).

When the record is written to the database, a queue entry is also added. The translated_audit_queue entry represents the lifecycle of translating an audit.

## Business Logic

The logic behind translating the code lives in the translatedaudit package. This allows for separation of responsibilities.

Each audit change is translated one at a time, resulting in one translated audit entry and 0 or more translated audit fields. 

It relies on the shared mappings exported from the front end to correctly translate the audit entries.

## Job

Currently, the translation is handled through a series of [faktory jobs](../worker/jobs.md#audit-translation). Since the core business logic is in a separate package, this could be moved to a micro service or other solution at a later point in time.
