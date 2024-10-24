CREATE TABLE mto_common_milestone (
                            id UUID PRIMARY KEY,
                            category_name ZERO_STRING NOT NULL,

                            created_by UUID NOT NULL REFERENCES user_account(id),
                            created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            modified_by UUID REFERENCES user_account(id),
                            modified_dts TIMESTAMP WITH TIME ZONE
);

CREATE TABLE mto_common_solution (
                            id UUID PRIMARY KEY,

                            created_by UUID NOT NULL REFERENCES user_account(id),
                            created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            modified_by UUID REFERENCES user_account(id),
                            modified_dts TIMESTAMP WITH TIME ZONE
);