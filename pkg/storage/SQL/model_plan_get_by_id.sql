SELECT id,
    requester,
    requester_component,
    main_point_of_contact,
    point_of_contact_component,
    created_by,
    created_dts,
    modified_by,
    modified_dts
FROM model_plan
WHERE id = $1 --TODO rework to named statement