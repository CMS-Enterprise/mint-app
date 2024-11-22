CREATE TABLE mto_common_milestone_solution_link (
    mto_common_milestone_key MTO_COMMON_MILESTONE_KEY NOT NULL REFERENCES mto_common_milestone(key),
    mto_common_solution_key MTO_COMMON_SOLUTION_KEY NOT NULL REFERENCES mto_common_solution(key),

    PRIMARY KEY  (mto_common_milestone_key, mto_common_solution_key)
);

-- INSERT INTO "public"."mto_common_milestone_solution_link"("mto_common_milestone_key", "mto_common_solution_key")
-- VALUES('MILESTONE_A', 'SOLUTION_A');
