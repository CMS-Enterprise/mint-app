UPDATE nda_agreement
SET accepted = :accepted,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE user_id = :user_id
RETURNING id,
user_id,
accepted,
created_by,
created_dts,
modified_by,
modified_dts;
