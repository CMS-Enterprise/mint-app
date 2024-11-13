CREATE TYPE MTO_COMMON_MILESTONE_KEY AS ENUM (
    'MILESTONE_A',
    'MILESTONE_B'
);

CREATE TABLE mto_common_milestone (
    key MTO_COMMON_MILESTONE_KEY NOT NULL PRIMARY KEY,
    name ZERO_STRING NOT NULL,

    category_name ZERO_STRING NOT NULL, -- TODO: Revisit if this should be NOT NULL
    sub_category_name ZERO_STRING NOT NULL, -- TODO: Revisit if this should be NOT NULL, and if common milestones _actually_ have subCategories
    description ZERO_STRING NOT NULL, -- TODO (mto) is this needed?
    facilitated_by_role MTO_FACILITATOR NOT NULL
);

INSERT INTO "public"."mto_common_milestone"(
    "name",
    "key",
    "category_name",
    "sub_category_name",
    "description",
    "facilitated_by_role") VALUES(
    'Place Holder Milestone',
    'MILESTONE_A',
    'placeholder category',
    'placeholder sub category',
    'placeholder description',
    'MODEL_TEAM'
);
