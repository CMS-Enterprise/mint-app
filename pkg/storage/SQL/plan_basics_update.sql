UPDATE plan_basics
SET
    model_plan_id = :model_plan_id,
    model_category = :model_category,
    cms_centers = :cms_centers,
    cms_other = :cms_other,
    cmmi_groups = :cmmi_groups,
    model_type = :model_type,
    problem = :problem,
    goal = :goal,
    test_interventions = :test_interventions,
    note = :note,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP,
    status = :status
WHERE plan_basics.id = :id
RETURNING
id,
model_plan_id,
model_category,
cms_centers,
cms_other,
cmmi_groups,
model_type,
problem,
goal,
test_interventions,
note,
created_by,
created_dts,
modified_by,
modified_dts,
status;
