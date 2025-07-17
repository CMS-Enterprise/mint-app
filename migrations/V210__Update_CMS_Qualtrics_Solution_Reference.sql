-- Not recording below changes
ALTER TABLE mto_solution
DISABLE TRIGGER audit_trigger;

-- Replace existed CMS_QUALTRICS from common solution to custom solution
UPDATE mto_solution AS solution
SET 
    mto_common_solution_key = NULL,
    name = 'CMS QUALTRICS',
    type = 'IT_SYSTEM',
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP,
    poc_name = contact.name,
    poc_email = contact.email
FROM mto_common_solution_contact AS contact
WHERE
    solution.mto_common_solution_key = contact.mto_common_solution_key
    AND solution.mto_common_solution_key = 'CMS_QUALTRICS';

-- Not recording below changes
ALTER TABLE user_view_customization
DISABLE TRIGGER audit_trigger;
-- Remove CMS_QUALTRICS from existed value in solutions
UPDATE user_view_customization
SET
    solutions = ARRAY_REMOVE(solutions, 'CMS_QUALTRICS'),
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE 'CMS_QUALTRICS' = ANY(solutions);

ALTER TABLE mto_solution
ENABLE TRIGGER audit_trigger;

ALTER TABLE user_view_customization
ENABLE TRIGGER audit_trigger;
