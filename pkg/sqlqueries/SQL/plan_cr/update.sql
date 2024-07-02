UPDATE plan_cr
SET
    model_plan_id = :model_plan_id,
    id_number = :id_number,
    date_initiated = :date_initiated,
    date_implemented = :date_implemented,
    title = :title,
    note = :note,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE
    id = :id
RETURNING
id,
model_plan_id,
id_number,
date_initiated,
date_implemented,
title,
note,
created_by,
created_dts,
modified_by,
modified_dts;
