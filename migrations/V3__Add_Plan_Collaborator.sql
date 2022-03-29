create table plan_collaborator (
    id uuid PRIMARY KEY not null,
    model_plan_id uuid  not null, --foreign key to model plan
    eua_user_id text CHECK (eua_user_id ~ '^[A-Z0-9]{4}$'::text),
    full_name text,
    component text,
    team_role text,

    created_by text, --this could be the eua_user_id?
    created_dts timestamp with time zone,
    modified_by text, --this could be the eua_user_id?
    modified_dts timestamp with time zone

);

