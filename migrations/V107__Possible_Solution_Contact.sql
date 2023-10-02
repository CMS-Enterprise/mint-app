CREATE TABLE possible_operational_solution_contact (
    id UUID PRIMARY KEY NOT NULL,
    possible_operational_solution_id int NOT NULL REFERENCES possible_operational_solution(id),
	  name zero_string NOT NULL,
	  email zero_string NOT NULL,
	  role zero_string NOT NULL,


    --META DATA
    created_by UUID NOT NULL REFERENCES user_account(id),
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES user_account(id),
    modified_dts TIMESTAMP WITH TIME ZONE
);


INSERT INTO possible_operational_solution_contact(
    id,
    possible_operational_solution_id,
    name,
    email,
    role,
    created_by,
    created_dts
)
