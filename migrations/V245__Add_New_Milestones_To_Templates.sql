-- Add new common milestones to MTO templates and create solution links

BEGIN;

-- =========================================================
-- Add common milestone solution links
-- =========================================================

-- ACQUIRE_AN_IMP_CONT -> RMADA
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('ACQUIRE_AN_IMP_CONT', 'RMADA');

-- ACQUIRE_A_PRE_IMP_CONT -> ARDS and FFRDC
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES
    ('ACQUIRE_A_PRE_IMP_CONT', 'ARDS'),
    ('ACQUIRE_A_PRE_IMP_CONT', 'FFRDC');

-- ACQUIRE_A_DATA_AGG_CONT -> CDAC
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('ACQUIRE_A_DATA_AGG_CONT', 'CDAC');

-- SEND_DASHBOARDS_REPORTS_TO_PART -> ISP
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('SEND_DASHBOARDS_REPORTS_TO_PART', 'ISP');

-- SEND_DATA_VIA_API_TO_PART -> BCDA and ISP
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES
    ('SEND_DATA_VIA_API_TO_PART', 'BCDA'),
    ('SEND_DATA_VIA_API_TO_PART', 'ISP');

-- SEND_RAW_FILES_TO_PART -> INNOVATION (4i) and ISP
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES
    ('SEND_RAW_FILES_TO_PART', 'INNOVATION'),
    ('SEND_RAW_FILES_TO_PART', 'ISP');

-- SIGN_COOPERATIVE_AGREEMENTS -> GS (GrantSolutions)
INSERT INTO mto_common_milestone_solution_link (mto_common_milestone_key, mto_common_solution_key)
VALUES ('SIGN_COOPERATIVE_AGREEMENTS', 'GS');

-- =========================================================
-- MEDICARE_ADVANTAGE_AND_DRUG_MODELS template
-- Add missing subcategories and milestones
-- =========================================================

DO $$
DECLARE
    template_uuid UUID;
    operations_cat_uuid UUID;
    internal_funcs_subcat_uuid UUID;
    send_data_subcat_uuid UUID;
    acquire_imp_cont_milestone_uuid UUID;
    acquire_pre_imp_cont_milestone_uuid UUID;
    acquire_data_agg_cont_milestone_uuid UUID;
    send_dashboards_milestone_uuid UUID;
    send_api_milestone_uuid UUID;
    send_raw_files_milestone_uuid UUID;
BEGIN
    -- Get template ID
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'MEDICARE_ADVANTAGE_AND_DRUG_MODELS';

    -- Get existing Operations category
    SELECT id INTO operations_cat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Operations' AND parent_id IS NULL;

    -- Add "Internal functions" subcategory under Operations
    internal_funcs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        internal_funcs_subcat_uuid,
        template_uuid,
        'Internal functions',
        operations_cat_uuid,
        5, -- After "Participant and beneficiary tracking/alignment" (order 4)
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add "Send data to participants" subcategory under Operations
    send_data_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        send_data_subcat_uuid,
        template_uuid,
        'Send data to participants',
        operations_cat_uuid,
        6, -- After "Internal functions" (order 5)
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add contractor milestones
    acquire_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_AN_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_pre_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_pre_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_PRE_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_data_agg_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_data_agg_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_DATA_AGG_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add data sharing milestones under "Send data to participants"
    send_dashboards_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_dashboards_milestone_uuid,
        template_uuid,
        'SEND_DASHBOARDS_REPORTS_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_api_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_api_milestone_uuid,
        template_uuid,
        'SEND_DATA_VIA_API_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_raw_files_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_raw_files_milestone_uuid,
        template_uuid,
        'SEND_RAW_FILES_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );
END $$;

-- =========================================================
-- ACO_AND_KIDNEY_MODELS template
-- Add "Internal functions" subcategory and milestones
-- =========================================================

DO $$
DECLARE
    template_uuid UUID;
    operations_cat_uuid UUID;
    internal_funcs_subcat_uuid UUID;
    send_data_subcat_uuid UUID;
    acquire_imp_cont_milestone_uuid UUID;
    acquire_pre_imp_cont_milestone_uuid UUID;
    acquire_data_agg_cont_milestone_uuid UUID;
    send_dashboards_milestone_uuid UUID;
    send_api_milestone_uuid UUID;
    send_raw_files_milestone_uuid UUID;
    max_order_under_ops INT;
BEGIN
    -- Get template ID
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'ACO_AND_KIDNEY_MODELS';

    -- Get existing Operations category
    SELECT id INTO operations_cat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Operations' AND parent_id IS NULL;

    -- Get existing "Send data to participants" subcategory
    SELECT id INTO send_data_subcat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Send data to participants' AND parent_id = operations_cat_uuid;

    -- Find the maximum order under Operations category
    SELECT COALESCE(MAX("order"), 0) INTO max_order_under_ops
    FROM mto_template_category
    WHERE template_id = template_uuid AND parent_id = operations_cat_uuid;

    -- Add "Internal functions" subcategory under Operations
    internal_funcs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        internal_funcs_subcat_uuid,
        template_uuid,
        'Internal functions',
        operations_cat_uuid,
        max_order_under_ops + 1,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add contractor milestones
    acquire_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_AN_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_pre_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_pre_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_PRE_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_data_agg_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_data_agg_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_DATA_AGG_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add data sharing milestones under existing "Send data to participants"
    send_dashboards_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_dashboards_milestone_uuid,
        template_uuid,
        'SEND_DASHBOARDS_REPORTS_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_api_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_api_milestone_uuid,
        template_uuid,
        'SEND_DATA_VIA_API_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_raw_files_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_raw_files_milestone_uuid,
        template_uuid,
        'SEND_RAW_FILES_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );
