-- Not recording below changes
ALTER TABLE mto_solution
DISABLE TRIGGER audit_trigger;

-- Replace existed MDM_POR from common solution to custom solution
UPDATE mto_solution AS solution
SET 
    mto_common_solution_key = NULL,
    name = 'Master Data Management Program-Organization Relationship',
    type = 'IT_SYSTEM',
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP,
    poc_name = 
    COALESCE("user".common_name, contact.mailbox_title),
    poc_email = 
    COALESCE("user".email, contact.mailbox_address)
FROM mto_common_solution_contact AS contact 
LEFT JOIN user_account AS "user" ON "user".id = contact.user_id
WHERE
    solution.mto_common_solution_key = contact.mto_common_solution_key
    AND contact.is_primary = TRUE
    AND solution.mto_common_solution_key = 'MDM_POR';

-- Not recording below changes
ALTER TABLE user_view_customization
DISABLE TRIGGER audit_trigger;
-- Remove MDM_POR from existed value in solutions
UPDATE user_view_customization
SET
    solutions = ARRAY_REMOVE(solutions, 'MDM_POR'),
    modified_by = '00000001-0001-0001-0001-000000000001', -- System Account
    modified_dts = CURRENT_TIMESTAMP
WHERE 'MDM_POR' = ANY(solutions);

ALTER TABLE mto_solution
ENABLE TRIGGER audit_trigger;

ALTER TABLE user_view_customization
ENABLE TRIGGER audit_trigger;
