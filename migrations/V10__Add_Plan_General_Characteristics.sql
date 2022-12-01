CREATE TYPE ALTERNATIVE_PAYMENT_MODEL_TYPE AS ENUM (
    'REGULAR',
    'MIPS',
    'ADVANCED',
    'NOT_APM'
);

CREATE TYPE KEY_CHARACTERISTIC AS ENUM (
    'EPISODE_BASED',
    'PART_C', -- Part C == Medicare Advantage
    'PART_D',
    'PAYMENT',
    'POPULATION_BASED',
    'PREVENTATIVE',
    'SERVICE_DELIVERY',
    'SHARED_SAVINGS',
    'OTHER'
);

CREATE TYPE GEOGRAPHY_TYPE AS ENUM (
    'STATE',
    'REGION',
    'OTHER'
);

CREATE TYPE GEOGRAPHY_APPLICATION AS ENUM (
    'PARTICIPANTS',
    'PROVIDERS',
    'BENEFICIARIES',
    'OTHER'
);

CREATE TYPE AGREEMENT_TYPE AS ENUM (
    'PARTICIPATION',
    'COOPERATIVE',
    'OTHER'
);

CREATE TYPE AUTHORITY_ALLOWANCE AS ENUM (
    'ACA',
    'CONGRESSIONALLY_MANDATED',
    'SSA_PART_B',
    'OTHER'
);

CREATE TYPE WAIVER_TYPE AS ENUM (
    'FRAUD_ABUSE',
    'PROGRAM_PAYMENT',
    'MEDICAID'
);

CREATE TABLE plan_general_characteristics (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    -- Page 1
    is_new_model BOOLEAN,
    existing_model ZERO_STRING, -- TODO: select from list of models??
    resembles_existing_model BOOLEAN,
    resembles_existing_model_which ZERO_STRING[], -- TODO: list of models??
    resembles_existing_model_how ZERO_STRING,
    resembles_existing_model_note ZERO_STRING,
    has_components_or_tracks BOOLEAN,
    has_components_or_tracks_differ ZERO_STRING,
    has_components_or_tracks_note ZERO_STRING,

    -- Page 2
    alternative_payment_model_types ALTERNATIVE_PAYMENT_MODEL_TYPE[],
    alternative_payment_model_note ZERO_STRING,
    key_characteristics KEY_CHARACTERISTIC[],
    key_characteristics_other ZERO_STRING,
    key_characteristics_note ZERO_STRING,
    collect_plan_bids BOOLEAN,
    collect_plan_bids_note ZERO_STRING,
    manage_part_c_d_enrollment BOOLEAN,
    manage_part_c_d_enrollment_note ZERO_STRING,
    plan_contact_updated BOOLEAN,
    plan_contact_updated_note ZERO_STRING,

    -- Page 3
    care_coordination_involved BOOLEAN,
    care_coordination_involved_description ZERO_STRING,
    care_coordination_involved_note ZERO_STRING,
    additional_services_involved BOOLEAN,
    additional_services_involved_description ZERO_STRING,
    additional_services_involved_note ZERO_STRING,
    community_partners_involved BOOLEAN,
    community_partners_involved_description ZERO_STRING,
    community_partners_involved_note ZERO_STRING,

    -- Page 4
    geographies_targeted BOOLEAN,
    geographies_targeted_types GEOGRAPHY_TYPE[],
    geographies_targeted_types_other ZERO_STRING,
    geographies_targeted_applied_to GEOGRAPHY_APPLICATION[],
    geographies_targeted_applied_to_other ZERO_STRING,
    geographies_targeted_note ZERO_STRING,
    participation_options BOOLEAN,
    participation_options_note ZERO_STRING,
    agreement_types AGREEMENT_TYPE[],
    agreement_types_other ZERO_STRING,
    multiple_patricipation_agreements_needed BOOLEAN,
    multiple_patricipation_agreements_needed_note ZERO_STRING,

    -- Page 5
    rulemaking_required BOOLEAN,
    rulemaking_required_description ZERO_STRING,
    rulemaking_required_note ZERO_STRING,
    authority_allowances AUTHORITY_ALLOWANCE[],
    authority_allowances_other ZERO_STRING,
    authority_allowances_note ZERO_STRING,
    waivers_required BOOLEAN,
    waivers_required_types WAIVER_TYPE[],
    waivers_required_note ZERO_STRING,


    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    ready_for_review_by EUA_ID,
    ready_for_review_dts TIMESTAMP WITH TIME ZONE,
    ready_for_clearance_by EUA_ID,
    ready_for_clearance_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY' -- can become and ENUM/TYPE
);

ALTER TABLE plan_general_characteristics
ADD CONSTRAINT fk_characteristics_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
