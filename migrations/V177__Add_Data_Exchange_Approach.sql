ALTER TYPE TABLE_NAME ADD VALUE 'plan_data_exchange_approach';

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

CREATE TYPE DEA_TASK_LIST_STATUS AS ENUM (
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);

CREATE TABLE plan_data_exchange_approach (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    -- page 2
    data_to_collect_from_participants DEA_DATA_TO_COLLECT_FROM_PARTICIPANTS[],
    data_to_collect_from_participants_reports_details ZERO_STRING,
    data_to_collect_from_participants_other ZERO_STRING,
    data_will_not_be_collected_from_participants BOOLEAN DEFAULT NULL,
    data_to_collect_from_participants_note ZERO_STRING,

    data_to_send_to_participants DEA_DATA_TO_SEND_TO_PARTICIPANTS[],
    data_to_send_to_participants_note ZERO_STRING,

    -- page 3
    does_need_to_make_multi_payer_data_available BOOLEAN DEFAULT NULL,
    anticipated_multi_payer_data_availability_use_case DEA_ANTICIPATED_MULTI_PAYER_DATA_AVAILABILITY_USE_CASE[],
    does_need_to_make_multi_payer_data_available_note ZERO_STRING,

    does_need_to_collect_and_aggregate_multi_source_data BOOLEAN DEFAULT NULL,
    multi_source_data_to_collect DEA_MULTI_SOURCE_DATA_TO_COLLECT[],
    multi_source_data_to_collect_other ZERO_STRING,
    does_need_to_collect_and_aggregate_multi_source_data_note ZERO_STRING,

    -- page 4
    will_implement_new_data_exchange_methods BOOLEAN DEFAULT NULL,
    new_data_exchange_methods_description ZERO_STRING,
    new_data_exchange_methods_note ZERO_STRING,

    additional_data_exchange_considerations_description ZERO_STRING,


    -- META DATA
    created_by UUID REFERENCES public.user_account (id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,
    marked_complete_by UUID REFERENCES public.user_account (id) MATCH SIMPLE,
    marked_complete_dts TIMESTAMP WITH TIME ZONE,

    status DEA_TASK_LIST_STATUS NOT NULL DEFAULT 'READY'
);

COMMENT ON TABLE plan_data_exchange_approach IS 'This table stores the data exchange approach for a model plan.';
COMMENT ON COLUMN plan_data_exchange_approach.id IS 'Unique identifier for the data exchange approach.';
COMMENT ON COLUMN plan_data_exchange_approach.model_plan_id IS 'The model plan identifier that this data exchange approach is associated with.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants IS 'The data that will be collected from participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_reports_details IS 'The details of the data that will be collected from participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_other IS 'Other data that will be collected from participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_will_not_be_collected_from_participants IS 'Indicates if data will not be collected from participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_collect_from_participants_note IS 'Additional notes about the data that will be collected from participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_send_to_participants IS 'The data that will be sent to participants.';
COMMENT ON COLUMN plan_data_exchange_approach.data_to_send_to_participants_note IS 'Additional notes about the data that will be sent to participants.';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_make_multi_payer_data_available IS 'Indicates if multi-payer data needs to be made available.';
COMMENT ON COLUMN plan_data_exchange_approach.anticipated_multi_payer_data_availability_use_case IS 'The anticipated use case for multi-payer data availability.';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_make_multi_payer_data_available_note IS 'Additional notes about the need to make multi-payer data available.';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_collect_and_aggregate_multi_source_data IS 'Indicates if multi-source data needs to be collected and aggregated.';
COMMENT ON COLUMN plan_data_exchange_approach.multi_source_data_to_collect IS 'The multi-source data that needs to be collected and aggregated.';
COMMENT ON COLUMN plan_data_exchange_approach.multi_source_data_to_collect_other IS 'Other multi-source data that needs to be collected and aggregated.';
COMMENT ON COLUMN plan_data_exchange_approach.does_need_to_collect_and_aggregate_multi_source_data_note IS 'Additional notes about the need to collect and aggregate multi-source data.';
COMMENT ON COLUMN plan_data_exchange_approach.will_implement_new_data_exchange_methods IS 'Indicates if new data exchange methods will be implemented.';
COMMENT ON COLUMN plan_data_exchange_approach.new_data_exchange_methods_description IS 'The description of the new data exchange methods that will be implemented.';
COMMENT ON COLUMN plan_data_exchange_approach.new_data_exchange_methods_note IS 'Additional notes about the new data exchange methods that will be implemented.';
COMMENT ON COLUMN plan_data_exchange_approach.additional_data_exchange_considerations_description IS 'Additional considerations for data exchange.';
COMMENT ON COLUMN plan_data_exchange_approach.created_by IS 'The user that created the data exchange approach.';
COMMENT ON COLUMN plan_data_exchange_approach.created_dts IS 'The date and time that the data exchange approach was created.';
COMMENT ON COLUMN plan_data_exchange_approach.modified_by IS 'The user that last modified the data exchange approach.';
COMMENT ON COLUMN plan_data_exchange_approach.modified_dts IS 'The date and time that the data exchange approach was last modified.';
