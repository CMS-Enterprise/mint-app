CREATE TABLE mto_suggested_milestone (
    id UUID PRIMARY KEY,
    mto_common_milestone_key MTO_COMMON_MILESTONE_KEY REFERENCES mto_common_milestone(key),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


COMMENT ON TABLE mto_suggested_milestone IS 'Table to track milestones suggested for a model plan';
