UPDATE mto_info
SET
    ready_for_review_by= :ready_for_review_by,
    ready_for_review_dts= :ready_for_review_dts,
    created_by= :created_by,
    created_dts= :created_dts,
    modified_by= :modified_by,
    modified_dts= :modified_dts
WHERE id = :id
RETURNING
    id,
    model_plan_id,
    ready_for_review_by,
    ready_for_review_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
