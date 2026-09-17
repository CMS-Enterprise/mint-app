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

-- Create enum for common waiver categories
CREATE TYPE COMMON_WAIVER_TYPE AS ENUM (
    'FRAUD_ABUSE',
    'MEDICAID_PAYMENT',
    'MEDICARE_PAYMENT',
    'PROGRAM_MEDICARE_BE',
    'UNKNOWN'
);

CREATE TYPE COMMON_WAIVER_FOCUS AS ENUM (
    'ADMINISTRATIVE_OPERATIONAL',
    'ANTI_KICKBACK',
    'BENEFICIARY_ENGAGEMENT_COST_SHARING',
    'BENEFICIARY_ENGAGEMENT_INCENTIVES',
    'HOSPITAL_FACILITY_RELATED',
    'PATIENT_ENGAGEMENT_INCENTIVES',
    'PAYMENT_FINANCIAL_ARRANGEMENT',
    'PAYMENT_SYSTEMS_RATE_ADJUSTMENTS',
    'SAFE_HARBORS',
    'SCOPE_OF_PRACTICE',
    'SHARED_DECISION_MAKING_PATIENT_SERVICES',
    'SITE_OF_CARE'
);

COMMENT ON TYPE COMMON_WAIVER_TYPE IS 'Category of a waiver in the CMMI waiver library.';
COMMENT ON TYPE COMMON_WAIVER_FOCUS IS 'Focus areas addressed by waivers in the CMMI waiver library.';

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
    offers_patient_incentives_safe_harbor_protection BOOLEAN,
    offers_patient_incentives_safe_harbor_protection_example TEXT,
    offers_patient_incentives_safe_harbor_protection_why_not NOT_SELECTED_REASON,
    offers_expenses_remuneration_safe_harbor_protection BOOLEAN,
    offers_expenses_remuneration_safe_harbor_protection_example TEXT,
    offers_expenses_remuneration_safe_harbor_protection_why_not NOT_SELECTED_REASON,
    additional_medicaid_specific_waivers TEXT,

    status WAIVER_ASSESSMENT_SURVEY_STATUS NOT NULL DEFAULT 'READY',
    completed_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    completed_dts TIMESTAMP WITH TIME ZONE,

    -- Standard audit fields
    created_by UUID REFERENCES public.user_account(id) MATCH SIMPLE NOT NULL,
    created_dts TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    modified_by UUID REFERENCES public.user_account(id) MATCH SIMPLE,
    modified_dts TIMESTAMP WITH TIME ZONE,

    -- Only one waiver assessment survey per model plan
    UNIQUE(model_plan_id)
);

COMMENT ON TABLE waiver_assessment_survey IS 'Waiver assessment survey for a model plan. Tracks whether and how the model affects various Medicare and Medicaid waivers.';
COMMENT ON COLUMN waiver_assessment_survey.completed_by IS 'The user who marked the waiver assessment survey complete.';
COMMENT ON COLUMN waiver_assessment_survey.completed_dts IS 'The timestamp when the waiver assessment survey was marked complete.';

