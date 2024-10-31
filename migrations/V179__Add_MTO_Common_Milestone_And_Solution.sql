CREATE TABLE mto_common_milestone (
                            id UUID PRIMARY KEY,
                            category_name ZERO_STRING NOT NULL,
                            sub_category_name ZERO_STRING NOT NULL,
                            title ZERO_STRING NOT NULL,
                            description ZERO_STRING NOT NULL,
                            facilitated_by_role ZERO_STRING NOT NULL,

                            created_by UUID NOT NULL REFERENCES user_account(id),
                            created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                            modified_by UUID REFERENCES user_account(id),
                            modified_dts TIMESTAMP WITH TIME ZONE
);

CREATE TABLE mto_common_solution (
                            id UUID PRIMARY KEY,
                            name ZERO_STRING NOT NULL,
                            key ZERO_STRING NOT NULL,
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
