WITH QUERIED_IDS AS (
    SELECT
        "id" AS id,
        "modelPlanID" AS model_plan_id,
        "commonWaiverID" AS common_waiver_id,
        "willUseWaiver" AS will_use_waiver,
        "notUsingReason" AS not_using_reason,
        "createdBy" AS created_by,
        "modifiedBy" AS modified_by
    FROM JSON_TO_RECORDSET(:paramTableJSON)
)

INSERT INTO waiver (
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by,
    modified_by
)
SELECT
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by,
    modified_by
FROM QUERIED_IDS
ON CONFLICT (model_plan_id, common_waiver_id) DO UPDATE SET
will_use_waiver = EXCLUDED.will_use_waiver,
not_using_reason = EXCLUDED.not_using_reason,
modified_by = EXCLUDED.modified_by,
modified_dts = CURRENT_TIMESTAMP
RETURNING
    id,
    model_plan_id,
    common_waiver_id,
    will_use_waiver,
    not_using_reason,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
