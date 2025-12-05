-- Insert new common milestones
-- This is in a separate migration from the enum additions because PostgreSQL
-- requires enum values to be committed before they can be used

INSERT INTO "public"."mto_common_milestone"("key","name","category_name","sub_category_name","facilitated_by_role","section","trigger_table","trigger_col","trigger_vals","description")
VALUES
-- High priority contractor milestones (manual add only - no auto-suggest)
('ACQUIRE_AN_IMP_CONT','Acquire an implementation contractor','Operations','Internal functions','{CONTRACTING_OFFICERS_REPRESENTATIVE}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{contractor_needed}','{NONE}','Advertise the opportunity to bid on work related to managing day to day operations of a model, review the bids and select the implementation contractor.'),
('ACQUIRE_A_PRE_IMP_CONT','Acquire support from a pre-implementation contractor','Operations','Internal functions','{MODEL_TEAM}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{contractor_needed}','{NONE}','Get research and analysis support in developing the model design. Pre-implementation contractors can support models before implementation funds become available (i.e., before clearance).'),
('ACQUIRE_A_DATA_AGG_CONT','Acquire support from a data aggregation contractor','Operations','Internal functions','{IT_LEAD,IT_SYSTEM_PRODUCT_OWNER}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{contractor_needed}','{NONE}','Integrate external data sources with existing CMS data.'),

-- Data sharing milestones (auto-suggest based on data_to_send_particicipants answers)
-- These reuse the existing trigger from SEND_REPDATA_TO_PART milestone
('SEND_DASHBOARDS_REPORTS_TO_PART','Send dashboards and/or reports to participants','Operations','Send data to participants','{IT_LEAD,IT_SYSTEM_PRODUCT_OWNER,IMPLEMENTATION_CONTRACTOR}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{data_to_send_particicipants}','{BASELINE_HISTORICAL_DATA,CLAIMS_LEVEL_DATA,BENEFICIARY_LEVEL_DATA,PARTICIPANT_LEVEL_DATA,PROVIDER_LEVEL_DATA,OTHER_MIPS_DATA}','Share participant feedback and other dashboards with participants.'),
('SEND_DATA_VIA_API_TO_PART','Send data via API to participants','Operations','Send data to participants','{IT_LEAD,IT_SYSTEM_PRODUCT_OWNER,IMPLEMENTATION_CONTRACTOR}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{data_to_send_particicipants}','{BASELINE_HISTORICAL_DATA,CLAIMS_LEVEL_DATA,BENEFICIARY_LEVEL_DATA,PARTICIPANT_LEVEL_DATA,PROVIDER_LEVEL_DATA,OTHER_MIPS_DATA}','Send data via Application Programming Interface (API) to participants.'),
('SEND_RAW_FILES_TO_PART','Send raw files to participants','Operations','Send data to participants','{IT_LEAD,IT_SYSTEM_PRODUCT_OWNER,IMPLEMENTATION_CONTRACTOR}','OPERATIONS_EVALUATION_AND_LEARNING','plan_ops_eval_and_learning','{data_to_send_particicipants}','{BASELINE_HISTORICAL_DATA,CLAIMS_LEVEL_DATA,BENEFICIARY_LEVEL_DATA,PARTICIPANT_LEVEL_DATA,PROVIDER_LEVEL_DATA,OTHER_MIPS_DATA}','Send raw claims files to participants (e.g., CMS Claims and Claims Line Feeds (CCLF)). ACO models will likely use 4innovation (4i), and non-ACO models will likely use systems within the Innovation Support Platform (ISP).'),

-- Cooperative Agreements milestone (auto-suggest based on agreement_types)
-- Reuses the existing trigger pattern from SIGN_PARTICIPATION_AGREEMENTS milestone
('SIGN_COOPERATIVE_AGREEMENTS','Sign Cooperative Agreements','Legal','Agreements','{MODEL_TEAM}','GENERAL_CHARACTERISTICS','plan_general_characteristics','{agreement_types}','{COOPERATIVE}','Make Cooperative Agreements available to participants and support each participant signing and CMS counter-signing.');
