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
                            facilitated_by_role ZERO_STRING NOT NULL,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

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
                            id UUID PRIMARY KEY,
                            name ZERO_STRING NOT NULL,
                            key MTO_COMMON_SOLUTION_KEY NOT NULL,
                            type MTO_SOLUTION_TYPE NOT NULL,
                            description ZERO_STRING NOT NULL,

                            created_by UUID NOT NULL REFERENCES user_account(id),
                            created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            modified_by UUID REFERENCES user_account(id),
                            modified_dts TIMESTAMP WITH TIME ZONE
);

CREATE TABLE mto_common_milestone_solution_link (
                            id UUID PRIMARY KEY,
                            mto_common_milestone_id UUID NOT NULL REFERENCES mto_common_milestone(id) UNIQUE,
                            mto_common_solution_id UUID NOT NULL REFERENCES mto_common_solution(id) UNIQUE,

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


/* TODO, insert common milestones and solutions. these are temporary placeholders for development


*/

INSERT INTO "public"."mto_common_milestone"("id",
                                            "name",
                                            "key",
                                            "category_name",
                                            "sub_category_name",
                                            "description",
                                            "facilitated_by_role",
                                            "created_by",
                                            "created_dts") VALUES('7b15b8bc-42db-493a-a0c1-1d4148945330',
                                                                  'Place Holder Milestone',
                                                                  'MILESTONE_A',
                                                                  'placeholder category',
                                                                  'placeholder sub category',
                                                                  'placeholder description',
                                                                  'MODEL_TEAM',
                                                                  '00000001-0001-0001-0001-000000000001',
                                                                  CURRENT_TIMESTAMP);


INSERT INTO "public"."mto_common_solution"("id",
                                           "name",
                                           "key",
                                           "type",
                                           "description",
                                           "created_by",
                                           "created_dts") VALUES('7b15b8bc-42db-493a-a0c1-1d4148945330',
                                                                 'Place Holder Solution',
                                                                 'SOLUTION_A',
                                                                 'IT_SYSTEM',
                                                                  'placeholder description',
                                                                 '00000001-0001-0001-0001-000000000001',
                                                                 CURRENT_TIMESTAMP);

/* End TODO


*/
