INSERT INTO public.nda_agreement(
    id,
    user_id,
    accepted,
    accepted_dts,
    created_by,
    modified_by
)
VALUES(
    :id,
    :user_id,
    :accepted,
    :accepted_dts,
    :created_by,
    :modified_by
)
RETURNING id,
user_id,
accepted,
accepted_dts,
created_by,
created_dts,
modified_by,
modified_dts;
