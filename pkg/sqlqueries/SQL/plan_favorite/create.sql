WITH addedFavorite AS (
    INSERT INTO plan_favorite(
        id,
        model_plan_id,
        user_id,
        created_by,
        modified_by
    )
    VALUES (
        :id,
        :model_plan_id,
        :user_id,
        :created_by,
        :modified_by
    )
    ON CONFLICT (model_plan_id, user_id) DO NOTHING
    RETURNING
    id,
    model_plan_id,
    user_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts

)

SELECT
    id,
    model_plan_id,
    user_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM plan_favorite WHERE user_id = :user_id AND model_plan_id = :model_plan_id

UNION
SELECT
    id,
    model_plan_id,
    user_id,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM addedFavorite WHERE user_id = :user_id AND model_plan_id = :model_plan_id;
