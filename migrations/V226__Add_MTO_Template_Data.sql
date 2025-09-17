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

BEGIN;

-- =========================================================
-- Insert ACO_AND_KIDNEY_MODELS template data
-- =========================================================

-- 1) Template
INSERT INTO mto_template (id, key, name, description, created_by, created_dts)
VALUES (
  gen_random_uuid(),
  'ACO_AND_KIDNEY_MODELS',
  'ACO and Kidney Models Template',
  'Template for ACO and Kidney models with standardized categories, milestones, and solutions.',
  '00000001-0001-0001-0001-000000000001'::UUID,
  CURRENT_TIMESTAMP
);

DO $$
DECLARE
  template_uuid UUID;

  -- Category UUIDs
  participants_cat_uuid UUID;
  operations_cat_uuid UUID;
  collect_data_cat_uuid UUID;
  tracking_align_cat_uuid UUID;
  benchmarks_cat_uuid UUID;
  legal_cat_uuid UUID;
  payment_cat_uuid UUID;
  evaluation_cat_uuid UUID;

  -- Sub-category UUIDs
  app_review_subcat_uuid UUID;
  participant_support_subcat_uuid UUID;
  setup_ops_subcat_uuid UUID;
  send_data_subcat_uuid UUID;
  agreements_subcat_uuid UUID;
  claims_based_subcat_uuid UUID;
  non_claims_based_subcat_uuid UUID;
  eval_uncat_subcat_uuid UUID;

  -- Milestone UUIDs
  recruit_participants_milestone_uuid UUID;
  helpdesk_support_milestone_uuid UUID;
  iddoc_support_milestone_uuid UUID;
  data_to_monitor_milestone_uuid UUID;
  data_to_support_eval_milestone_uuid UUID;
  send_repdata_to_part_milestone_uuid UUID;
  vet_prov_pi_milestone_uuid UUID;
  manage_prov_overlap_milestone_uuid UUID;
  manage_ben_overlap_milestone_uuid UUID;
  establish_bench_milestone_uuid UUID;
  sign_participation_agreements_milestone_uuid UUID;
  adjust_ffs_claims_milestone_uuid UUID;
  manage_ffs_excl_payments_milestone_uuid UUID;
  make_non_claims_based_payments_milestone_uuid UUID;
  app_support_con_milestone_uuid UUID;

  -- Solution UUIDs (from mto_template_solution)
  four_i_solution_uuid UUID;              -- 4innovation (4i)
  aco_os_solution_uuid UUID;              -- Accountable Care Organization - Operational System (ACO-OS)
  ccw_solution_uuid UUID;                 -- Chronic Conditions Warehouse (CCW)
  ams_solution_uuid UUID;                 -- CMMI Analysis and Management System (AMS)
  cbosc_solution_uuid UUID;               -- Consolidated Business Operations Support Center (CBOSC)
  ipc_solution_uuid UUID;                 -- Innovation Payment Contractor (IPC)
  isp_solution_uuid UUID;                 -- Innovation Support Platform (ISP)
  mdm_ncbp_solution_uuid UUID;            -- Master Data Management for Non-Claims Based Payments (MDM-NCBP)
  model_space_solution_uuid UUID;         -- Model Space
  overlaps_workgroup_solution_uuid UUID;  -- Overlaps Operations Workgroup
  salesforce_rfa_solution_uuid UUID;      -- Salesforce Request for Application (RFA)
  shared_systems_solution_uuid UUID;      -- Shared Systems