-- Create the common_waiver table
CREATE TABLE common_waiver (
    id UUID PRIMARY KEY DEFAULT GEN_RANDOM_UUID(),
    name ZERO_STRING NOT NULL,
    description ZERO_STRING NOT NULL,
    participation_agreement_language_link ZERO_STRING,
    cmmi_waiver_point_of_contact ZERO_STRING,
    waiver_type COMMON_WAIVER_TYPE,
    waiver_focus COMMON_WAIVER_FOCUS[] NOT NULL
        CHECK (CARDINALITY(waiver_focus) > 0), -- ensure array is not empty
    what_is_waived ZERO_STRING NOT NULL,
    has_standardization_effort BOOLEAN,
    has_claims_data_or_rreg_analysis ZERO_STRING NOT NULL,
    is_used_in_active_models BOOLEAN,
    survey_question_field ZERO_STRING NOT NULL,

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
    using_reason TEXT,
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
    survey_question_field,
    created_by
)
VALUES
('00000002-0000-0000-0000-000000000001', '3-Day Skilled Nursing Facility (SNF)', 'CMS waives the requirement in section 1861(i) of the Act for a three-day inpatient hospital stay prior to the provision of otherwise covered Medicare post-hospital extended care services (“SNF Services”) furnished under the terms and conditions set forth in the waiver.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=199&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SITE_OF_CARE}', '§1861(i) of the SSA; 42 CFR §409.30', TRUE, 'Yes', TRUE, 'modifies_care_delivery_with_claims_based_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000002', 'All-Inclusive Population-Based Payments (AIPBP) Payment Arrangement Waiver', 'Allows model-specific payment arrangement that would otherwise violate the Anti-Kickback Statute and Stark law.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=126&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{ANTI_KICKBACK}', '§1877(a) of the SSA; §1128B(b)(l) and (2) of the SSA', FALSE, 'No', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000003', 'Beneficiary Cost Sharing/Cost Sharing Support/Part B Cost Sharing Support', 'Allows the model to waive cost-sharing requirements for certain model-specific payments.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=187&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{BENEFICIARY_ENGAGEMENT_COST_SHARING}', '§1833(a)(1)(N) of the SSA; §1833(b) of the SSA', TRUE, 'Learning data only', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000004', 'Care Management Visits', 'Preventative home or domicile-based visits (e.g. homeless shelter) for care team to deliver preventative care to beneficiary. May or may not have a limit on number of visits allowable.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=177&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SITE_OF_CARE}', '42 CFR §410.26(b)(5)', TRUE, 'Yes', TRUE, 'modifies_care_delivery_with_claims_based_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000005', 'Care Partner Arrangement/Waiver', 'This safe harbor protection enables Care Partners to enter into financial arrangements for providing Patient-Related Activities (PRAs) without violating anti-kickback laws, thereby facilitating enhanced care coordination, patient engagement services, and collaborative care delivery models that might otherwise be legally restricted due to the exchange of remuneration between healthcare entities.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=179&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{ANTI_KICKBACK}', '42 CFR §1001.952(ii)(1)', FALSE, 'No', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000006', 'Certification for Diabetic Shoes by a Nurse Practitioner', 'Allows Nurse Practitioners (NPs) and Physician Assistants (PAs) to certify and order select high-quality services without physician supervision.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/Lists/Existing%20Models/DispForm.aspx?ID=132&Source=https%3A%2F%2Fshare%2Ecms%2Egov%2Fcenter%2Fcmmi%2FPP%2FDAPMI%2FLists%2FExisting%2520Models%2FAllItems%2Easpx%23InplviewHashc04a3098%2D30ef%2D4a35%2Da81e%2D7d4d7af8f546%3D&ContentTypeId=0x010033305A5CBA48224EB8E39D474F22C161', NULL, 'PROGRAM_MEDICARE_BE', '{SCOPE_OF_PRACTICE}', '§1861(s)(12)(A) of the SSA; 42 CFR §410.12 ', TRUE, 'Learning data only', TRUE, 'modifies_care_team_scope_of_practice', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000007', 'Chronic Disease Management', 'The Chronic Disease Management Reward Beneficiary Engagement Incentive allows Accountable Care Organizations (ACOs) to provide gift card rewards (e.g. up to $75 annually per beneficiary in REACH, $150 for LEAD) to eligible beneficiaries with chronic diseases for participating in qualifying chronic disease management programs.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=188&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,SAFE_HARBORS}', '§1128B of the SSA; 42 CFR §1001.952(ii)(2)', TRUE, 'Learning data only', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000008', 'Concurrent Care for Beneficiaries that Elect the Medicare Hospice Benefit', 'Concurrent use of palliative and hospice services along with curative services.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=186&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SHARED_DECISION_MAKING_PATIENT_SERVICES}', '42 CFR §418.24(e)(2)', FALSE, 'Learning data only', TRUE, 'modifies_care_delivery_with_claims_based_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000009', 'Distribution Payment Waiver', 'Distribution of gainsharing payments to collaborative agreement partners.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=42&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '42 CFR §1001.952(ii)(1)', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000010', 'Downstream Distribution Payment Waiver', 'Downstream distributions of distribution payments to collaborative agent partners.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=40&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '42 CFR §1001.952(ii)(1)', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000011', 'Environmental Modification', 'Participant may provide in-kind environmental modifications to beneficiaries if specific conditions are met.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=194&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,SAFE_HARBORS}', '§1128B of the SSA; 42 CFR §1001.952(ii)(2)', TRUE, 'No', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000012', 'Home Health Homebound', 'CMS waives the requirements of 42 CFR §409.42(a) that a beneficiary must be confined to the home or in an institution that is not a hospital, Skilled Nursing Facility (SNF), or nursing facility to qualify for Medicare coverage of home health services.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=146&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SITE_OF_CARE}', '42 CFR §409.42(a); §1814(a)(2)(C) of the SSA; §1835(a)(2)(a) of the SSA', TRUE, 'Learning data only', TRUE, 'impacts_home_community_based_service_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000013', 'Implementation period', 'Federal physician self-referral law and anti-kickback statute are waived with respect to any start-up arrangement between the Participants or Preferred Providers.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=57&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{ADMINISTRATIVE_OPERATIONAL}', '§1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000014', 'In Kind Services and Supports', 'Allows the participants to utilize the CMS-Sponsored Model Patient Incentive Safe Harbor (at 42 CFR §1001.952(ii)(2)) and distribute Benefit Enhancement Incentives (BEIs) to model-specific beneficiaries.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=77&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,SAFE_HARBORS}', '§1877(g) of the SSA', TRUE, 'Learning data only', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000015', 'Internal Cost Savings Contribution Waiver', 'Internal Cost Savings contributions by Net Payment Reconciliation Amount (NPRA) Sharing Partners and, if applicable, Non-Convener Participants to the Bundled Payments for Care Improvement (BPCI) Advanced Savings Pool, provided specific conditions are met.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=6&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '§1877(a) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000016', 'Kidney Disease Education (KDE)', 'Allows for kidney disease education to KDE participants under the direction of a nephrologist in the aim to reduce exacerbation of chronic disease.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=148&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,SAFE_HARBORS}', '42 CFR §410.48(a)', FALSE, 'No', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000017', 'Net Payment Reconciliation Amount (NPRA) Shared Payment and Shared Repayment Amount Waiver', 'NPRA Shared Payments made from the Bundled Payments for Care Improvement (BPCI) Advanced Savings Pool to an NPRA Sharing Partner and Shared Repayment Amounts paid by an NPRA Sharing Partner into the BPCI Advanced Savings Pool, provided specific conditions are met.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=5&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'UNKNOWN', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '§1115A(d)(1) of the SSA; §1877(a) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'bundles_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000018', 'Non-duplication', 'Allows for model participants to enter into agreements with Medicare-enrolled providers and suppliers to participate as Preferred Providers under Medicare Shared Savings Plan (MSSP).', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=144&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{ADMINISTRATIVE_OPERATIONAL}', '42 CFR §425.114(a) and (b)', FALSE, 'Unknown', TRUE, 'modifies_medicare_savings_programs', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000019', 'Nurse Practitioner Services Benefit Enhancement', 'Ability for nurse practitioners and Physician Assistants to be able to certify, refer, or establish plans of care that are not traditionally available under Fee-for-Service (FFS) rule. These services may include, but are not limited to, certification of hospice care, certification for diabetic shoes, establish a cardiac rehab care plan, plan of care for home infusion therapy, referral for medical nutrition therapy.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=190&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SCOPE_OF_PRACTICE}', '§1814(a)(7)(A)(i)(I) of the SSA; §1861(s)(12)(A) of the SSA and the implementing regulations at 42 CFR §410.12; §1861(eee)(2)(C) of the SSA; §1861(iii)(1)(B) of the SSA and the implementing regulations at 42 CFR §414.1515(c)', TRUE, 'Learning data only', TRUE, 'modifies_care_team_scope_of_practice', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000020', 'Participation', 'Allows for model participants to enter into agreements with Medicare-enrolled providers and suppliers to participate as Preferred Providers under Medicare Shared Savings Plan (MSSP).', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/Lists/Existing%20Models/DispForm.aspx?ID=109&Source=https%3A%2F%2Fshare%2Ecms%2Egov%2Fcenter%2Fcmmi%2FPP%2FDAPMI%2FLists%2FExisting%2520Models%2FWaiver%2520and%2520Background%2520Language%2Easpx%23InplviewHash85e7c6e2%2D49a3%2D491d%2D9c8b%2D80138fed0020%3DWebPartID%253D%257B85E7C6E2%2D%2D49A3%2D%2D491D%2D%2D9C8B%2D%2D80138FED0020%257D&ContentTypeId=0x010033305A5CBA48224EB8E39D474F22C161', NULL, 'UNKNOWN', '{ADMINISTRATIVE_OPERATIONAL}', '§1115A(d)(1) of the SSA; §1877(a) of the SSA; §1128A(b)(1) and (2) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'modifies_medicare_savings_programs', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000021', 'Patient Engagement Incentive Waiver', 'Permits provision of in-kind items and services to Medicare beneficiaries during clinical episodes without violating federal anti-kickback and beneficiary inducement laws, provided the items have a reasonable connection to medical care, advance specific clinical goals.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=77&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,SAFE_HARBORS}', '§1128A(a)(5) of the SSA; §1128B(b)(l) and (2) of the SSA', FALSE, 'No', TRUE, 'offers_patient_incentives_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000022', 'Payment', 'Waives for permit to offer payments for model needs (ex: Part D = payment for drugs, Comprehensive Care for Joint Replacement (CJR) = gainsharing and aligned payments).', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=70&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '§1860D-13 of the SSA, §1860D-15 of the SSA which is codified in 42 USC §1395w-115; §1877(a) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000023', 'Performance-Based Payments to Physicians who are Participants', 'Performance-based payments made to certain physicians who are Participants, provided specific conditions are met.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=26&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '§1877(a) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000024', 'Physician Fee Schedule (PFS)', 'Waives the requirements for payment amounts for physician services determined under the PFS to allow certain model-specific payments to be paid as set forth in the model''s governing document. Examples of model-specific payments subject to this waiver include: the Care Management Fees (CMF), Comprehensive Primary Care Payments (CPCP), Performance‑Based Incentive Payments (PBIP), reduced FFS payments, Total Primary Care Payments (TPCPs), Physician Bonus Amounts (PBAs), and the Flat Visit Fee.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=161&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{PAYMENT_SYSTEMS_RATE_ADJUSTMENTS}', '§1848(a)(1) of the SSA; §1833(a)(1)(O)(i) through (ii) of the SSA; §1861(s)(2)(K) of the SSA', FALSE, 'Unknown', TRUE, 'modifies_care_delivery_with_claims_based_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000025', 'Physician Self-Referral', 'The Federal anti-kickback statutes are waived with respect to any financial relationship between or among the Accountable Care Organization (ACO) and its Initiative Participants or Preferred Providers that implicates the physician self-referral law, provided specific conditions are met.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=125&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{ANTI_KICKBACK}', '§1128B(b)(1) and (2) of the SSA', FALSE, 'No', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000026', 'Post-Discharge Home Visits', 'This Post-Discharge Home Visits Benefit Enhancement increases the availability to Beneficiaries of in-home care following discharge from an acute inpatient hospital, inpatient psychiatric facility, inpatient rehabilitation facility, long-term care hospital, or Skilled Nursing Facility (SNF) by altering the supervision level for “incident to” services to allow personnel under a physician’s general supervision (instead of direct supervision) to make home visits under certain conditions.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=183&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SITE_OF_CARE}', '42 CFR §410.26(b)(5)', TRUE, 'Yes', TRUE, 'impacts_site_of_care_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000027', 'Safe Harbor', 'CMS determines, on a model by model basis, whether and how the Safe Harbor provisions apply. These provisions include the Federal Anti-Kickback Statute Safe Harbor for CMS-sponsored model arrangements with regard to certain remunerations.', 'https://www.ecfr.gov/current/title-42/chapter-IV/subchapter-H/part-512/subpart-E/subject-group-ECFRb54a35f020c0766/section-512.576', NULL, 'FRAUD_ABUSE', '{PATIENT_ENGAGEMENT_INCENTIVES,BENEFICIARY_ENGAGEMENT_INCENTIVES,ANTI_KICKBACK,PAYMENT_FINANCIAL_ARRANGEMENT,SAFE_HARBORS}', '§1861(s)(12)(A) of the SSA; 42 CFR §410.12 ', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000028', 'Shared Savings Distribution Waiver', 'Distribution of shared savings payments to or among the Accountable Care Organization (ACO), its Initiative Participants, or individuals and entities that were its Initiative Participants.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=122&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'FRAUD_ABUSE', '{PAYMENT_FINANCIAL_ARRANGEMENT}', '§1877(a) of the SSA; §1128B(b)(1) and (2) of the SSA', FALSE, 'Unknown', TRUE, 'offers_expenses_remuneration_safe_harbor_protection', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000029', 'Specifies Medicaid population(s) eligible for the model', 'Statute dictates that a state Medicaid program cannot exclude enrollees or providers because of where they live or work in the state. A waiver of statewideness can limit the geographic area in which a state is testing a new program, facilitate a phased-in implementation of a program, or reduce state expenditures by limiting eligible participants.', NULL, NULL, 'MEDICAID_PAYMENT', '{ADMINISTRATIVE_OPERATIONAL}', '§1902(a)(1) of the SSA', FALSE, 'Unknown', TRUE, 'impacts_medicaid_only_beneficiaries', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000030', 'Telehealth', 'Waives the originating site requirements in sections 1834(m)(4)(C)(i) (geographic limitations) and (ii) (setting limitations).', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=178&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{SITE_OF_CARE}', '§1834(m)(4)(C)(i) (geographic limitations); 42 CFR §410.78(b)(3) and (4); 42 CFR §410.78', TRUE, 'Yes', TRUE, 'impacts_site_of_care_payments', '00000001-0001-0001-0001-000000000001'),
('00000002-0000-0000-0000-000000000031', 'Waiver of Certain Post-Op Billing Restrictions', 'Waives the billing requirements for global surgeries to allow the separate billing of certain (up to 9) post-discharge home visits, including those related to recovery from the surgery.', 'https://cmsgovonline.sharepoint.com/sites/CMS-SharePoint-CMMI-Classic/PP/DAPMI/_layouts/15/listform.aspx?PageType=4&ListId=%7BD0D0466A%2D0A15%2D41D8%2DA922%2DC6AC089B01B7%7D&ID=66&ContentTypeID=0x01001A99FFEB7E4B024BBA9C657298D27F99', NULL, 'PROGRAM_MEDICARE_BE', '{HOSPITAL_FACILITY_RELATED}', '42 CFR §410.26(b)(5)', FALSE, 'No', TRUE, 'modifies_care_delivery_with_claims_based_payments', '00000001-0001-0001-0001-000000000001');
