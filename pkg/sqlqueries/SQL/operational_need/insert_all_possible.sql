WITH retVal AS (
    INSERT INTO operational_need(
        id,
        model_plan_id,
        need_type,
        created_by,
        created_dts
    )
    (
        SELECT
            gen_random_uuid() AS id,
            :model_plan_id AS model_plan_id,
            id AS need_type,
            :created_by AS created_by,
            current_timestamp AS created_dts
        FROM possible_operational_need
    )

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
