CREATE TYPE ALTERNATIVE_PAYMENT_MODEL_TYPE AS ENUM (
    'REGULAR',
    'MIPS',
    'ADVANCED'
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
    existing_model TEXT, -- TODO: select from list of models??
    resembles_existing_model BOOLEAN,
    resembles_existing_model_which TEXT[], -- TODO: list of models??
    resembles_existing_model_how TEXT,
    resembles_existing_model_note TEXT,
    has_components_or_tracks BOOLEAN,
    has_components_or_tracks_differ TEXT,
    has_components_or_tracks_note TEXT,

    -- Page 2
    alternative_payment_model BOOLEAN,
    alternative_payment_model_types ALTERNATIVE_PAYMENT_MODEL_TYPE[],
    alternative_payment_model_note TEXT,
    key_characteristics KEY_CHARACTERISTIC[],
    key_characteristics_other TEXT,
    key_characteristics_note TEXT,
    collect_plan_bids BOOLEAN,
    collect_plan_bids_note TEXT,
    manage_part_c_d_enrollment BOOLEAN,
    manage_part_c_d_enrollment_note TEXT,
    plan_contact_updated BOOLEAN,
    plan_contact_updated_note TEXT,

    -- Page 3
    care_coordination_involved BOOLEAN,
    care_coordination_involved_description TEXT,
    care_coordination_involved_note TEXT,
    additional_services_involved BOOLEAN,
    additional_services_involved_description TEXT,
    additional_services_involved_note TEXT,
    community_partners_involved BOOLEAN,
    community_partners_involved_description TEXT,
    community_partners_involved_note TEXT,

    -- Page 4
    geographies_targeted BOOLEAN,
    geographies_targeted_types GEOGRAPHY_TYPE[],
    geographies_targeted_types_other TEXT,
    geographies_targeted_applied_to GEOGRAPHY_APPLICATION[],
    geographies_targeted_applied_to_other TEXT,
    geographies_targeted_note TEXT,
    participation_options BOOLEAN,
    participation_options_note TEXT,
    agreement_types AGREEMENT_TYPE[],
    agreement_types_other TEXT,
    multiple_patricipation_agreements_needed BOOLEAN,
    multiple_patricipation_agreements_needed_note TEXT,

    -- Page 5
    rulemaking_required BOOLEAN,
    rulemaking_required_description TEXT,
    rulemaking_required_note TEXT,
    authority_allowances AUTHORITY_ALLOWANCE[],
    authority_allowances_other TEXT,
    authority_allowances_note TEXT,
    waivers_required BOOLEAN,
    waivers_required_types WAIVER_TYPE[],
    waivers_required_note TEXT,


    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY' -- can become and ENUM/TYPE
);

ALTER TABLE plan_general_characteristics
ADD CONSTRAINT fk_characteristics_plan FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
