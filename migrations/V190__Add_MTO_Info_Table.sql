ALTER TYPE TABLE_NAME ADD VALUE 'mto_info';

CREATE TABLE mto_info (
    id UUID PRIMARY KEY,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id) UNIQUE,

    ready_for_review_by UUID REFERENCES user_account(id),
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);
