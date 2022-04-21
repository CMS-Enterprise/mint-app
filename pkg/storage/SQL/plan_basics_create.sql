INSERT INTO plan_basics (
        id,
        model_plan_id,

        model_type,
        problem,
        goal,
        test_inventions,
        note,
        created_by,
        modified_by,
        status
    )
VALUES (
        :id,
        :model_plan_id,

        :model_type,
        NULLIF(:problem,''),
        NULLIF(:goal,''),
        NULLIF(:test_inventions,''),
        NULLIF(:note,''),
        :created_by,
        :modified_by,
        :status

    )
    RETURNING
        id,
        model_plan_id,

        model_type,
        problem,
        goal,
        test_inventions,
        note,
        created_by,
        created_dts,
        modified_by,
        modified_dts,
        status
        ;