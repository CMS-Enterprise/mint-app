CREATE TYPE PARTICIPANTS_TYPE AS ENUM (
    'MEDICARE_PROVIDERS',
    'ENTITIES',
    'CONVENER',
    'MEDICARE_ADVANTAGE_PLANS',
    'STANDALONE_PART_D_PLANS',
    'MEDICARE_ADVANTAGE_PRESCRIPTION_DRUG_PLANS',
    'STATE_MEDICAID_AGENCIES',
    'MEDICAID_MANAGED_CARE_ORGANIZATIONS',
    'MEDICAID_PROVIDERS',
    'STATES',
    'COMMUNITY_BASED_ORGANIZATIONS',
    'NON_PROFIT_ORGANIZATIONS',
    'COMMERCIAL_PAYERS',
    'OTHER'

);

CREATE TYPE RECRUITMENT_TYPE AS ENUM (
    'LOI',
    'RFA',
    'NOFO',
    'OTHER',
    'NA'
);

CREATE TYPE PARTICIPANT_SELECTION_TYPE AS ENUM (
    'MODEL_TEAM_REVIEW_APPLICATIONS',
    'SUPPORT_FROM_CMMI',
    'CMS_COMPONENT_OR_PROCESS',
    'APPLICATION_REVIEW_AND_SCORING_TOOL',
    'APPLICATION_SUPPORT_CONTRACTOR',
    'BASIC_CRITERIA',
    'OTHER',
    'NO_SELECTING_PARTICIPANTS'
);

CREATE TYPE PARTICIPANT_COMMUNICATION_TYPE AS ENUM (
    'MASS_EMAIL',
    'IT_TOOL',
    'OTHER',
    'NO_COMMUNICATION'
);

CREATE TYPE PARTICIPANT_RISK_TYPE AS ENUM (
    'TWO_SIDED',
    'ONE_SIDED',
    'CAPITATION',
    'OTHER'
);

CREATE TYPE PARTICIPANTS_ID_TYPE AS ENUM (
    'TINS',
    'NPIS',
    'CCNS',
    'OTHER',
    'NO_IDENTIFIERS'
);

CREATE TYPE PROVIDER_ADD_TYPE AS ENUM (
    'PROSPECTIVELY',
    'RETROSPECTIVELY',
    'VOLUNTARILY',
    'MANDATORILY',
    'ONLINE_TOOLS',
    'OTHER',
    'NA'
);

CREATE TYPE PROVIDER_LEAVE_TYPE AS ENUM (
    'VOLUNTARILY_WITHOUT_IMPLICATIONS',
    'AFTER_A_CERTAIN_WITH_IMPLICATIONS',
    'VARIES_BY_TYPE_OF_PROVIDER',
    'NOT_ALLOWED_TO_LEAVE',
    'OTHER',
    'NOT_APPLICABLE'
);

CREATE TABLE plan_participants_and_providers (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    --page 1
    participants PARTICIPANTS_TYPE[],
    medicare_provider_type ZERO_STRING,
    states_engagement ZERO_STRING,
    participants_other ZERO_STRING,
    participants_note ZERO_STRING,
    participants_currently_in_models BOOL,
    participants_currently_in_models_note ZERO_STRING,
    model_application_level ZERO_STRING,

    --page 2
    expected_number_of_participants INT,
    estimate_confidence CONFIDENCE_TYPE,
    confidence_note ZERO_STRING,
    recruitment_method RECRUITMENT_TYPE,
    recruitment_other ZERO_STRING,
    recruitment_note ZERO_STRING,
    selection_method PARTICIPANT_SELECTION_TYPE[],
    selection_other ZERO_STRING,
    selection_note ZERO_STRING,

    --page 3
    communication_method PARTICIPANT_COMMUNICATION_TYPE[],
    communication_method_other ZERO_STRING,
    communication_note ZERO_STRING,
    participant_assume_risk BOOL,
    risk_type PARTICIPANT_RISK_TYPE,
    risk_other ZERO_STRING,
    risk_note ZERO_STRING,
    will_risk_change BOOL,
    will_risk_change_note ZERO_STRING,

    --page 4
    coordinate_work BOOL,
    coordinate_work_note ZERO_STRING,
    gainshare_payments BOOL,
    gainshare_payments_track BOOL,
    gainshare_payments_note ZERO_STRING,
    participants_ids PARTICIPANTS_ID_TYPE[],
    participants_ids_other ZERO_STRING,
    participants_ids_note ZERO_STRING,

    --page 5
    provider_addition_frequency FREQUENCY_TYPE,
    provider_addition_frequency_other ZERO_STRING,
    provider_addition_frequency_note ZERO_STRING,
    provider_add_method PROVIDER_ADD_TYPE[],
    provider_add_method_other ZERO_STRING,
    provider_add_method_note ZERO_STRING,
    provider_leave_method PROVIDER_LEAVE_TYPE[],
    provider_leave_method_other ZERO_STRING,
    provider_leave_method_note ZERO_STRING,
    provider_overlap OVERLAP_TYPE,
    provider_overlap_hierarchy ZERO_STRING,
    provider_overlap_note ZERO_STRING,


    --META
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    ready_for_review_by EUA_ID,
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    ready_for_clearance_by EUA_ID,
    ready_for_clearance_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);

ALTER TABLE plan_participants_and_providers
ADD CONSTRAINT fk_participants_and_providers_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
