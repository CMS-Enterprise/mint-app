SELECT
    id,
    user_id,
    v1_agreed,
    v1_agreed_dts,
    v2_agreed,
    v2_agreed_dts,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM public.nda_agreement
WHERE user_id = :user_id
