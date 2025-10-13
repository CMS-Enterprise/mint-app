SELECT DISTINCT
    mp.id AS model_plan_id,
    :group_key AS component_group
FROM
    model_plan AS mp
INNER JOIN plan_basics AS pb ON mp.id = pb.model_plan_id
WHERE
    -- Map CCMI_ prefixed group keys to cmmi_groups
    (:group_key = 'CCMI_PCMG' AND 'PATIENT_CARE_MODELS_GROUP' = ANY(pb.cmmi_groups))
    OR (:group_key = 'CCMI_PPG' AND 'POLICY_AND_PROGRAMS_GROUP' = ANY(pb.cmmi_groups))
    OR (:group_key = 'CCMI_SCMG' AND 'SEAMLESS_CARE_MODELS_GROUP' = ANY(pb.cmmi_groups))
    OR (:group_key = 'CCMI_SPHG' AND 'STATE_AND_POPULATION_HEALTH_GROUP' = ANY(pb.cmmi_groups))
    OR (:group_key = 'CCMI_TBD' AND 'TBD' = ANY(pb.cmmi_groups))
    -- Map non-CCMI group keys to cms_centers
    OR (:group_key = 'CCSQ' AND 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY' = ANY(pb.cms_centers))
    OR (:group_key = 'CM' AND 'CENTER_FOR_MEDICARE' = ANY(pb.cms_centers))
    OR (:group_key = 'CMCS' AND 'CENTER_FOR_MEDICAID_AND_CHIP_SERVICES' = ANY(pb.cms_centers))
    OR (:group_key = 'CPI' AND 'CENTER_FOR_PROGRAM_INTEGRITY' = ANY(pb.cms_centers))
    OR (:group_key = 'FCHCO' AND 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE' = ANY(pb.cms_centers))
ORDER BY model_plan_id;
