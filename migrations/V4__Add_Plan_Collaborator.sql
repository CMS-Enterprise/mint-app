create table plan_collaborator (
    id uuid PRIMARY KEY not null,
    model_plan_id uuid  not null, --foreign key to model plan
    eua_user_id eua_id,
    full_name text,
    component text,
    team_role text,

    created_by eua_id,
    created_dts timestamp with time zone,
    modified_by eua_id,
    modified_dts timestamp with time zone

);
