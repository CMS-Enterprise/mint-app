CREATE VIEW accessibility_requests_and_statuses AS
SELECT
	DISTINCT ON (accessibility_requests.id)
	accessibility_requests.*,
	status,
	accessibility_request_status_records.created_at AS status_created_at,
	accessibility_request_status_records.eua_user_id AS status_eau_user_id
FROM
	accessibility_requests
LEFT JOIN accessibility_request_status_records ON accessibility_request_status_records.request_id = accessibility_requests.id
ORDER BY accessibility_requests.id, accessibility_request_status_records.created_at DESC;
