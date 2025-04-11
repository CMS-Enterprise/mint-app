INSERT INTO public.user_view_customization(
    id,
    user_id,
    view_customization,
    solutions,
    created_by
)
VALUES (
    :id,
    :user_id,
    :view_customization,
    :solutions,
    :created_by
)
RETURNING
    id,
    user_id,
    view_customization,
    solutions,
    created_by,
    created_dts,
    modified_by,
    modified_dts;
