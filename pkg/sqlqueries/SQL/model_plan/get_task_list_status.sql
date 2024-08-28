WITH section_statuses AS (
    SELECT
        model_plan_id,
        COUNT(*) FILTER (WHERE status = 'READY_FOR_CLEARANCE') AS ready_for_clearance_count,
        COUNT(*) FILTER (WHERE status = 'READY_FOR_REVIEW') AS ready_for_review_count,
        COUNT(*) FILTER (WHERE status = 'IN_PROGRESS') AS in_progress_count,
        COUNT(*) FILTER (WHERE status = 'READY') AS ready_count,
        COUNT(*) AS total_count
    FROM (
        SELECT
            model_plan_id,
            status
        FROM plan_basics
        UNION ALL
        SELECT
            model_plan_id,
            status
        FROM plan_beneficiaries
        UNION ALL
        SELECT
            model_plan_id,
            status
        FROM plan_participants_and_providers
        UNION ALL
        SELECT
            model_plan_id,
            status
        FROM plan_ops_eval_and_learning
        UNION ALL
        SELECT
            model_plan_id,
            status
        FROM plan_general_characteristics
        UNION ALL
        SELECT
            model_plan_id,
            status
        FROM plan_payments
    ) AS section_statuses
    GROUP BY model_plan_id
)

SELECT
    CASE
    -- All sections are marked as READY_FOR_CLEARANCE
        WHEN ss.ready_for_clearance_count = ss.total_count THEN 'READY_FOR_CLEARANCE'
        -- All sections are marked as READY_FOR_REVIEW or READY_FOR_CLEARANCE
        WHEN ss.ready_for_review_count + ss.ready_for_clearance_count = ss.total_count THEN 'READY_FOR_REVIEW'
        -- All sections are at least IN_PROGRESS (or higher)
        WHEN ss.in_progress_count + ss.ready_for_review_count + ss.ready_for_clearance_count = ss.total_count THEN 'IN_PROGRESS'
        -- All sections are marked as READY
        WHEN ss.ready_count = ss.total_count THEN 'READY'
        -- Default case, fallback to 'IN_PROGRESS' if none of the above are met
        ELSE 'IN_PROGRESS'
    END AS status
FROM
    model_plan AS mp
LEFT JOIN
    section_statuses AS ss ON mp.id = ss.model_plan_id
WHERE
    mp.id = :model_plan_id;
