### Reasoning

- The goal with this ADR is to plan out the ability for admins to create/edit/archive Common Milestones. In order to do
  this, there are a few migrations needed. An initial plan is outlined below (WIP)
- The first design decision made was regarding deleting/removing Common Milestones
  - Initial idea - upon deletion of a common milestone, find all MTOs that use that milestone and decouple all those
    records to use an instance of the milestone instead of being cascade deleted
  - Final idea - use an `archive` mechanism instead of deletion, which allows us to keep the relation alive and would
    not require any cleanup upon deletion
  - Steps (WIP)
    - migration to create `is_archived` column in `mto_common_milestone` table - set to `false` by default
    - find all queries where we SELECT from the `mto_common_milestone` table and ensure we do NOT select any archived
      milestones
      - NOTE - we should still load the archived ones when loading MTOs and their respective milestones in order to show
        this information (and allow de-linking of the milestone) in the UI
    - add `is_archived` field to the Milestone type (not sure if needed, but we can add it for the sake of completeness)
- The second design decision made was regarding the current implementation of foreign keys with regard to common
  milestones
  - current - we key off of an enum value (also the primary key in the `mto_common_milestone` table) as the foreign key
    in other tables
  - refactor steps (WIP)
    - add an `id` column (type `uuid`) and populate with `gen_random_uuid()` in the `mto_common_milestone` table
    - find all tables where the foreign key relation exists on the current `key` column
      - create a column on each of those tables called `mto_common_milestone_id`
      - migration to map the new `id` from the `mto_common_milestone` table where the FK relation exists on the current
        `key` column
      - migration to create foreign key relationships on those tables to the new `id` column on the
        `mto_common_milestone` table
      - update existing queries in app code to use the new `id` column instead of the `key` column
      - migration to port any triggers/procedures/etc to use the new `id` column instead of the outgoing  `key` column
      - migrations to drop the foreign key constraints on all those tables
      - migration to drop the current FK columns on all those tables (can do after the fact for safety and simplicity)
      - migration to drop the current `key` column on the `mto_common_milestone` table (can do after the fact for safety
        and simplicity)

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

