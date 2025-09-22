INSERT INTO model_plan_mto_template_link (
    id,
    model_plan_id,
    template_id,
    applied_date,
    created_by
) VALUES (
    :id,
    :model_plan_id,
    :template_id,
    :applied_date,
    :created_by
)
RETURNING
    id,
    model_plan_id,
    template_id,
    applied_date,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
