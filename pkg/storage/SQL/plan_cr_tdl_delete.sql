DELETE FROM plan_cr_tdl
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
