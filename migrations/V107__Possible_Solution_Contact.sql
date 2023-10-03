CREATE TABLE possible_operational_solution_contact (
    id UUID PRIMARY KEY NOT NULL,
    possible_operational_solution_id int NOT NULL REFERENCES possible_operational_solution(id),
	  name zero_string NOT NULL,
	  email zero_string NOT NULL,
      is_team BOOLEAN NOT NULL DEFAULT FALSE,
	  role zero_string NULL,


    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);

ALTER TABLE possible_operational_solution_contact
ADD CONSTRAINT role_required_when_is_team_false CHECK ( (is_team AND role IS NULL) OR (NOT is_team AND role IS NOT NULL));

ALTER TYPE operational_solution_key ADD VALUE 'ISP'; --acronym
ALTER TYPE operational_solution_key ADD VALUE 'MIDS'; --acronym
