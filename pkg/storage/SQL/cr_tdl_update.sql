UPDATE cr_tdl
SET
    model_plan_id = :model_plan_id,
    id_number = :id_number,
    date_initiated = :date_initiated,
    title = :title,
    optional_comments = :optional_comments,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE id = :id
RETURNING
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
