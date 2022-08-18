INSERT INTO public.nda_agreement(
    id,
    user_id,
    accepted,
    created_by,
    modified_by
)
VALUES(
    :id,
    :user_id,
    :accepted,
    :created_by,
    :modified_by
)
RETURNING id,
user_id,
accepted,
created_by,
modified_by,
modified_dts;
