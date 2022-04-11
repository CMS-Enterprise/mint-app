UPDATE model_plan
SET 
    requester = NULLIF(:requester,''),
    requester_component = NULLIF(:requester_component,''),
    main_point_of_contact = NULLIF(:main_point_of_contact,''),
    point_of_contact_component = NULLIF(:point_of_contact_component,''),
    modified_by = :modified_by,
    modified_dts = CURRENT_TIMESTAMP
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