WITH component_group_mapping AS (
    SELECT 
        unnest(cast(:component_group_keys AS TEXT[])) AS component_group_key
)

SELECT DISTINCT
    mp.id AS model_plan_id,
    cgm.component_group_key AS component_group
FROM
    component_group_mapping cgm
CROSS JOIN model_plan AS mp
INNER JOIN plan_basics AS pb ON mp.id = pb.model_plan_id
WHERE
    -- Map CCMI_ prefixed group keys to cmmi_groups
    (cgm.component_group_key = 'CCMI_PCMG' AND 'PATIENT_CARE_MODELS_GROUP' = any(pb.cmmi_groups))
    OR (cgm.component_group_key = 'CCMI_PPG' AND 'POLICY_AND_PROGRAMS_GROUP' = any(pb.cmmi_groups))
    OR (cgm.component_group_key = 'CCMI_SCMG' AND 'SEAMLESS_CARE_MODELS_GROUP' = any(pb.cmmi_groups))
    OR (cgm.component_group_key = 'CCMI_SPHG' AND 'STATE_AND_POPULATION_HEALTH_GROUP' = any(pb.cmmi_groups))
    OR (cgm.component_group_key = 'CCMI_TBD' AND 'TBD' = any(pb.cmmi_groups))
    -- Map non-CCMI group keys to cms_centers
    OR (cgm.component_group_key = 'CCSQ' AND 'CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY' = any(pb.cms_centers))
    OR (cgm.component_group_key = 'CM' AND 'CENTER_FOR_MEDICARE' = any(pb.cms_centers))
    OR (cgm.component_group_key = 'CMCS' AND 'CENTER_FOR_MEDICAID_AND_CHIP_SERVICES' = any(pb.cms_centers))
    OR (cgm.component_group_key = 'CPI' AND 'CENTER_FOR_PROGRAM_INTEGRITY' = any(pb.cms_centers))
    OR (cgm.component_group_key = 'FCHCO' AND 'FEDERAL_COORDINATED_HEALTH_CARE_OFFICE' = any(pb.cms_centers))
ORDER BY component_group, model_plan_id;
