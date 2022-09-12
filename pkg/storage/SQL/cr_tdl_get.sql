SELECT
    id,
    model_plan_id,
    id_number,
    date_initiated,
    title,
    optional_comments,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
FROM cr_tdl WHERE id = :id;
