WITH component_group_mapping AS (
    SELECT 
        unnest(cast(:component_group_keys AS TEXT[])) AS component_group_key
)

SELECT DISTINCT
    mp.id AS model_plan_id,
    cgm.component_group_key AS component_group
FROM
    component_group_mapping cgm
INNER JOIN plan_basics AS pb
    ON (
        -- Map CCMI_ prefixed group keys to cmmi_groups
        (cgm.component_group_key = 'CCMI_PCMG' AND coalesce(pb.cmmi_groups, cast(ARRAY[] AS CMMI_GROUP[])) @> cast(ARRAY['PATIENT_CARE_MODELS_GROUP'] AS CMMI_GROUP[]))
        OR (cgm.component_group_key = 'CCMI_PPG' AND coalesce(pb.cmmi_groups, cast(ARRAY[] AS CMMI_GROUP[])) @> cast(ARRAY['POLICY_AND_PROGRAMS_GROUP'] AS CMMI_GROUP[]))
        OR (cgm.component_group_key = 'CCMI_SCMG' AND coalesce(pb.cmmi_groups, cast(ARRAY[] AS CMMI_GROUP[])) @> cast(ARRAY['SEAMLESS_CARE_MODELS_GROUP'] AS CMMI_GROUP[]))
        OR (cgm.component_group_key = 'CCMI_SPHG' AND coalesce(pb.cmmi_groups, cast(ARRAY[] AS CMMI_GROUP[])) @> cast(ARRAY['STATE_AND_POPULATION_HEALTH_GROUP'] AS CMMI_GROUP[]))
        OR (cgm.component_group_key = 'CCMI_TBD' AND coalesce(pb.cmmi_groups, cast(ARRAY[] AS CMMI_GROUP[])) @> cast(ARRAY['TBD'] AS CMMI_GROUP[]))
        -- Map non-CCMI group keys to cms_centers
        OR (cgm.component_group_key = 'CCSQ' AND coalesce(pb.cms_centers, cast(ARRAY[] AS CMS_CENTER[])) @> cast(ARRAY['CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY'] AS CMS_CENTER[]))
        OR (cgm.component_group_key = 'CM' AND coalesce(pb.cms_centers, cast(ARRAY[] AS CMS_CENTER[])) @> cast(ARRAY['CENTER_FOR_MEDICARE'] AS CMS_CENTER[]))
        OR (cgm.component_group_key = 'CMCS' AND coalesce(pb.cms_centers, cast(ARRAY[] AS CMS_CENTER[])) @> cast(ARRAY['CENTER_FOR_MEDICAID_AND_CHIP_SERVICES'] AS CMS_CENTER[]))
        OR (cgm.component_group_key = 'CPI' AND coalesce(pb.cms_centers, cast(ARRAY[] AS CMS_CENTER[])) @> cast(ARRAY['CENTER_FOR_PROGRAM_INTEGRITY'] AS CMS_CENTER[]))
        OR (cgm.component_group_key = 'FCHCO' AND coalesce(pb.cms_centers, cast(ARRAY[] AS CMS_CENTER[])) @> cast(ARRAY['FEDERAL_COORDINATED_HEALTH_CARE_OFFICE'] AS CMS_CENTER[]))
    )
INNER JOIN model_plan AS mp ON pb.model_plan_id = mp.id
ORDER BY component_group, model_plan_id;    
