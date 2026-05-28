SELECT
    ctat_request_model_plan_link.id,
    ctat_request_model_plan_link.model_plan_id,
    ctat_request_model_plan_link.ctat_request_id,
    ctat_request_model_plan_link.created_by,
    ctat_request_model_plan_link.created_dts,
    ctat_request_model_plan_link.modified_by,
    ctat_request_model_plan_link.modified_dts
FROM ctat_request_model_plan_link
WHERE ctat_request_model_plan_link.ctat_request_id = ANY(:ctat_request_ids)
ORDER BY ctat_request_model_plan_link.created_dts ASC, ctat_request_model_plan_link.id ASC;
