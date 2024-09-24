CREATE TYPE DEA_DATA_TO_COLLECT_FROM_PARTICIPANTS AS ENUM (
  'BANKING_INFORMATION_TO_MAKE_NON_CLAIMS_BASED_PAYMENTS',
  'CLINICAL_DATA',
  'COLLECT_BIDS_AND_PLAN_INFORMATION',
  'COOPERATIVE_AGREEMENT_APPLICATION',
  'DECARBONIZATION_DATA',
  'EXPANDED_DEMOGRAPHICS_DATA',
  'FEE_FOR_SERVICE_CLAIMS_AND_APPLY_MODEL_RULES',
  'LEARNING_SYSTEM_METRICS',
  'PARTICIPANT_AGREEMENT',
  'PARTICIPANT_AGREEMENT_LETTER_OF_INTENT',
  'PARTICIPANT_AGREEMENT_REQUEST_FOR_APPLICATION',
  'PARTICIPANT_REPORTED_DATA',
  'PARTICIPANT_REPORTED_QUALITY_MEASURES',
  'PROVIDER_PARTICIPANT_ROSTER',
  'REPORTS_FROM_PARTICIPANTS',
  'SOCIAL_DETERMINANTS_OF_HEALTH',
  'SURVEY',
  'OTHER'
  );

CREATE TYPE DEA_DATA_TO_SEND_TO_PARTICIPANTS AS ENUM (
  'DATA_FEEDBACK_DASHBOARD',
  'NON_CLAIMS_BASED_PAYMENTS',
  'OPERATIONS_DATA',
  'PARTIALLY_ADJUSTED_CLAIMS_DATA',
  'RAW_CLAIMS_DATA',
  'DATA_WILL_NOT_BE_SENT_TO_PARTICIPANTS'
  );

CREATE TYPE DEA_ANTICIPATED_MULTI_PAYER_DATA_AVAILABILITY_USE_CASE AS ENUM (
  'MORE_COMPETENT_ALERT_DISCHARGE_TRANSFER_NOTIFICATION',
  'SUPPLY_MULTI_PAYER_CLAIMS_COST_UTIL_AND_QUALITY_REPORTING',
  'FILL_GAPS_IN_CARE_ALERTING_AND_REPORTS'
  );

CREATE TYPE DEA_MULTI_SOURCE_DATA_TO_COLLECT AS ENUM (
  'COMMERCIAL_CLAIMS',
  'LAB_DATA',
  'MANUFACTURER',
  'MEDICAID_CLAIMS',
  'MEDICARE_CLAIMS',
  'PATIENT_REGISTRY',
  'OTHER'
  );

CREATE TABLE plan_data_exchange_approach (
                                      id UUID PRIMARY KEY NOT NULL,
                                      model_plan_id UUID NOT NULL REFERENCES model_plan(id),

  -- page 2
                                      data_to_collect_from_participants DEA_DATA_TO_COLLECT_FROM_PARTICIPANTS[] NOT NULL,
                                      data_to_collect_from_participants_reports_details ZERO_STRING,
                                      data_to_collect_from_participants_other ZERO_STRING,
                                      data_will_not_be_collected_from_participants BOOLEAN NOT NULL DEFAULT FALSE,
                                      data_to_collect_from_participants_note ZERO_STRING,

                                      data_to_send_to_participants DEA_DATA_TO_SEND_TO_PARTICIPANTS DEFAULT NULL,
                                      data_to_send_to_participants_note ZERO_STRING,

  -- page 3
                                      does_need_to_make_multi_payer_data_available YES_NO_TYPE DEFAULT NULL,
                                      anticipated_multi_payer_data_availability_use_case DEA_ANTICIPATED_MULTI_PAYER_DATA_AVAILABILITY_USE_CASE DEFAULT NULL,
                                      does_need_to_make_multi_payer_data_available_other ZERO_STRING,
                                      does_need_to_make_multi_payer_data_available_note ZERO_STRING,

                                      does_need_to_collect_and_aggregate_multi_source_data YES_NO_TYPE DEFAULT NULL,
                                      multi_source_data_to_collect DEA_MULTI_SOURCE_DATA_TO_COLLECT DEFAULT NULL,
                                      multi_source_data_to_collect_other ZERO_STRING,
                                      does_need_to_collect_and_aggregate_multi_source_data_note ZERO_STRING,

-- page 4
                                      will_implement_new_data_exchange_methods YES_NO_TYPE DEFAULT NULL,
                                      new_data_exchange_methods_description ZERO_STRING,
                                      new_data_exchange_methods_note ZERO_STRING,

                                      is_data_exchange_approach_complete BOOLEAN NOT NULL DEFAULT FALSE,

  -- META DATA
                                      created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE NOT NULL,
                                      created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
                                      modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      modified_dts TIMESTAMP WITH TIME ZONE,
                                      ready_for_review_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      ready_for_review_dts TIMESTAMP WITH TIME ZONE,
                                      ready_for_clearance_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
                                      ready_for_clearance_dts TIMESTAMP WITH TIME ZONE,
                                      status TASK_STATUS NOT NULL DEFAULT 'READY'
);

COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants IS 'Data to collect from participants';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_reports_details IS 'Data to collect from participants - Reports details';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_other IS 'Data to collect from participants - Other';
COMMENT ON COLUMN plan_data_exchange_approach.data_will_not_be_collected_from_participants IS 'Data will not be collected from participants';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_note IS 'Data to collect from participants - Note';

COMMENT ON COLUMN plan_data_exchange_approach.data_to_send_to_participants IS 'Data to send to participants';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_send_to_participants_note IS 'Data to send to participants - Note';

COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_make_multi_payer_data_available IS 'Does need to make multi-payer data available';
COMMENT ON COLUMN plan_data_exchange_approach.anticipated_multi_payer_data_availability_use_case IS 'Anticipated multi-payer data availability use case';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_make_multi_payer_data_available_other IS 'Does need to make multi-payer data available - Other';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_make_multi_payer_data_available_note IS 'Does need to make multi-payer data available - Note';

COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_collect_and_aggregate_multi_source_data IS 'Does need to collect and aggregate multi-source data';
COMMENT ON COLUMN plan_data_exchange_approach.multi_source_data_to_collect IS 'Multi-source data to collect';
COMMENT ON COLUMN plan_data_exchange_approach.multi_source_data_to_collect_other IS 'Multi-source data to collect - Other';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_collect_and_aggregate_multi_source_data_note IS 'Does need to collect and aggregate multi-source data - Note';

COMMENT ON COLUMN plan_data_exchange_approach.will_implement_new_data_exchange_methods IS 'Will implement new data exchange methods';
COMMENT ON COLUMN plan_data_exchange_approach.new_data_exchange_methods_description IS 'New data exchange methods description';
COMMENT ON COLUMN plan_data_exchange_approach.new_data_exchange_methods_note IS 'New data exchange methods - Note';

COMMENT ON COLUMN plan_data_exchange_approach.is_data_exchange_approach_complete IS 'Is data exchange approach complete';

COMMENT ON TABLE plan_data_exchange_approach IS 'Data Exchange Approach';
