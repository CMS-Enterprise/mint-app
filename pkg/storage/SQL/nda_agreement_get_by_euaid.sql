SELECT
    id,
    user_id,
    accepted,
    accepted_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM public.nda_agreement
WHERE user_id = :user_id
