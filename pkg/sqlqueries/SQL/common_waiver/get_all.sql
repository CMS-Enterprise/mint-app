SELECT
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
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM common_waiver
ORDER BY waiver_type, name;
