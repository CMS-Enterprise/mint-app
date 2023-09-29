CREATE TABLE possible_operational_solution_contact (
    id UUID PRIMARY KEY NOT NULL,
    possible_operational_solution_id int NOT NULL REFERENCES possible_operational_solution(id),
	  name zero_string NOT NULL,
	  email zero_string NOT NULL,
	  role zero_string NOT NULL,


    --META DATA
    created_by UUID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID,
    modified_dts TIMESTAMP WITH TIME ZONE
);
