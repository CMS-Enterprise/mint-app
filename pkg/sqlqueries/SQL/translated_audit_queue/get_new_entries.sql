-- Changes (Job) Update this to 
/*
1. Find all new audit changes that don't have an entry in this table or the translated table
2. Insert a record in the queue
3. Return all queue records
    a. Factory makes a job for each entry

*/
SELECT
    id,
    change_id,
    status,
    attempts,
    note,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM public.translated_audit_queue
WHERE id =  :id;
