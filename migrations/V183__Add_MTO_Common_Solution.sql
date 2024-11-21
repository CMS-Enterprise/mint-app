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

CREATE TYPE MTO_COMMON_SOLUTION_SUBJECT AS ENUM (
    'APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS',
    'APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS',
    'MEDICARE_FEE_FOR_SERVICE',
    'CONTRACT_VEHICLES',
    'LEARNING',
    'QUALITY',
    'COMMUNICATION_TOOLS_AND_HELP_DESK',
    'MEDICARE_ADVANTAGE_AND_PART_D',
    'PAYMENTS_AND_FINANCIALS',
    'DATA',
    'LEGAL'
);

COMMENT ON TYPE MTO_SOLUTION_TYPE IS
'Specifies the type of solution, such as IT system, contract, cross-cutting group, or other, to categorize solutions used within the model plan.';


CREATE TABLE mto_common_solution (
    -- id UUID PRIMARY KEY,
    key MTO_COMMON_SOLUTION_KEY PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    type MTO_SOLUTION_TYPE NOT NULL,
    subject MTO_COMMON_SOLUTION_SUBJECT[] NOT NULL,
    filter_view MODEL_VIEW_FILTER
);


/* TODO, insert common milestones and solutions. these are temporary placeholders for development


*/



-- INSERT INTO "public"."mto_common_solution"(
--     "name",
--     "key",
--     "type",
--     "description",
--     "role") VALUES(
--     'Place Holder Solution',
--     'SOLUTION_A',
--     'IT_SYSTEM',
--     'placeholder description',
--     'MODEL_TEAM'
-- );

/* End TODO


*/
