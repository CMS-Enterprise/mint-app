CREATE TYPE MTO_COMMON_SOLUTION_KEY AS ENUM (
    'SOLUTION_A',
    'SOLUTION_B'
);

CREATE TYPE MTO_SOLUTION_TYPE AS ENUM (
    'IT_SYSTEM',
    'CONTRACT',
    'CROSS_CUTTING_GROUP',
    'OTHER'
);
COMMENT ON TYPE MTO_SOLUTION_TYPE IS
'Specifies the type of solution, such as IT system, contract, cross-cutting group, or other, to categorize solutions used within the model plan.';


CREATE TABLE mto_common_solution (
    -- id UUID PRIMARY KEY,
    key MTO_COMMON_SOLUTION_KEY PRIMARY KEY,
    name ZERO_STRING NOT NULL,

    type MTO_SOLUTION_TYPE NOT NULL,
    description ZERO_STRING NOT NULL,
    role MTO_FACILITATOR NOT NULL,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


/* TODO, insert common milestones and solutions. these are temporary placeholders for development


*/



INSERT INTO "public"."mto_common_solution"(
    "name",
    "key",
    "type",
    "description",
    "role",
    "created_by",
    "created_dts") VALUES(
    'Place Holder Solution',
    'SOLUTION_A',
    'IT_SYSTEM',
    'placeholder description',
    'MODEL_TEAM',
    '00000001-0001-0001-0001-000000000001',
    CURRENT_TIMESTAMP
);

/* End TODO


*/