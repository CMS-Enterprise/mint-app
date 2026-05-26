SELECT
    ctat_request.id,
    ctat_request.requester,
    ctat_request.human_readable_id_number,
    ctat_request.created_dts AS submission_date,
    ctat_request.contract_name,
    ctat_request.type_of_help_needed,
    ctat_request.type_of_help_needed_other,
    ctat_request.status
FROM ctat_request
WHERE ctat_request.requester = ANY(:requester_ids)
ORDER BY ctat_request.created_dts DESC, ctat_request.human_readable_id_number DESC;
