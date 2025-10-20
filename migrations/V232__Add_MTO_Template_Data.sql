BEGIN;

-- =========================================================
-- Insert MEDICARE_ADVANTAGE_AND_DRUG_MODELS template data
-- (Payment category INCLUDED)
-- =========================================================

-- Insert the template
INSERT INTO mto_template (id, key, name, description, created_by, created_dts) 
VALUES (
    gen_random_uuid(),
    'MEDICARE_ADVANTAGE_AND_DRUG_MODELS',
    'Medicare Advantage and Part D models',
    'Medicare Advantage and Part D models involve changes to payments or services for Medicare Advantage (Part C) and/or to Part D models. These models often leverage a set of systems supported by the Center for Medicare (CM) and/or Office of Information Technology (OIT) teams who support Parts C and D. ',
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
    payment_cat_uuid UUID;      -- ADDED
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
        0,
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
        1,
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
        2,
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
        3,
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
        4,
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
        5,
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
        6,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Category 4: Payment  (kept, as requested)
    -- =========================================================
    payment_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (
        payment_cat_uuid,
        template_uuid,
        'Payment',
        NULL,
        7,
        '00000001-0001-0001-0001-000000000001'::UUID,
        CURRENT_TIMESTAMP
    );

    -- =========================================================
    -- Category 5: Payers
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
  'ACO and kidney models',
  'Accountable Care Organization (ACO) models and the kidney models use a slightly different set of systems from many other models. ACO models incentivize providers through financial rewards for achieving high-quality care and cost savings. The kidney models involve improving care for patients with End-Stage Renal Disease and chronic kidney disease through a range of approaches.',
  '00000001-0001-0001-0001-000000000001'::UUID,
  CURRENT_TIMESTAMP
);

DO $$
DECLARE
  template_uuid UUID;

  -- Category UUIDs
  participants_cat_uuid UUID;
  operations_cat_uuid UUID;
  legal_cat_uuid UUID;
  payment_cat_uuid UUID;
  evaluation_cat_uuid UUID;

  -- Sub-category UUIDs
  app_review_subcat_uuid UUID;
  participant_support_subcat_uuid UUID;
  setup_ops_subcat_uuid UUID;
  collect_data_cat_uuid UUID;
  send_data_subcat_uuid UUID;
  tracking_align_cat_uuid UUID;
  benchmarks_cat_uuid UUID;
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
  four_i_solution_uuid UUID;
  aco_os_solution_uuid UUID;
  ccw_solution_uuid UUID;
  ams_solution_uuid UUID;
  cbosc_solution_uuid UUID;
  ipc_solution_uuid UUID;
  isp_solution_uuid UUID;
  mdm_ncbp_solution_uuid UUID;
  model_space_solution_uuid UUID;
  overlaps_wg_solution_uuid UUID;
  salesforce_rfa_solution_uuid UUID;
  shared_systems_solution_uuid UUID;
