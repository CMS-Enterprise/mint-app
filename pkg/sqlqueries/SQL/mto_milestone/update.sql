UPDATE mto_milestone
SET 
    mto_common_milestone_id=:mto_common_milestone_id,
    name=:name,
    facilitated_by=:facilitated_by,
    need_by=:need_by,
    status=:status,
    risk_indicator=:risk_indicator,
    is_draft=:is_draft,
    modified_by=:modified_by,
    modified_dts=CURRENT_TIMESTAMP
WHERE mto_milestone.id=:id
RETURNING
id,
model_plan_id,
mto_common_milestone_id,
name,
facilitated_by,
need_by,
status,
risk_indicator,
is_draft,
created_by,
created_dts,
modified_by,
modified_dts;
