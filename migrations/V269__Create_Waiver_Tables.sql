-- Add the waiver tables to the TABLE_NAME enum used by auditing
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'waiver_assessment_survey';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'waiver';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'common_waiver';
ALTER TYPE TABLE_NAME ADD VALUE IF NOT EXISTS 'suggested_waiver';

-- Create enum for waiver assessment survey work status
CREATE TYPE WAIVER_ASSESSMENT_SURVEY_STATUS AS ENUM (
    'READY',
    'IN_PROGRESS',
    'COMPLETE'
);

COMMENT ON TYPE WAIVER_ASSESSMENT_SURVEY_STATUS IS 'Work completion status for waiver assessment survey: READY (not started), IN_PROGRESS (started), COMPLETE (finished).';

-- Create enum for not selected reason on waiver questions
CREATE TYPE NOT_SELECTED_REASON AS ENUM (
    'OUT_OF_SCOPE',
    'OVERLAPS',
    'NOT_TESTING',
    'NOT_ENGAGED',
    'FEEDBACK_AGAINST_USE',
    'OTHER'
);

COMMENT ON TYPE NOT_SELECTED_REASON IS 'Reason for selecting no on a waiver question.';

-- Create the waiver_assessment_survey table
CREATE TABLE waiver_assessment_survey (
    id UUID PRIMARY KEY NOT NULL,
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),

    -- Page 3 - Medicare payment waivers
    modifies_medicare_savings_programs BOOLEAN,
    modifies_medicare_savings_programs_example TEXT,
    modifies_medicare_savings_programs_why_not NOT_SELECTED_REASON,
    bundles_payments BOOLEAN,
    bundles_payments_example TEXT,
    bundles_payments_why_not NOT_SELECTED_REASON,
    offers_risk_sharing_arrangements BOOLEAN,
    offers_risk_sharing_arrangements_example TEXT,
    offers_risk_sharing_arrangements_why_not NOT_SELECTED_REASON,

    -- Page 4 - Program waivers (Medicare Benefit Enhancements)
    impacts_site_of_care_payments BOOLEAN,
    impacts_site_of_care_payments_example TEXT,
    impacts_site_of_care_payments_why_not NOT_SELECTED_REASON,
    modifies_care_team_scope_of_practice BOOLEAN,
    modifies_care_team_scope_of_practice_example TEXT,
    modifies_care_team_scope_of_practice_why_not NOT_SELECTED_REASON,
    modifies_care_delivery_with_claims_based_payments BOOLEAN,
    modifies_care_delivery_with_claims_based_payments_example TEXT,
    modifies_care_delivery_with_claims_based_payments_why_not NOT_SELECTED_REASON,
    modifies_quality_measurements_or_payments_via_waivers BOOLEAN,
    modifies_quality_measurements_or_payments_via_waivers_example TEXT,
    modifies_quality_measurements_or_payments_via_waivers_why_not NOT_SELECTED_REASON,

    -- Page 5 - Medicaid payment waivers
    impacts_medicaid_only_beneficiaries BOOLEAN,
    impacts_medicaid_only_beneficiaries_example TEXT,
    impacts_medicaid_only_beneficiaries_why_not NOT_SELECTED_REASON,
    impacts_home_community_based_service_payments BOOLEAN,
    impacts_home_community_based_service_payments_example TEXT,
    impacts_home_community_based_service_payments_why_not NOT_SELECTED_REASON,
    impacts_managed_care_waivers BOOLEAN,
    impacts_managed_care_waivers_example TEXT,
    impacts_managed_care_waivers_why_not NOT_SELECTED_REASON,
    additional_medicaid_specific_waivers TEXT,

    status WAIVER_ASSESSMENT_SURVEY_STATUS NOT NULL DEFAULT 'READY',

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- Only one waiver assessment survey per model plan
    UNIQUE(model_plan_id)
);

COMMENT ON TABLE waiver_assessment_survey IS 'Waiver assessment survey for a model plan. Tracks whether and how the model affects various Medicare and Medicaid waivers.';

-- Create the common_waiver table
CREATE TABLE common_waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    name TEXT NOT NULL,
    description TEXT,
    participation_agreement_language_link TEXT,
    cmmi_waiver_point_of_contact TEXT,
    waiver_type TEXT,
    waiver_focus TEXT,
    what_is_waived TEXT,
    has_standardization_effort BOOLEAN,
    has_claims_data_or_rreg_analysis TEXT,
    is_used_in_active_models BOOLEAN,
    survey_question_field TEXT,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE
);

COMMENT ON TABLE common_waiver IS 'Library of CMMI waivers that can be associated with model plans.';

-- Create the waiver table
CREATE TABLE waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    common_waiver_id UUID NOT NULL REFERENCES common_waiver(id),
    will_use_waiver BOOLEAN,
    not_using_reason TEXT,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- A model plan can only have one row per common waiver
    UNIQUE(model_plan_id, common_waiver_id)
);

COMMENT ON TABLE waiver IS 'A model plan''s decision on whether to use a specific common waiver.';

-- Create the suggested_waiver table
CREATE TABLE suggested_waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    model_plan_id UUID NOT NULL REFERENCES model_plan(id),
    common_waiver_id UUID NOT NULL REFERENCES common_waiver(id),

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- A model plan can only have one suggested row per common waiver
    UNIQUE(model_plan_id, common_waiver_id)
);

COMMENT ON TABLE suggested_waiver IS 'Waivers MINT has determined are likely needed for a model plan based on waiver assessment survey answers.';

-- Seed fake common_waiver data (5 per waiver type, 15 total)
INSERT INTO common_waiver (
    id,
    name,
    description,
    participation_agreement_language_link,
    cmmi_waiver_point_of_contact,
    waiver_type,
    waiver_focus,
    what_is_waived,
    has_standardization_effort,
    has_claims_data_or_rreg_analysis,
    is_used_in_active_models,
    created_by
)
VALUES
(
    '9f955945-7afd-481f-8558-e7e0fd465463'::UUID,
    'Medicare Payment Waiver 1',
    'Allows for model participants to enter into agreements with Medicare-enrolled providers and suppliers to participate as Preferred Providers under MSSP.',
    'https://cms.gov/',
    '',
    'Lorem Ipsum',
    'Administrative and operational',
    '42 CFR § 425.114(a) and (b)',
    FALSE,
    'Lorem ipsum',
    TRUE,
    '00000001-0001-0001-0001-000000000001'::UUID
),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 2', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 3', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 4', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicare Payment Waiver 5', NULL, NULL, NULL, 'MEDICARE_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 1', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BES', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 2', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BES', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 3', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BES', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 4', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BES', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Program Waiver - Medicare BEs 5', NULL, NULL, NULL, 'PROGRAM_MEDICARE_BES', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 1', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 2', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 3', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 4', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID),
(GEN_RANDOM_UUID(), 'Medicaid Payment Waiver 5', NULL, NULL, NULL, 'MEDICAID_PAYMENT', NULL, NULL, NULL, NULL, NULL, '00000001-0001-0001-0001-000000000001'::UUID);
