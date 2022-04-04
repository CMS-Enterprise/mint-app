UPDATE model_plan
SET 
    requester = :requester,
    requester_component = :requester_component,
    main_point_of_contact = :main_point_of_contact,
    point_of_contact_component = :point_of_contact_component,
    -- created_by = :created_by,
    -- created_dts = :created_dts,
    modified_by = :modified_by,
    modified_dts =:modified_dts?
WHERE model_plan.id = :id

    RETURNING 
        id,
        requester,
        requester_component,
        main_point_of_contact,
        point_of_contact_component,
        created_by,
        created_dts,
        modified_by,
        modified_dts
        ;