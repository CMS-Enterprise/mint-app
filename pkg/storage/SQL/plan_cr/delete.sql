DELETE FROM plan_cr
WHERE id = :id
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