END $$;

-- =========================================================
-- EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS template
-- Add "Internal functions" subcategory and milestones
-- =========================================================

DO $$
DECLARE
    template_uuid UUID;
    operations_cat_uuid UUID;
    internal_funcs_subcat_uuid UUID;
    send_data_subcat_uuid UUID;
    acquire_imp_cont_milestone_uuid UUID;
    acquire_pre_imp_cont_milestone_uuid UUID;
    acquire_data_agg_cont_milestone_uuid UUID;
    send_dashboards_milestone_uuid UUID;
    send_api_milestone_uuid UUID;
    send_raw_files_milestone_uuid UUID;
    max_order_under_ops INT;
BEGIN
    -- Get template ID
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS';

    -- Get existing Operations category
    SELECT id INTO operations_cat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Operations' AND parent_id IS NULL;

    -- Get existing "Send data to participants" subcategory
    SELECT id INTO send_data_subcat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Send data to participants' AND parent_id = operations_cat_uuid;

    -- Find the maximum order under Operations category
    SELECT COALESCE(MAX("order"), 0) INTO max_order_under_ops
    FROM mto_template_category
    WHERE template_id = template_uuid AND parent_id = operations_cat_uuid;

    -- Add "Internal functions" subcategory under Operations
    internal_funcs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        internal_funcs_subcat_uuid,
        template_uuid,
        'Internal functions',
        operations_cat_uuid,
        max_order_under_ops + 1,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add contractor milestones
    acquire_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_AN_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_pre_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_pre_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_PRE_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_data_agg_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_data_agg_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_DATA_AGG_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add data sharing milestones under existing "Send data to participants"
    send_dashboards_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_dashboards_milestone_uuid,
        template_uuid,
        'SEND_DASHBOARDS_REPORTS_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_api_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_api_milestone_uuid,
        template_uuid,
        'SEND_DATA_VIA_API_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_raw_files_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_raw_files_milestone_uuid,
        template_uuid,
        'SEND_RAW_FILES_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );
END $$;

-- =========================================================
-- STATE_AND_LOCAL_MODELS template
-- Add "Internal functions" subcategory and milestones
-- =========================================================

DO $$
DECLARE
    template_uuid UUID;
    operations_cat_uuid UUID;
    internal_funcs_subcat_uuid UUID;
    send_data_subcat_uuid UUID;
    legal_cat_uuid UUID;
    agreements_subcat_uuid UUID;
    acquire_imp_cont_milestone_uuid UUID;
    acquire_pre_imp_cont_milestone_uuid UUID;
    acquire_data_agg_cont_milestone_uuid UUID;
    send_dashboards_milestone_uuid UUID;
    send_api_milestone_uuid UUID;
    send_raw_files_milestone_uuid UUID;
    sign_coop_agreements_milestone_uuid UUID;
    max_order_under_ops INT;
BEGIN
    -- Get template ID
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'STATE_AND_LOCAL_MODELS';

    -- Get existing Operations category
    SELECT id INTO operations_cat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Operations' AND parent_id IS NULL;

    -- Get existing "Send data to participants" subcategory
    SELECT id INTO send_data_subcat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Send data to participants' AND parent_id = operations_cat_uuid;

    -- Get existing Legal category and Agreements subcategory
    SELECT id INTO legal_cat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Legal' AND parent_id IS NULL;

    SELECT id INTO agreements_subcat_uuid
    FROM mto_template_category
    WHERE template_id = template_uuid AND name = 'Agreements' AND parent_id = legal_cat_uuid;

    -- Find the maximum order under Operations category
    SELECT COALESCE(MAX("order"), 0) INTO max_order_under_ops
    FROM mto_template_category
    WHERE template_id = template_uuid AND parent_id = operations_cat_uuid;

    -- Add "Internal functions" subcategory under Operations
    internal_funcs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        internal_funcs_subcat_uuid,
        template_uuid,
        'Internal functions',
        operations_cat_uuid,
        max_order_under_ops + 1,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add contractor milestones
    acquire_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_AN_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_pre_imp_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_pre_imp_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_PRE_IMP_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    acquire_data_agg_cont_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        acquire_data_agg_cont_milestone_uuid,
        template_uuid,
        'ACQUIRE_A_DATA_AGG_CONT',
        internal_funcs_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add data sharing milestones under existing "Send data to participants"
    send_dashboards_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_dashboards_milestone_uuid,
        template_uuid,
        'SEND_DASHBOARDS_REPORTS_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_api_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_api_milestone_uuid,
        template_uuid,
        'SEND_DATA_VIA_API_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    send_raw_files_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        send_raw_files_milestone_uuid,
        template_uuid,
        'SEND_RAW_FILES_TO_PART',
        send_data_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- Add SIGN_COOPERATIVE_AGREEMENTS milestone under Legal > Agreements
    sign_coop_agreements_milestone_uuid := gen_random_uuid();
    INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
    VALUES (
        sign_coop_agreements_milestone_uuid,
        template_uuid,
        'SIGN_COOPERATIVE_AGREEMENTS',
        agreements_subcat_uuid,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );
END $$;

COMMIT;
