CREATE TABLE mto_common_milestone_solution_link (
    mto_common_milestone_key MTO_COMMON_MILESTONE_KEY NOT NULL REFERENCES mto_common_milestone(key),
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY NOT NULL REFERENCES mto_common_solution(key),

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE,

    PRIMARY KEY  (mto_common_milestone_key, mto_common_solution_key)
);

INSERT INTO "public"."mto_common_milestone_solution_link"("mto_common_milestone_key", "mto_common_solution_key", "created_by")
VALUES('MILESTONE_A', 'SOLUTION_A', '00000001-0001-0001-0001-000000000001');
