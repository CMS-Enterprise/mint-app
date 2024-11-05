CREATE TYPE MTO_COMMON_MILESTONE_KEY AS ENUM (
    'MILESTONE_A',
    'MILESTONE_B'
);

CREATE TABLE mto_common_milestone (
    id UUID PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    key MTO_COMMON_MILESTONE_KEY NOT NULL,
    category_name ZERO_STRING NOT NULL,
    sub_category_name ZERO_STRING NOT NULL,
    description ZERO_STRING NOT NULL,
    facilitated_by_role MTO_FACILITATOR NOT NULL,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

INSERT INTO "public"."mto_common_milestone"(
    "id",
    "name",
    "key",
    "category_name",
    "sub_category_name",
    "description",
    "facilitated_by_role",
    "created_by",
    "created_dts") VALUES(
    '7b15b8bc-42db-493a-a0c1-1d4148945330',
    'Place Holder Milestone',
    'MILESTONE_A',
    'placeholder category',
    'placeholder sub category',
    'placeholder description',
    'MODEL_TEAM',
    '00000001-0001-0001-0001-000000000001',
    CURRENT_TIMESTAMP
);
