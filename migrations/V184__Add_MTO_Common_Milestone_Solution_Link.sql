CREATE TABLE mto_common_milestone_solution_link (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    mto_common_milestone_id UUID NOT NULL REFERENCES mto_common_milestone(id),
    mto_common_solution_id UUID NOT NULL REFERENCES mto_common_solution(id),

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE,

    UNIQUE (mto_common_milestone_id, mto_common_solution_id)
);
