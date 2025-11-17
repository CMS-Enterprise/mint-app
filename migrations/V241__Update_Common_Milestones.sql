-- reorder mto_template_category to make space for new 'Beneficiaries' category at order 20
UPDATE mto_template_category
SET
    "order" = 24,
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP
WHERE
    name = 'Model closeout or extension'
    AND template_id = (SELECT id FROM mto_template WHERE key = 'STANDARD_CATEGORIES');

UPDATE mto_template_category
SET
    "order" = 23,
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP
WHERE
    name = 'Evaluation'
    AND template_id = (SELECT id FROM mto_template WHERE key = 'STANDARD_CATEGORIES');

UPDATE mto_template_category
SET
    "order" = 22,
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP
WHERE
    name = 'Learning'
    AND template_id = (SELECT id FROM mto_template WHERE key = 'STANDARD_CATEGORIES');

UPDATE mto_template_category
SET
    "order" = 21,
    modified_by = '00000001-0001-0001-0001-000000000001', -- system account
    modified_dts = CURRENT_TIMESTAMP
WHERE
    name = 'Quality'
    AND template_id = (SELECT id FROM mto_template WHERE key = 'STANDARD_CATEGORIES');

-- Add new category 'Beneficiaries' to STANDARD_CATEGORIES template
INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
VALUES (
    GEN_RANDOM_UUID(),(SELECT id FROM mto_template WHERE key = 'STANDARD_CATEGORIES' LIMIT 1), 'Beneficiaries', NULL, 20,
    '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP
);

-- Update EDUCATE_BENEF milestone category
UPDATE mto_common_milestone
SET
    category_name = 'Beneficiaries',
    sub_category_name = NULL
WHERE key = 'EDUCATE_BENEF';

-- Update existing common milestone name 
UPDATE mto_common_milestone
SET name = 'Set up and make non-claims based payments'
WHERE key = 'MAKE_NON_CLAIMS_BASED_PAYMENTS';

-- Add HPMS as common solution for COMM_W_PART milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('COMM_W_PART', 'HPMS');

-- Add HPMS as common solution for RECRUIT_PARTICIPANTS milestone
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('RECRUIT_PARTICIPANTS', 'HPMS');
