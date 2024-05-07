UPDATE public.translated_audit_queue
SET 
    id= :id,
    change_id= :change_id,
    status= :status,
    attempts= :attempts,
    note= :note,
    created_by= :created_by,
    created_dts= :created_dts,
    modified_by= :modified_by,
    modified_dts= :modified_dts
WHERE id =  :id
RETURNING
id,
change_id,
status,
attempts,
note,
created_by,
created_dts,
modified_by,
modified_dts;
