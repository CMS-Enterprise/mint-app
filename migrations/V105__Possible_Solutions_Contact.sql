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

SELECT
  gen_random_uuid() AS id,
  pos.id as possible_operational_solution_id,
  'test contact' AS name,
  'test@contact.com' AS email,
  'test Role' AS role,
  '00000001-0001-0001-0001-000000000001' AS created_by, --System account
  current_timestamp AS created_dts

FROM POSSIBLE_OPERATIONAL_SOLUTION AS pos
