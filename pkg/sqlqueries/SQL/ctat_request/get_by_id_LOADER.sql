WITH QUERIED_IDS AS (
    SELECT UNNEST(CAST(:ctat_request_ids AS UUID[])) AS id
)

SELECT
    ctat_request.id,
    ctat_request.human_readable_id_number,
    ctat_request.requester,
    ctat_request.status,
    ctat_request.assigned_admin,
    ctat_request.admin_assigned_at,
    ctat_request.notes,
    ctat_request.resolution,
    ctat_request.cmmi_group,
    ctat_request.cmmi_group_other,
    ctat_request.cmmi_division,
    ctat_request.cmmi_division_other,
    ctat_request.contract_activity_type,
    ctat_request.contract_activity_type_other,
    ctat_request.contract_name,
    ctat_request.contract_number,
    ctat_request.contract_type,
    ctat_request.contract_type_other,
    ctat_request.type_of_help_needed,
    ctat_request.type_of_help_needed_other,
    ctat_request.describe_help_needed,
    ctat_request.request_urgency,
    ctat_request.date_assistance_needed_by,
    ctat_request.created_by,
    ctat_request.created_dts,
    ctat_request.modified_by,
    ctat_request.modified_dts
FROM ctat_request
INNER JOIN QUERIED_IDS
    ON ctat_request.id = QUERIED_IDS.id;
