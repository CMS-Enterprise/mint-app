UPDATE ctat_request
SET
    status = :status,
    assigned_admin = :assigned_admin,
    notes = :notes,
    resolution = :resolution,
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
WHERE ctat_request.id = :id
RETURNING *;
