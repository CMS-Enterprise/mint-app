INSERT INTO plan_basics (
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
    )
VALUES (
        :id,
        :model_plan_id,

        :model_type,
        :problem,
        :goal,
        :test_inventions,
        :note,
        :created_by,
        :created_dts,
        :modified_by,
        :modified_dts,
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