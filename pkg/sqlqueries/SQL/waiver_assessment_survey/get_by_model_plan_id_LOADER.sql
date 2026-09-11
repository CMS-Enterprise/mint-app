WITH QUERIED_IDS AS (
    /*Translate the input to a table */
    SELECT UNNEST(CAST(:model_plan_ids AS UUID[]))  AS model_plan_id
)

SELECT
    was.id,
    was.model_plan_id,
    was.modifies_medicare_savings_programs,
    was.modifies_medicare_savings_programs_example,
    was.modifies_medicare_savings_programs_why_not,
    was.bundles_payments,
    was.bundles_payments_example,
    was.bundles_payments_why_not,
    was.offers_risk_sharing_arrangements,
    was.offers_risk_sharing_arrangements_example,
    was.offers_risk_sharing_arrangements_why_not,
    was.impacts_site_of_care_payments,
    was.impacts_site_of_care_payments_example,
    was.impacts_site_of_care_payments_why_not,
    was.modifies_care_team_scope_of_practice,
    was.modifies_care_team_scope_of_practice_example,
    was.modifies_care_team_scope_of_practice_why_not,
    was.modifies_care_delivery_with_claims_based_payments,
    was.modifies_care_delivery_with_claims_based_payments_example,
    was.modifies_care_delivery_with_claims_based_payments_why_not,
    was.modifies_quality_measurements_or_payments_via_waivers,
    was.modifies_quality_measurements_or_payments_via_waivers_example,
    was.modifies_quality_measurements_or_payments_via_waivers_why_not,
    was.impacts_medicaid_only_beneficiaries,
    was.impacts_medicaid_only_beneficiaries_example,
    was.impacts_medicaid_only_beneficiaries_why_not,
    was.impacts_home_community_based_service_payments,
    was.impacts_home_community_based_service_payments_example,
    was.impacts_home_community_based_service_payments_why_not,
    was.impacts_managed_care_waivers,
    was.impacts_managed_care_waivers_example,
    was.impacts_managed_care_waivers_why_not,
    was.additional_medicaid_specific_waivers,
    was.status,
    was.completed_by,
    was.completed_dts,
    was.created_by,
    was.created_dts,
    was.modified_by,
    was.modified_dts
FROM waiver_assessment_survey AS was
INNER JOIN QUERIED_IDS ON was.model_plan_id = QUERIED_IDS.model_plan_id
