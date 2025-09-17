BEGIN;

-- =========================================================
-- Insert MEDICARE_ADVANTAGE_AND_DRUG_MODELS template data
-- =========================================================

-- Insert the template
INSERT INTO mto_template (id, key, name, description, created_by, created_dts) 
VALUES (
    gen_random_uuid(),
    'MEDICARE_ADVANTAGE_AND_DRUG_MODELS',
    'Medicare Advantage and Drug Models Template',
    'Template for Medicare Advantage and prescription drug models with standardized categories, milestones, and solutions.',
    '00000001-0001-0001-0001-000000000001'::UUID, -- System user
    current_timestamp
);

-- Store template ID for reference
DO $$
DECLARE
    template_uuid UUID;
    -- Category UUIDs
    participants_cat_uuid UUID;
    operations_cat_uuid UUID;
    legal_cat_uuid UUID;
    payers_cat_uuid UUID;
    -- Sub-category UUIDs
    app_review_subcat_uuid UUID;
    participant_support_subcat_uuid UUID;
    participant_tracking_subcat_uuid UUID;
    agreements_subcat_uuid UUID;
    uncategorized_subcat_uuid UUID;
    -- Milestone UUIDs
    rev_col_bids_milestone_uuid UUID;
    recruit_participants_milestone_uuid UUID;
    helpdesk_support_milestone_uuid UUID;
    manage_cd_milestone_uuid UUID;
    update_contract_milestone_uuid UUID;
    -- Solution UUIDs
    apps_solution_uuid UUID;
    ccw_solution_uuid UUID;
    ams_solution_uuid UUID;
    cbosc_solution_uuid UUID;
    ddps_solution_uuid UUID;
    hpms_solution_uuid UUID;
    idr_solution_uuid UUID;
    marx_solution_uuid UUID;
    model_space_solution_uuid UUID;
    rass_solution_uuid UUID;
BEGIN
    -- Get the template ID
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'MEDICARE_ADVANTAGE_AND_DRUG_MODELS';

    -- =========================================================
    -- Category 1: Participants
    -- =========================================================
    participants_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        participants_cat_uuid,
        template_uuid,
        'Participants',
        NULL,
        1,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Sub-category: Application, review, and selection
    app_review_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        app_review_subcat_uuid,
        template_uuid,
        'Application, review, and selection',
        participants_cat_uuid,
        2,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Sub-category: Participant support
    participant_support_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        participant_support_subcat_uuid,
        template_uuid,
        'Participant support',
        participants_cat_uuid,
        3,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Category 2: Operations
    -- =========================================================
    operations_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        operations_cat_uuid,
        template_uuid,
        'Operations',
        NULL,
        4,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Sub-category: Participant and beneficiary tracking/alignment
    participant_tracking_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        participant_tracking_subcat_uuid,
        template_uuid,
        'Participant and beneficiary tracking/alignment',
        operations_cat_uuid,
        5,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Category 3: Legal
    -- =========================================================
    legal_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        legal_cat_uuid,
        template_uuid,
        'Legal',
        NULL,
        6,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Sub-category: Agreements
    agreements_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        agreements_subcat_uuid,
        template_uuid,
        'Agreements',
        legal_cat_uuid,
        7,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Category 4: Payers
    -- =========================================================
    payers_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        payers_cat_uuid,
        template_uuid,
        'Payers',
        NULL,
        8,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Sub-category: Uncategorized
    uncategorized_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        uncategorized_subcat_uuid,
        template_uuid,
        'Uncategorized',
        payers_cat_uuid,
        9,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Insert milestones (5 total)
    -- =========================================================
    
    -- Milestone: Review and collect plan bids
    rev_col_bids_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        rev_col_bids_milestone_uuid,
        template_uuid,
        'REV_COL_BIDS',
        app_review_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Milestone: Recruit participants
    recruit_participants_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        recruit_participants_milestone_uuid,
        template_uuid,
        'RECRUIT_PARTICIPANTS',
        app_review_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Milestone: Establish a participant help desk
    helpdesk_support_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        helpdesk_support_milestone_uuid,
        template_uuid,
        'HELPDESK_SUPPORT',
        participant_support_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Milestone: Manage Part C/D enrollment
    manage_cd_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        manage_cd_milestone_uuid,
        template_uuid,
        'MANAGE_CD',
        participant_tracking_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Milestone: Update the plan's contract
    update_contract_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        update_contract_milestone_uuid,
        template_uuid,
        'UPDATE_CONTRACT',
        uncategorized_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Insert solutions (10 total)
    -- =========================================================
    
    -- Solution: Automated Plan Payment System (APPS)
    apps_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        apps_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'APPS'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Chronic Conditions Warehouse (CCW)
    ccw_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        ccw_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'CCW'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: CMMI Analysis and Management System (AMS)
    ams_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        ams_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'AMS'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Consolidated Business Operations Support Center (CBOSC)
    cbosc_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        cbosc_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'CBOSC'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Drug Data Processing System (DDPS)
    ddps_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        ddps_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'DDPS'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Health Plan Management System (HPMS)
    hpms_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        hpms_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'HPMS'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Integrated Data Repository (IDR)
    idr_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        idr_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'IDR'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Medicare Advantage Prescription Drug System (MARx)
    marx_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        marx_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'MARX'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Model Space
    model_space_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        model_space_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'MODEL_SPACE'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Solution: Risk Adjustment Suite of Systems (RASS)
    rass_solution_uuid := gen_random_uuid();
    INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
    VALUES (
        rass_solution_uuid,
        template_uuid,
        (SELECT id FROM mto_common_solution WHERE key = 'RASS'),
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Create milestone-solution links
    -- =========================================================
    
    -- Link: Review and collect plan bids -> HPMS
    INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
    VALUES (
        gen_random_uuid(),
        template_uuid,
        hpms_solution_uuid,
        rev_col_bids_milestone_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Link: Establish a participant help desk -> CBOSC
    INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
    VALUES (
        gen_random_uuid(),
        template_uuid,
        cbosc_solution_uuid,
        helpdesk_support_milestone_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Link: Manage Part C/D enrollment -> MARx
    INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
    VALUES (
        gen_random_uuid(),
        template_uuid,
        marx_solution_uuid,
        manage_cd_milestone_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Link: Update the plan's contract -> HPMS
    INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
    VALUES (
        gen_random_uuid(),
        template_uuid,
        hpms_solution_uuid,
        update_contract_milestone_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Note: "Recruit participants" milestone has no specified solution, so no link is created
    -- Note: Solutions without specified milestones (APPS, CCW, AMS, DDPS, IDR, Model Space, RASS) have no links created

END $$;

COMMIT;
