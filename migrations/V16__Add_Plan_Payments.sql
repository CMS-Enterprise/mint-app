CREATE TYPE PP_FUNDING_SOURCE AS ENUM (
    'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT',
    'TRUST_FUND',
    'OTHER'
);

CREATE TYPE PP_PAY_RECIPIENT AS ENUM (
    'PROVIDERS',
    'BENEFICIARIES',
    'PARTICIPANTS',
    'STATES',
    'OTHER'
);

CREATE TYPE PP_PAY_TYPE AS ENUM (
    'CLAIMS_BASED_PAYMENTS',
    'NON_CLAIMS_BASED_PAYMENTS',
    'GRANTS'
);

CREATE TYPE PP_CLAIMS_BASED_PAY_TYPE AS ENUM (
    'ADJUSTMENTS_TO_FFS_PAYMENTS',
    'CARE_MANAGEMENT_HOME_VISITS',
    'SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS',
    'TELEHEALTH_SERVICES_NOT_TRADITIONAL_MEDICARE',
    'OTHER'
);

CREATE TYPE PP_NON_CLAIM_BASED_PAYMENT_TYPE AS ENUM (
    'ADVANCED_PAYMENT',
    'BUNDLED_EPISODE_OF_CARE',
    'CAPITATION_POPULATION_BASED_FULL',
    'CAPITATION_POPULATION_BASED_PARTIAL',
    'CARE_COORDINATION_MANAGEMENT_FEE',
    'GLOBAL_BUDGET',
    'GRANTS',
    'INCENTIVE_PAYMENT',
    'MAPD_SHARED_SAVINGS',
    'SHARED_SAVINGS',
    'OTHER'
);

CREATE TYPE PP_COMPLEXITY_CALCULATION_LEVEL_TYPE AS ENUM (
    'LOW',
    'MIDDLE',
    'HIGH'
);

CREATE TYPE PP_ANTICIPATED_PAYMENT_FREQUENCY_TYPE AS ENUM (
    'ANNUALLY',
    'BIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'SEMIMONTHLY',
    'WEEKLY',
    'DAILY',
    'OTHER'
);

CREATE TABLE plan_payments (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    --page 1
    funding_source PP_FUNDING_SOURCE[],
    funding_source_trust_fund ZERO_STRING,
    funding_source_other ZERO_STRING,
    funding_source_note ZERO_STRING,
    funding_source_r PP_FUNDING_SOURCE[],
    funding_source_r_trust_fund ZERO_STRING,
    funding_source_r_other ZERO_STRING,
    funding_source_r_note ZERO_STRING,
    pay_recipients PP_PAY_RECIPIENT[],
    pay_recipients_other_specification ZERO_STRING,
    pay_recipients_note ZERO_STRING,
    pay_type PP_PAY_TYPE[],
    pay_type_note ZERO_STRING,

    --page 2
    pay_claims PP_CLAIMS_BASED_PAY_TYPE[],
    pay_claims_other ZERO_STRING,
    pay_claims_note ZERO_STRING,
    should_any_providers_excluded_ffs_systems BOOLEAN,
    should_any_providers_excluded_ffs_systems_note ZERO_STRING,
    changes_medicare_physician_fee_schedule BOOLEAN,
    changes_medicare_physician_fee_schedule_note ZERO_STRING,
    affects_medicare_secondary_payer_claims BOOLEAN,
    affects_medicare_secondary_payer_claims_how ZERO_STRING,
    affects_medicare_secondary_payer_claims_note ZERO_STRING,
    pay_model_differentiation ZERO_STRING,

    --page 3
    creating_dependencies_between_services BOOLEAN,
    creating_dependencies_between_services_note ZERO_STRING,
    needs_claims_data_collection BOOLEAN,
    needs_claims_data_collection_note ZERO_STRING,
    providing_third_party_file BOOLEAN,
    is_contractor_aware_test_data_requirements BOOLEAN,

    --page 4
    beneficiary_cost_sharing_level_and_handling ZERO_STRING,
    waive_beneficiary_cost_sharing_for_any_services BOOLEAN,
    waive_beneficiary_cost_sharing_service_specification ZERO_STRING,
    waiver_only_applies_part_of_payment BOOLEAN,
    waive_beneficiary_cost_sharing_note ZERO_STRING,

    --page 5
    non_claims_payments PP_NON_CLAIM_BASED_PAYMENT_TYPE[],
    non_claims_payments_other ZERO_STRING,
    payment_calculation_owner ZERO_STRING,
    number_payments_per_pay_cycle ZERO_STRING,
    number_payments_per_pay_cycle_note ZERO_STRING,
    shared_systems_involved_additional_claim_payment BOOLEAN,
    shared_systems_involved_additional_claim_payment_note ZERO_STRING,
    planning_to_use_innovation_payment_contractor BOOLEAN,
    planning_to_use_innovation_payment_contractor_note ZERO_STRING,
    funding_structure ZERO_STRING,

    --page 6
    expected_calculation_complexity_level PP_COMPLEXITY_CALCULATION_LEVEL_TYPE,
    expected_calculation_complexity_level_note ZERO_STRING,
    can_participants_select_between_payment_mechanisms BOOL,
    can_participants_select_between_payment_mechanisms_how ZERO_STRING,
    can_participants_select_between_payment_mechanisms_note ZERO_STRING,
    anticipated_payment_frequency PP_ANTICIPATED_PAYMENT_FREQUENCY_TYPE[],
    anticipated_payment_frequency_other ZERO_STRING,
    anticipated_payment_frequency_note ZERO_STRING,

    --page 7
    will_recover_payments BOOLEAN,
    will_recover_payments_note ZERO_STRING,
    anticipate_reconciling_payments_retrospectively BOOLEAN,
    anticipate_reconciling_payments_retrospectively_note ZERO_STRING,
    payment_start_date TIMESTAMP WITH TIME ZONE,
    payment_start_date_note ZERO_STRING,

    --META
    created_by EUA_ID NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by EUA_ID,
    modified_dts TIMESTAMP WITH TIME ZONE,
    status TASK_STATUS NOT NULL DEFAULT 'READY'
);

ALTER TABLE plan_payments
ADD CONSTRAINT fk_plan_payments FOREIGN KEY (model_plan_id)
REFERENCES public.model_plan (id) MATCH SIMPLE
ON UPDATE NO ACTION
ON DELETE NO ACTION