BEGIN
  SELECT id INTO template_uuid FROM mto_template WHERE key = 'ACO_AND_KIDNEY_MODELS';

  -- Categories & Sub-categories
  participants_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participants_cat_uuid, template_uuid, 'Participants', NULL, 0,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  app_review_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (app_review_subcat_uuid, template_uuid, 'Application, review, and selection',
          participants_cat_uuid, 1,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  participant_support_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participant_support_subcat_uuid, template_uuid, 'Participant support',
          participants_cat_uuid, 2,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  operations_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (operations_cat_uuid, template_uuid, 'Operations', NULL, 3,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  setup_ops_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (setup_ops_subcat_uuid, template_uuid, 'Set up operations',
          operations_cat_uuid, 4,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  collect_data_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (collect_data_cat_uuid, template_uuid, 'Collect data', operations_cat_uuid, 5,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  send_data_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (send_data_subcat_uuid, template_uuid, 'Send data to participants',
          operations_cat_uuid, 6,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  tracking_align_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (tracking_align_cat_uuid, template_uuid, 'Participant and beneficiary tracking/alignment', operations_cat_uuid, 7,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  benchmarks_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (benchmarks_cat_uuid, template_uuid, 'Benchmarks', operations_cat_uuid, 8,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  legal_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (legal_cat_uuid, template_uuid, 'Legal', NULL, 9,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  agreements_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (agreements_subcat_uuid, template_uuid, 'Agreements',
          legal_cat_uuid, 10,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  payment_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (payment_cat_uuid, template_uuid, 'Payment', NULL, 11,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  non_claims_based_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (non_claims_based_subcat_uuid, template_uuid, 'Non-claims based',
          payment_cat_uuid, 12,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  evaluation_cat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (evaluation_cat_uuid, template_uuid, 'Evaluation', NULL, 13,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  eval_uncat_subcat_uuid := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (eval_uncat_subcat_uuid, template_uuid, 'Uncategorized',
          evaluation_cat_uuid, 14,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Milestones
  recruit_participants_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (recruit_participants_milestone_uuid, template_uuid, 'RECRUIT_PARTICIPANTS', app_review_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  helpdesk_support_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (helpdesk_support_milestone_uuid, template_uuid, 'HELPDESK_SUPPORT', participant_support_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  iddoc_support_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (iddoc_support_milestone_uuid, template_uuid, 'IDDOC_SUPPORT', setup_ops_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  data_to_monitor_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (data_to_monitor_milestone_uuid, template_uuid, 'DATA_TO_MONITOR', collect_data_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  data_to_support_eval_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (data_to_support_eval_milestone_uuid, template_uuid, 'DATA_TO_SUPPORT_EVAL', collect_data_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  send_repdata_to_part_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (send_repdata_to_part_milestone_uuid, template_uuid, 'SEND_REPDATA_TO_PART', send_data_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

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

  establish_bench_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (establish_bench_milestone_uuid, template_uuid, 'ESTABLISH_BENCH', benchmarks_cat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  sign_participation_agreements_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (sign_participation_agreements_milestone_uuid, template_uuid, 'SIGN_PARTICIPATION_AGREEMENTS', agreements_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  adjust_ffs_claims_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (adjust_ffs_claims_milestone_uuid, template_uuid, 'ADJUST_FFS_CLAIMS', claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  manage_ffs_excl_payments_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (manage_ffs_excl_payments_milestone_uuid, template_uuid, 'MANAGE_FFS_EXCL_PAYMENTS', claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  make_non_claims_based_payments_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (make_non_claims_based_payments_milestone_uuid, template_uuid, 'MAKE_NON_CLAIMS_BASED_PAYMENTS', non_claims_based_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  app_support_con_milestone_uuid := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (app_support_con_milestone_uuid, template_uuid, 'ACQUIRE_AN_EVAL_CONT', eval_uncat_subcat_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  -- Solutions
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

  overlaps_wg_solution_uuid := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (overlaps_wg_solution_uuid, template_uuid,
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

  -- Milestone ↔ Solution links
  INSERT INTO mto_template_milestone_solution_link (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES (gen_random_uuid(), template_uuid, salesforce_rfa_solution_uuid, recruit_participants_milestone_uuid,
          '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, cbosc_solution_uuid, helpdesk_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, iddoc_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, aco_os_solution_uuid, iddoc_support_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, data_to_monitor_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, data_to_monitor_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, data_to_support_eval_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, data_to_support_eval_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp_solution_uuid, send_repdata_to_part_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, send_repdata_to_part_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, vet_prov_pi_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, overlaps_wg_solution_uuid, manage_prov_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ams_solution_uuid, manage_prov_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, overlaps_wg_solution_uuid, manage_ben_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ams_solution_uuid, manage_ben_overlap_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, model_space_solution_uuid, establish_bench_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, four_i_solution_uuid, sign_participation_agreements_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, shared_systems_solution_uuid, adjust_ffs_claims_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, shared_systems_solution_uuid, manage_ffs_excl_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ipc_solution_uuid, make_non_claims_based_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, mdm_ncbp_solution_uuid, make_non_claims_based_payments_milestone_uuid,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Evaluation: Acquire an evaluation contractor -> intentionally no solution link
END $$;

COMMIT;

BEGIN;

-- ======================================
-- EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS
-- ======================================
INSERT INTO mto_template (id, key, name, description, created_by, created_dts)
VALUES (
  gen_random_uuid(),
  'EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS',
  'Episode, primary care, and non-ACO models',
  'Episode-based models, primary care models, and non-Accountable Care Organization (ACO) models tend to use a similar set of systems for their operations. Episode-based models involve a pre-determined, often bundled payment for a defined, comprehensive episode of care. Primary care models involve advanced approaches to the delivery of primary care. Non-ACO models are other models that are not ACOs or kidney models and may use this similar set of systems as episode-based and primary care models.',
  '00000001-0001-0001-0001-000000000001'::uuid,
  CURRENT_TIMESTAMP
);

DO $$
DECLARE
  template_uuid uuid;

  -- categories
  participants_cat uuid;
  operations_cat uuid;
  legal_cat uuid;
  payment_cat uuid;
  evaluation_cat uuid;

  -- subcats
  app_review_subcat uuid;
  participant_support_subcat uuid;
  collect_data_subcat uuid;
  send_data_subcat uuid;
  track_align_subcat uuid;
  agreements_subcat uuid;
  claims_based_subcat uuid;
  non_claims_based_subcat uuid;
  eval_uncat_subcat uuid;

  -- milestones
  recruit_participants uuid;
  helpdesk_support uuid;
  participant_collaboration uuid;
  collect_data_to_monitor uuid;
  collect_data_to_support_eval uuid;
  send_reports_to_part uuid;
  manage_prov_overlap uuid;
  manage_ben_overlap uuid;
  sign_participation_agreements uuid;
  adjust_ffs_claims uuid;
  manage_ffs_excl_payments uuid;
  make_non_claims_based_payments uuid;
  acquire_eval_contractor uuid;

  -- solutions
  cbosc uuid; ams uuid; isp uuid; overlaps_wg uuid; ipc uuid; mdm_ncbp uuid; shared_systems uuid;
  ccw uuid; idr uuid; model_space uuid; connect uuid; rfa uuid;
BEGIN
  SELECT id INTO template_uuid
  FROM mto_template WHERE key='EPISODE_PRIMARY_CARE_AND_NON_ACO_MODELS';

  -- categories
  participants_cat := gen_random_uuid();
  INSERT INTO mto_template_category(id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participants_cat, template_uuid, 'Participants', NULL, 0, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  app_review_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (app_review_subcat, template_uuid, 'Application, review, and selection', participants_cat, 1, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  participant_support_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (participant_support_subcat, template_uuid, 'Participant support', participants_cat, 2, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  operations_cat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (operations_cat, template_uuid, 'Operations', NULL, 3, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  collect_data_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (collect_data_subcat, template_uuid, 'Collect data', operations_cat, 4, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  send_data_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (send_data_subcat, template_uuid, 'Send data to participants', operations_cat, 5, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  track_align_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (track_align_subcat, template_uuid, 'Participant and beneficiary tracking/alignment', operations_cat, 6, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  legal_cat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (legal_cat, template_uuid, 'Legal', NULL, 7, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  agreements_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (agreements_subcat, template_uuid, 'Agreements', legal_cat, 8, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  payment_cat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (payment_cat, template_uuid, 'Payment', NULL, 9, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

--   claims_based_subcat := gen_random_uuid();
--   INSERT INTO mto_template_category VALUES (claims_based_subcat, template_uuid, 'Claims based', payment_cat, 10, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  non_claims_based_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (non_claims_based_subcat, template_uuid, 'Non-claims based', payment_cat, 11, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  evaluation_cat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (evaluation_cat, template_uuid, 'Evaluation', NULL, 12, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  eval_uncat_subcat := gen_random_uuid();
  INSERT INTO mto_template_category VALUES (eval_uncat_subcat, template_uuid, 'Uncategorized', evaluation_cat, 13, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- milestones (only those with provided keys)
  recruit_participants := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (recruit_participants, template_uuid, 'RECRUIT_PARTICIPANTS', app_review_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  helpdesk_support := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (helpdesk_support, template_uuid, 'HELPDESK_SUPPORT', participant_support_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  participant_collaboration := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (participant_collaboration, template_uuid, 'PART_TO_PART_COLLAB', participant_support_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  collect_data_to_monitor := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (collect_data_to_monitor, template_uuid, 'DATA_TO_MONITOR', collect_data_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  collect_data_to_support_eval := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (collect_data_to_support_eval, template_uuid, 'DATA_TO_SUPPORT_EVAL', collect_data_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  send_reports_to_part := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (send_reports_to_part, template_uuid, 'SEND_REPDATA_TO_PART', send_data_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  manage_prov_overlap := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (manage_prov_overlap, template_uuid, 'MANAGE_PROV_OVERLAP', track_align_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  manage_ben_overlap := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (manage_ben_overlap, template_uuid, 'MANAGE_BEN_OVERLAP', track_align_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  sign_participation_agreements := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (sign_participation_agreements, template_uuid, 'SIGN_PARTICIPATION_AGREEMENTS', agreements_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  adjust_ffs_claims := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (adjust_ffs_claims, template_uuid, 'ADJUST_FFS_CLAIMS', claims_based_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  manage_ffs_excl_payments := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (manage_ffs_excl_payments, template_uuid, 'MANAGE_FFS_EXCL_PAYMENTS', claims_based_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  make_non_claims_based_payments := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (make_non_claims_based_payments, template_uuid, 'MAKE_NON_CLAIMS_BASED_PAYMENTS', non_claims_based_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  acquire_eval_contractor := gen_random_uuid();
  INSERT INTO mto_template_milestone VALUES (acquire_eval_contractor, template_uuid, 'ACQUIRE_AN_EVAL_CONT', eval_uncat_subcat, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- solutions
  cbosc := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (cbosc, template_uuid, (SELECT id FROM mto_common_solution WHERE key='CBOSC'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  ams := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (ams, template_uuid, (SELECT id FROM mto_common_solution WHERE key='AMS'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  isp := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (isp, template_uuid, (SELECT id FROM mto_common_solution WHERE key='ISP'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  overlaps_wg := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (overlaps_wg, template_uuid, (SELECT id FROM mto_common_solution WHERE key='OVERLAPS_OPERATIONS_WORKGROUP'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  ipc := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (ipc, template_uuid, (SELECT id FROM mto_common_solution WHERE key='IPC'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  mdm_ncbp := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (mdm_ncbp, template_uuid, (SELECT id FROM mto_common_solution WHERE key='MDM_NCBP'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  shared_systems := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (shared_systems, template_uuid, (SELECT id FROM mto_common_solution WHERE key='SHARED_SYSTEMS'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  ccw := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (ccw, template_uuid, (SELECT id FROM mto_common_solution WHERE key='CCW'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  idr := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (idr, template_uuid, (SELECT id FROM mto_common_solution WHERE key='IDR'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  model_space := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (model_space, template_uuid, (SELECT id FROM mto_common_solution WHERE key='MODEL_SPACE'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  connect := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (connect, template_uuid, (SELECT id FROM mto_common_solution WHERE key='CONNECT'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  rfa := gen_random_uuid();
  INSERT INTO mto_template_solution VALUES (rfa, template_uuid, (SELECT id FROM mto_common_solution WHERE key='RFA'), '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- links
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, rfa, recruit_participants, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, cbosc, helpdesk_support, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, connect, participant_collaboration, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp, collect_data_to_monitor, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp, collect_data_to_support_eval, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, isp, send_reports_to_part, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, overlaps_wg, manage_prov_overlap, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ams,      manage_prov_overlap, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, overlaps_wg, manage_ben_overlap, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ams,      manage_ben_overlap, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, shared_systems, adjust_ffs_claims, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, shared_systems, manage_ffs_excl_payments, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, ipc,       make_non_claims_based_payments, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);
  INSERT INTO mto_template_milestone_solution_link VALUES (gen_random_uuid(), template_uuid, mdm_ncbp,  make_non_claims_based_payments, '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- (CONNECT + ISP links pending specific milestone keys per your TODOs)
END $$;

COMMIT;

BEGIN;

BEGIN;

-- =========================================================
-- Insert STANDARD_CATEGORIES template data
-- =========================================================

INSERT INTO mto_template (id, key, name, description, created_by, created_dts)
VALUES (
    gen_random_uuid(),
    'STANDARD_CATEGORIES',
    'Standard categories',
    'Many teams find it useful to organize the model milestones in their into overarching high-level categories and sub-categories. MINT offers a template set of standard categories as a starting point for new MTOs. The categories and sub-categories in this template represent some of the most common model phases and/or groupings for model activities. Once you’ve added this template, you may add or remove categories as your model requires, and you may add milestones to the added categories. This template does not include milestones or solutions and IT systems.',
    '00000001-0001-0001-0001-000000000001'::UUID,
    current_timestamp
);

DO $$
DECLARE
    template_uuid UUID;

    -- Category UUIDs
    participants_cat_uuid UUID;
    operations_cat_uuid UUID;
    legal_cat_uuid UUID;
    payment_cat_uuid UUID;
    payers_cat_uuid UUID;
    quality_cat_uuid UUID;
    learning_cat_uuid UUID;
    evaluation_cat_uuid UUID;
    model_closeout_cat_uuid UUID;

    -- Sub-category UUIDs
    app_review_subcat_uuid UUID;
    participant_support_subcat_uuid UUID;
    setup_ops_subcat_uuid UUID;
    collect_data_subcat_uuid UUID;
    send_data_subcat_uuid UUID;
    tracking_align_subcat_uuid UUID;
    benchmarks_subcat_uuid UUID;
    claims_based_subcat_uuid UUID;
    internal_funcs_subcat_uuid UUID;
    ffs_subcat_uuid UUID;
    monitoring_subcat_uuid UUID;
    agreements_subcat_uuid UUID;
    benefit_enh_subcat_uuid UUID;
    bene_engage_subcat_uuid UUID;
    non_claims_based_subcat_uuid UUID;
BEGIN
    SELECT id INTO template_uuid FROM mto_template WHERE key = 'STANDARD_CATEGORIES';

    -- Participants
    participants_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
    VALUES (participants_cat_uuid, template_uuid, 'Participants', NULL, 0,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    app_review_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (app_review_subcat_uuid, template_uuid, 'Application, review, and selection', participants_cat_uuid, 1,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    participant_support_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (participant_support_subcat_uuid, template_uuid, 'Participant support', participants_cat_uuid, 2,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    -- Operations
    operations_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (operations_cat_uuid, template_uuid, 'Operations', NULL, 3,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    setup_ops_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (setup_ops_subcat_uuid, template_uuid, 'Set up operations', operations_cat_uuid, 4,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    collect_data_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (collect_data_subcat_uuid, template_uuid, 'Collect data', operations_cat_uuid, 5,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    send_data_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (send_data_subcat_uuid, template_uuid, 'Send data to participants', operations_cat_uuid, 6,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    tracking_align_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (tracking_align_subcat_uuid, template_uuid, 'Participant and beneficiary tracking/alignment', operations_cat_uuid, 7,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    benchmarks_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (benchmarks_subcat_uuid, template_uuid, 'Benchmarks', operations_cat_uuid, 8,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    internal_funcs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (internal_funcs_subcat_uuid, template_uuid, 'Internal functions', operations_cat_uuid, 9,
    '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    ffs_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (ffs_subcat_uuid, template_uuid, 'Fee-for-service (FFS)', operations_cat_uuid, 10,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    monitoring_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (monitoring_subcat_uuid, template_uuid, 'Monitoring', operations_cat_uuid, 11,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    -- Legal
    legal_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (legal_cat_uuid, template_uuid, 'Legal', NULL, 12,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    agreements_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (agreements_subcat_uuid, template_uuid, 'Agreements', legal_cat_uuid, 13,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    benefit_enh_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (benefit_enh_subcat_uuid, template_uuid, 'Benefit enhancements', legal_cat_uuid, 14,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    bene_engage_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (bene_engage_subcat_uuid, template_uuid, 'Beneficiary engagement and incentives', legal_cat_uuid, 15,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    -- Payment
    payment_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (payment_cat_uuid, template_uuid, 'Payment', NULL, 16,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    claims_based_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (claims_based_subcat_uuid, template_uuid, 'Claims-based', payment_cat_uuid, 17,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    non_claims_based_subcat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (non_claims_based_subcat_uuid, template_uuid, 'Non-claims based', payment_cat_uuid, 18,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    -- Remaining top-level categories
    payers_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (payers_cat_uuid, template_uuid, 'Payers', NULL, 19,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    quality_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (quality_cat_uuid, template_uuid, 'Quality', NULL, 20,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    learning_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (learning_cat_uuid, template_uuid, 'Learning', NULL, 21,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    evaluation_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (evaluation_cat_uuid, template_uuid, 'Evaluation', NULL, 22,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

    model_closeout_cat_uuid := gen_random_uuid();
    INSERT INTO mto_template_category VALUES (model_closeout_cat_uuid, template_uuid, 'Model closeout or extension', NULL, 23,
        '00000001-0001-0001-0001-000000000001'::UUID, CURRENT_TIMESTAMP);

END $$;

COMMIT;

BEGIN;

-- =====================
-- STATE_AND_LOCAL_MODELS
-- =====================
INSERT INTO mto_template (id, key, name, description, created_by, created_dts)
VALUES (
  gen_random_uuid(),
  'STATE_AND_LOCAL_MODELS',
  'State and local models',
  'State and local models often involve working with states, or with states in conjunction with providers. Many state and local models involve Cooperative Agreements to financially support those we are collaborating with in preparing for an implementation phase, when payments and care will change for a particular population.',
  '00000001-0001-0001-0001-000000000001'::uuid,
  CURRENT_TIMESTAMP
);

DO $$
DECLARE
  template_uuid uuid;

  -- categories
  participants uuid; 
  operations uuid; 
  legal uuid; 
  learning uuid; 
  evaluation uuid;

  -- sub-categories
  app_review uuid; 
  participant_support uuid;
  collect_data uuid; 
  send_data uuid;
  agreements uuid;
  learning_uncat uuid;
  eval_uncat uuid;

  -- milestones (keys provided)
  recruit_participants uuid;
  review_score_app uuid;
  comm_with_part uuid;
  helpdesk_support uuid;
  collect_data_to_monitor uuid;
  collect_data_to_support_eval uuid;
  send_reports_to_part uuid;
  acquire_learn_contractor uuid;
  acquire_eval_contractor uuid;

  -- solutions (keys provided)
  gs uuid; 
  cbosc uuid; 
  isp uuid;
  portal uuid;
  ccw uuid; 
  ipc uuid;

BEGIN
  SELECT id INTO template_uuid FROM mto_template WHERE key='STATE_AND_LOCAL_MODELS';

  /* ==========================
     Categories & Sub-categories
     ========================== */

  -- Participants
  participants := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participants, template_uuid, 'Participants', NULL, 0,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Participants → Application, review, and selection
  app_review := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (app_review, template_uuid, 'Application, review, and selection', participants, 1,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Participants → Participant support
  participant_support := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (participant_support, template_uuid, 'Participant support', participants, 2,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations
  operations := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (operations, template_uuid, 'Operations', NULL, 3,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data
  collect_data := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (collect_data, template_uuid, 'Collect data', operations, 4,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Send data to participants
  send_data := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (send_data, template_uuid, 'Send data to participants', operations, 5,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Legal
  legal := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (legal, template_uuid, 'Legal', NULL, 6,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Legal → Agreements
  agreements := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (agreements, template_uuid, 'Agreements', legal, 7,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Learning
  learning := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (learning, template_uuid, 'Learning', NULL, 8,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Learning → Uncategorized
  learning_uncat := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (learning_uncat, template_uuid, 'Uncategorized', learning, 9,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Evaluation
  evaluation := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (evaluation, template_uuid, 'Evaluation', NULL, 10,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Evaluation → Uncategorized
  eval_uncat := gen_random_uuid();
  INSERT INTO mto_template_category (id, template_id, name, parent_id, "order", created_by, created_dts)
  VALUES (eval_uncat, template_uuid, 'Uncategorized', evaluation, 11,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);


  /* ==========
     Milestones
     ========== */

  -- Participants → Application, review, and selection
  recruit_participants := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (recruit_participants, template_uuid, 'RECRUIT_PARTICIPANTS', app_review,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  review_score_app := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (review_score_app, template_uuid, 'REV_SCORE_APP', app_review,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Participants → Participant support
  comm_with_part := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (comm_with_part, template_uuid, 'COMM_W_PART', participant_support,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  helpdesk_support := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (helpdesk_support, template_uuid, 'HELPDESK_SUPPORT', participant_support,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data
  collect_data_to_monitor := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (collect_data_to_monitor, template_uuid, 'DATA_TO_MONITOR', collect_data,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data
  collect_data_to_support_eval := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (collect_data_to_support_eval, template_uuid, 'DATA_TO_SUPPORT_EVAL', collect_data,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Send data to participants
  send_reports_to_part := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (send_reports_to_part, template_uuid, 'SEND_REPDATA_TO_PART', send_data,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Evaluation → Uncategorized
  acquire_eval_contractor := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (acquire_eval_contractor, template_uuid, 'ACQUIRE_AN_EVAL_CONT', eval_uncat,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Learning → Uncategorized
  acquire_learn_contractor := gen_random_uuid();
  INSERT INTO mto_template_milestone (id, template_id, mto_common_milestone_key, mto_template_category_id, created_by, created_dts)
  VALUES (acquire_learn_contractor, template_uuid, 'ACQUIRE_A_LEARN_CONT', learning_uncat,
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  /* =========
     Solutions
     ========= */

  -- GrantSolutions (GS)
  gs := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (gs, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key='GS'),
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Consolidated Business Operations Support Center (CBOSC)
  cbosc := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (cbosc, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key='CBOSC'),
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Innovation Support Platform (ISP)
  isp := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (isp, template_uuid,
        (SELECT id FROM mto_common_solution WHERE key='ISP'),
        '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Portal
  portal := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (portal, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key='POST_PORTAL'),
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Chronic Conditions Warehouse (CCW) — (no specific milestone link provided)
  ccw := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (ccw, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key='CCW'),
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Innovation Payment Contractor (IPC) — (no specific milestone link provided)
  ipc := gen_random_uuid();
  INSERT INTO mto_template_solution (id, template_id, mto_common_solution_id, created_by, created_dts)
  VALUES (ipc, template_uuid,
          (SELECT id FROM mto_common_solution WHERE key='IPC'),
          '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);


  /* ============================
     Milestone ↔ Solution Links
     ============================ */

  -- Recruit participants → GrantSolutions (GS)
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, gs, recruit_participants,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Review and score applications → GrantSolutions (GS)
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, gs, review_score_app,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Establish a participant helpdesk → CBOSC
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, cbosc, helpdesk_support,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data - ISP
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, isp, collect_data_to_monitor,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data - Portal
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, portal, collect_data_to_monitor,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data - ISP
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, isp, collect_data_to_support_eval,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Collect data - Portal
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, portal, collect_data_to_support_eval,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);

  -- Operations → Send data to participants - ISP
  INSERT INTO mto_template_milestone_solution_link
    (id, template_id, mto_template_solution, mto_template_milestone, created_by, created_dts)
  VALUES
    (gen_random_uuid(), template_uuid, isp, send_reports_to_part,
     '00000001-0001-0001-0001-000000000001', CURRENT_TIMESTAMP);



END $$;

COMMIT;
