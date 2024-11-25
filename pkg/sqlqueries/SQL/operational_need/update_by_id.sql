WITH retVal AS (
    UPDATE operational_need
    SET
        need_type = :need_type,
        name_other = :name_other,
        needed = :needed,
        modified_by = :modified_by,
        modified_dts = CURRENT_TIMESTAMP
    WHERE operational_need.id = :id
    RETURNING
        id,
        model_plan_id,
        need_type,
        name_other,
        needed,
        created_by,
        created_dts,
        modified_by,
        modified_dts
)

SELECT
    retVal.id,
    retVal.model_plan_id,
    retVal.need_type,
    pon.need_name,
    pon.need_key,
    pon.section,
    retVal.name_other,
    retVal.needed,
    retVal.created_by,
    retVal.created_dts,
    retVal.modified_by,
    retVal.modified_dts
FROM retVal
LEFT JOIN possible_operational_need AS pon ON pon.id = retVal.need_type;
