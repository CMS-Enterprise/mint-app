INSERT INTO plan_milestones (
        id,
        model_plan_id,
        enter_cms_clearance,
        enter_hhs_omb_clearance,
        cleared,
        announced,
        applications_due,
        participants_announced,
        performance_period_starts,
        performance_period_ends,
        created_by,
        modified_by
    )
VALUES (
         :id,
         :model_plan_id,
         :enter_cms_clearance,
         :enter_hhs_omb_clearance,
         :cleared,
         :announced,
         :applications_due,
         :participants_announced,
         :performance_period_starts,
         :performance_period_ends,
         :created_by,
         :modified_by
    )
    RETURNING *;
