CREATE TYPE FUNDING_SOURCE AS ENUM (
    'PATIENT_PROTECTION_AFFORDABLE_CARE_ACT',
    'TRUST_FUND',
    'OTHER'
);

CREATE TYPE PAY_RECIPIENT AS ENUM (
    'PROVIDERS',
    'BENEFICIARIES',
    'PARTICIPANTS',
    'STATES',
    'OTHER'
);

CREATE TYPE PAY_TYPE AS ENUM (
    'CLAIMS_BASED_PAYMENTS',
    'NON_CLAIMS_BASED_PAYMENTS',
    'GRANTS'
);

CREATE TYPE CLAIMS_BASED_PAY_TYPE AS ENUM (
    'ADJUSTMENTS_TO_FFS_PAYMENTS',
    'PAYMENTS_FOR_CARE_MANAGEMENT_HOME_VISITS',
    'PAYMENTS_FOR_SNF_CLAIMS_WITHOUT_3DAY_HOSPITAL_ADMISSIONS',
    'PAYMENTS_FOR_TELEHEALTH_SERVICES_NOT_COVERED_THROUGH_TRADITIONAL_MEDICARE'
);

CREATE TYPE NON_CLAIM_BASED_PAYMENT_TYPE AS ENUM (
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

CREATE TYPE COMPLEXITY_CALCULATION_LEVEL_TYPE AS ENUM (
    'LOW',
    'MIDDLE',
    'HIGH'
);

CREATE TYPE ANTICIPATED_PAYMENT_FREQUENCY_TYPE AS ENUM (
    'ANNUALLY',
    'BIANNUALLY',
    'QUARTERLY',
    'MONTHLY',
    'SEMI-MONTHLY',
    'WEEKLY',
    'DAILY',
    'OTHER'
);

CREATE TABLE plan_payments (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL UNIQUE, --foreign key to model plan

    --page 1
    funding_source FUNDING_SOURCE[],
    funding_source_trust_fund_description TEXT,
    funding_source_other_description TEXT,
    funding_source_note TEXT,
    funding_source_r FUNDING_SOURCE[],
    funding_source_r_trust_fund_description TEXT,
    funding_source_r_other_description TEXT,
    funding_source_r_note TEXT,
    pay_recipients PAY_RECIPIENT[],
    pay_recipients_other_specification TEXT,
    pay_recipients_note TEXT,
    pay_type PAY_TYPE,
    pay_type_note TEXT,

    --page 2
    pay_claims CLAIMS_BASED_PAY_TYPE[],
    pay_claims_other_description TEXT,
    should_any_providers_excluded_ffs_systems BOOLEAN,
    should_any_providers_excluded_ffs_systems_note TEXT,
    changes_medicare_physician_fee_schedule BOOLEAN,
    changes_medicare_physician_fee_schedule_note TEXT,
    affects_medicare_secondary_payer_claims BOOLEAN,
    affects_medicare_secondary_payer_claims_explanation TEXT,
    affects_medicare_secondary_payer_claims_note TEXT,
    pay_model_differentiation TEXT,

    --page 3
    creating_dependencies_between_services BOOLEAN,
    creating_dependencies_between_services_note TEXT,
    needs_claims_data_collection BOOLEAN,
    needs_claims_data_collection_note TEXT,
    providing_third_party_file BOOLEAN,
    is_contractor_aware_test_data_requirements BOOLEAN,

    --page 4
    beneficiary_cost_sharing_level_and_handling TEXT,
    waive_beneficiary_cost_sharing_for_any_services BOOLEAN,
    waive_beneficiary_cost_sharing_service_specification TEXT,
    waiver_only_applies_part_of_payment BOOLEAN,
    waive_beneficiary_cost_sharing_note TEXT,

    --page 5
    non_claims_payments NON_CLAIM_BASED_PAYMENT_TYPE[],
    non_claims_payments_other_description TEXT,
    payment_calculation_owner TEXT,
    number_payments_per_pay_cycle TEXT,
    number_payments_per_pay_cycle_notes TEXT,
    shared_systems_involved_additional_claim_payment BOOLEAN,
    shared_systems_involved_additional_claim_payment_note TEXT,
    planning_to_use_innovation_payment_contractor BOOLEAN,
    planning_to_use_innovation_payment_contractor_note TEXT,
    funding_center_description TEXT,

    --page 6
    expected_calculation_complexity_level COMPLEXITY_CALCULATION_LEVEL_TYPE,
    expected_calculation_complexity_level_note TEXT,
    can_participants_select_between_payment_mechanisms BOOL,
    can_participants_select_between_payment_mechanisms_description TEXT,
    can_participants_select_between_payment_mechanisms_note TEXT,
    anticipated_payment_frequency ANTICIPATED_PAYMENT_FREQUENCY_TYPE,
    anticipated_payment_frequency_other_description TEXT,
    anticipated_payment_frequency_notes TEXT,

    --page 7
    will_recover_payments BOOLEAN,
    will_recover_payments_notes TEXT,
    anticipate_reconciling_payments_retrospectively BOOLEAN,
    anticipate_reconciling_payments_retrospectively_notes TEXT,
    payment_start_date TIMESTAMP WITH TIME ZONE,
    payment_start_date_notes TEXT,

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
