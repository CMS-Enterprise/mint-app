CREATE TABLE mto_category (
    id UUID PRIMARY KEY,
    name ZERO_STRING NOT NULL,
    parent_id UUID REFERENCES mto_category(id),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
