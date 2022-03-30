create table model_plan (
    id uuid PRIMARY KEY not null,
    eua_user_id eua_id,
    requester text CHECK (requester IS NOT NULL),
    requester_component text,
    main_point_of_contact text,
    point_of_contact_component text,
    created_by eua_id,
    created_dts timestamp with time zone,
    modified_by eua_id,
    modified_dts timestamp with time zone

);
