WITH retVal AS (
    INSERT INTO operational_need(
        id,
        model_plan_id,
        need_type,
        needed,
        created_by,
        created_dts
    )
    (
        SELECT
            :id AS id, -- could do gen_random_uuid()
            :model_plan_id AS model_plan_id,
            (SELECT possible_operational_need.id FROM possible_operational_need WHERE possible_operational_need.need_key = :need_key) AS need_type,
            :needed AS needed,
            :created_by AS created_by,
            CURRENT_TIMESTAMP AS created_dts
    )

    ON CONFLICT(model_plan_id, need_type) DO UPDATE -- If there is already a record for this, 
    SET
    needed = EXCLUDED.needed,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
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
