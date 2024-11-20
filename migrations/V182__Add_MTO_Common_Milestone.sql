CREATE TYPE MTO_COMMON_MILESTONE_KEY AS ENUM (
    'MILESTONE_A',
    'MILESTONE_B'
);

CREATE TABLE mto_common_milestone (
    key MTO_COMMON_MILESTONE_KEY NOT NULL PRIMARY KEY,
    name ZERO_STRING NOT NULL,

    category_name ZERO_STRING NOT NULL,
    sub_category_name ZERO_STRING,

    facilitated_by_role MTO_FACILITATOR NOT NULL,
    /* Configuration for suggesting milestone trigger logic */
    section TASK_LIST_SECTION NOT NULL,
    trigger_table TEXT NOT NULL,
    trigger_col TEXT[] NOT NULL,
    trigger_vals TEXT[] NOT NULL
    /**** end configuration***/
);
-- TODO (mto) add comments to these new fields


INSERT INTO "public"."mto_common_milestone"(
    "name",
    "key",
    "category_name",
    "sub_category_name",
    "facilitated_by_role",
    "section",
    "trigger_table",
    "trigger_col",
    "trigger_vals") VALUES(
    'Place Holder Milestone',
    'MILESTONE_A',
    'placeholder category',
    'placeholder sub category',
    'MODEL_TEAM',
    'BASICS',
    'plan_basics',
    '{should_any_providers_excluded_ffs_systems}',
    '{t}'
);
