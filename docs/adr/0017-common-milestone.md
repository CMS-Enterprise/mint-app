### Reasoning

- The goal with this ADR is to plan out the ability for admins to create/edit/archive common milestones. In order to do
  this, there are a few migrations needed. An initial plan is outlined below (WIP)

### V1

- archived, not delete
- SQL migrations
  - create UUID column for common milestones
  - set that new UUID column as the primary key column
  - create `created_by`, `created_dts`, `modified_by`, `modified_dts` and implement `BaseStruct`
  - run migration on all tables where we use the KEY as the FK to now use the new UUID as the FK
  - drop KEY columns across the board after done
  - go through all SQL queries where we SELECT from `mto_common_milestone` and ensure `is_archived <> TRUE`
  - update SQL queries to use UUID as FK instead of KEY
  - remove the KEY column from all queries
  - `mto_suggested_milestone` is one of many tables where we need to make sure to only pull non-archived milestones
  - `set_suggested_mto_milestone` is the name of the trigger
  - table inserts and then deletes self
  - `mto_template_milestone` is another

### V2

- https://www.figma.com/design/BcI7pNwfkmwaDD2EGGTsYC/IT-Lead?node-id=8117-15961&p=f&t=j1iX0ZijB6kGnhUd-0