BEGIN
  SELECT id INTO template_uuid FROM mto_template WHERE key = 'ACO_AND_KIDNEY_MODELS';

  -- =========================================================
  -- 2) Categories & Sub-categories
  -- =========================================================

  -- Category: Participants
  participants_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participants_cat_uuid, template_uuid, 'Participants', NULL, 1,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Application, review, and selection
  app_review_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (app_review_subcat_uuid, template_uuid, 'Application, review, and selection',
          participants_cat_uuid, 2,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Participant support
  participant_support_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participant_support_subcat_uuid, template_uuid, 'Participant support',
          participants_cat_uuid, 3,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Operations
  operations_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (operations_cat_uuid, template_uuid, 'Operations', NULL, 4,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Set up operations
  setup_ops_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (setup_ops_subcat_uuid, template_uuid, 'Set up operations',
          operations_cat_uuid, 5,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Collect data
  collect_data_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (collect_data_cat_uuid, template_uuid, 'Collect data', NULL, 6,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Send data to participants
  send_data_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (send_data_subcat_uuid, template_uuid, 'Send data to participants',
          collect_data_cat_uuid, 7,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Participant and beneficiary tracking/alignment
  tracking_align_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (tracking_align_cat_uuid, template_uuid, 'Participant and beneficiary tracking/alignment', NULL, 8,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Benchmarks
  benchmarks_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (benchmarks_cat_uuid, template_uuid, 'Benchmarks', NULL, 9,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Legal
  legal_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (legal_cat_uuid, template_uuid, 'Legal', NULL, 10,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Agreements
  agreements_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (agreements_subcat_uuid, template_uuid, 'Agreements',
          legal_cat_uuid, 11,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Payment
  payment_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (payment_cat_uuid, template_uuid, 'Payment', NULL, 12,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Claims-based
  claims_based_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (claims_based_subcat_uuid, template_uuid, 'Claims-based',
          payment_cat_uuid, 13,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Non-claims based
  non_claims_based_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (non_claims_based_subcat_uuid, template_uuid, 'Non-claims based',
          payment_cat_uuid, 14,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Category: Evaluation
  evaluation_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (evaluation_cat_uuid, template_uuid, 'Evaluation', NULL, 15,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sub-category: Uncategorized
  eval_uncat_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (eval_uncat_subcat_uuid, template_uuid, 'Uncategorized',
          evaluation_cat_uuid, 16,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- =========================================================
  -- 3) Milestones
  -- =========================================================

  -- Participants → Application, review, and selection
  recruit_participants_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (recruit_participants_milestone_uuid, template_uuid, 'RECRUIT_PARTICIPANTS', app_review_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Participants → Participant support
  helpdesk_support_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (helpdesk_support_milestone_uuid, template_uuid, 'HELPDESK_SUPPORT', participant_support_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Operations → Set up operations
  iddoc_support_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (iddoc_support_milestone_uuid, template_uuid, 'IDDOC_SUPPORT', setup_ops_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Collect data (category-level)
  data_to_monitor_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (data_to_monitor_milestone_uuid, template_uuid, 'DATA_TO_MONITOR', collect_data_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  data_to_support_eval_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (data_to_support_eval_milestone_uuid, template_uuid, 'DATA_TO_SUPPORT_EVAL', collect_data_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Collect data → Send data to participants
  send_repdata_to_part_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (send_repdata_to_part_milestone_uuid, template_uuid, 'SEND_REPDATA_TO_PART', send_data_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Participant and beneficiary tracking/alignment
  vet_prov_pi_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (vet_prov_pi_milestone_uuid, template_uuid, 'VET_PROVIDERS_FOR_PROGRAM_INTEGRITY', tracking_align_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  manage_prov_overlap_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (manage_prov_overlap_milestone_uuid, template_uuid, 'MANAGE_PROV_OVERLAP', tracking_align_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  manage_ben_overlap_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (manage_ben_overlap_milestone_uuid, template_uuid, 'MANAGE_BEN_OVERLAP', tracking_align_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Benchmarks
  establish_bench_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (establish_bench_milestone_uuid, template_uuid, 'ESTABLISH_BENCH', benchmarks_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Legal → Agreements
  sign_participation_agreements_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (sign_participation_agreements_milestone_uuid, template_uuid, 'SIGN_PARTICIPATION_AGREEMENTS', agreements_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Payment → Claims-based
  adjust_ffs_claims_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (adjust_ffs_claims_milestone_uuid, template_uuid, 'ADJUST_FFS_CLAIMS', claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  manage_ffs_excl_payments_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (manage_ffs_excl_payments_milestone_uuid, template_uuid, 'MANAGE_FFS_EXCL_PAYMENTS', claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Payment → Non-claims based
  make_non_claims_based_payments_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (make_non_claims_based_payments_milestone_uuid, template_uuid, 'MAKE_NON_CLAIMS_BASED_PAYMENTS', non_claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Evaluation → Uncategorized
  app_support_con_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (app_support_con_milestone_uuid, template_uuid, 'APP_SUPPORT_CON', eval_uncat_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- =========================================================
  -- 4) Solutions (template-scoped)
  -- =========================================================

  -- NOTE: Adjust keys below to your canonical mto_common_solution.key values if they differ.
  four_i_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (four_i_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'INNOVATION'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  aco_os_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (aco_os_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'ACO_OS'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  ccw_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (ccw_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'CCW'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  ams_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (ams_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'AMS'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  cbosc_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (cbosc_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'CBOSC'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  ipc_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (ipc_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'IPC'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  isp_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (isp_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'ISP'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  mdm_ncbp_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (mdm_ncbp_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'MDM_NCBP'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  model_space_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (model_space_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'MODEL_SPACE'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  overlaps_workgroup_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (overlaps_workgroup_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'OVERLAPS_OPERATIONS_WORKGROUP'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  salesforce_rfa_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (salesforce_rfa_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'RFA'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  shared_systems_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (shared_systems_solution_uuid, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key = 'SHARED_SYSTEMS'),
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- =========================================================
  -- 5) Milestone ↔ Solution links
  -- =========================================================

  -- Recruit participants -> Salesforce RFA
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, salesforce_rfa_solution_uuid, recruit_participants_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Establish a participant helpdesk -> CBOSC
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, cbosc_solution_uuid, helpdesk_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Establish 4i/ACO-OS support -> 4i and ACO-OS
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, iddoc_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, aco_os_solution_uuid, iddoc_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Collect data to monitor/support eval -> ISP and 4i
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, data_to_monitor_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, data_to_monitor_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, data_to_support_eval_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, data_to_support_eval_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Send reports/data to participants -> ISP and 4i
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, send_repdata_to_part_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, send_repdata_to_part_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Vet providers for program integrity -> 4i
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, vet_prov_pi_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Manage provider/beneficiary overlaps -> Overlaps Workgroup and AMS
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, overlaps_workgroup_solution_uuid, manage_prov_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, ams_solution_uuid, manage_prov_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, overlaps_workgroup_solution_uuid, manage_ben_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, ams_solution_uuid, manage_ben_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Establish benchmarks -> Model Space
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, model_space_solution_uuid, establish_bench_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Sign Participation Agreements -> 4i
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, sign_participation_agreements_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Claims-based: Adjust FFS claims / Manage FFS excluded payments -> Shared Systems
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, shared_systems_solution_uuid, adjust_ffs_claims_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, shared_systems_solution_uuid, manage_ffs_excl_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Non-claims based: Make non-claims based payments -> IPC + MDM-NCBP
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, ipc_solution_uuid, make_non_claims_based_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, mdm_ncbp_solution_uuid, make_non_claims_based_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Evaluation: Acquire an evaluation contractor -> (no solution link per spec) — intentionally none.

END $$;

COMMIT;
