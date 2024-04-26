INSERT INTO public.nda_agreement(
    id,
    user_id,
    v2_agreed,
    agreed_dts,
    created_by,
    modified_by
)
VALUES(
    :id,
    :user_id,
    :v2_agreed,
    :agreed_dts,
    :created_by,
    :modified_by
)
RETURNING id,
user_id,
v2_agreed,
agreed_dts,
created_by,
created_dts,
modified_by,
modified_dts;
