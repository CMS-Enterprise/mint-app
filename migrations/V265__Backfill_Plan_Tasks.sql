/*
Backfill default plan_task rows for model plans created before plan_task existed.

Status derivation aligns with resolver behavior:
- MODEL_PLAN: COMPLETE once the model is cleared or beyond; IN_PROGRESS if any standard
  task-list section has left READY; else TO_DO.
- DATA_EXCHANGE: COMPLETE when the model is cleared or beyond, or when the DEA section
  status is COMPLETE; IN_PROGRESS when DEA is IN_PROGRESS or MTO work has started; else TO_DO.
- MTO: COMPLETE when the model is ACTIVE or a post-active status; IN_PROGRESS when an MTO
  category, solution, or milestone exists; else TO_DO.
*/

WITH plan_flags AS (
    SELECT
        mp.id AS model_plan_id,
        mp.status AS plan_status,
        dea.status AS dea_status,
        (
            EXISTS(
                SELECT 1
                FROM plan_basics pb
                WHERE
                    pb.model_plan_id = mp.id
                    AND pb.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_general_characteristics pgc
                WHERE
                    pgc.model_plan_id = mp.id
                    AND pgc.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_beneficiaries b
                WHERE
                    b.model_plan_id = mp.id
                    AND b.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_participants_and_providers p
                WHERE
                    p.model_plan_id = mp.id
                    AND p.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_ops_eval_and_learning o
                WHERE
                    o.model_plan_id = mp.id
                    AND o.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_payments pay
                WHERE
                    pay.model_plan_id = mp.id
                    AND pay.status IS DISTINCT FROM 'READY'
            )
            OR EXISTS(
                SELECT 1
                FROM plan_timeline t
                WHERE
                    t.model_plan_id = mp.id
                    AND t.status IS DISTINCT FROM 'READY'
            )
        ) AS any_task_section_started,
        EXISTS(
            SELECT 1
            FROM mto_category c
            WHERE c.model_plan_id = mp.id
        ) AS has_mto_category,
        EXISTS(
            SELECT 1
            FROM mto_solution s
            WHERE s.model_plan_id = mp.id
        ) AS has_mto_solution,
        EXISTS(
            SELECT 1
            FROM mto_milestone m
            WHERE m.model_plan_id = mp.id
        ) AS has_mto_milestone
    FROM model_plan mp
    LEFT JOIN plan_data_exchange_approach dea ON dea.model_plan_id = mp.id
),

task_rows AS (
    SELECT
        bf.model_plan_id,
        keys.task_key,
        (
            CASE keys.task_key
                WHEN 'MODEL_PLAN'
                    THEN
                        CASE
                            WHEN bf.plan_status::TEXT IN (
                                'CLEARED',
                                'ANNOUNCED',
                                'ACTIVE',
                                'ENDED',
                                'PAUSED',
                                'CANCELED'
                            ) THEN 'COMPLETE'
                            WHEN bf.any_task_section_started THEN 'IN_PROGRESS'
                            ELSE 'TO_DO'
                        END
                WHEN 'DATA_EXCHANGE'
                    THEN
                        CASE
                            WHEN bf.plan_status::TEXT IN (
                                'CLEARED',
                                'ANNOUNCED',
                                'ACTIVE',
                                'ENDED',
                                'PAUSED',
                                'CANCELED'
                            ) THEN 'COMPLETE'
                            WHEN bf.dea_status = 'COMPLETE'::DEA_TASK_LIST_STATUS THEN 'COMPLETE'
                            WHEN
                                bf.dea_status = 'IN_PROGRESS'::DEA_TASK_LIST_STATUS
                                OR bf.has_mto_category
                                OR bf.has_mto_solution
                                OR bf.has_mto_milestone THEN 'IN_PROGRESS'
                            ELSE 'TO_DO'
                        END
                WHEN 'MTO' THEN
                    CASE
                        WHEN bf.plan_status::TEXT IN (
                            'ACTIVE',
                            'ENDED',
                            'PAUSED',
                            'CANCELED'
                        ) THEN 'COMPLETE'
                        WHEN
                            bf.has_mto_category
                            OR bf.has_mto_solution
                            OR bf.has_mto_milestone THEN 'IN_PROGRESS'
                        ELSE 'TO_DO'
                    END
            END
        )::PLAN_TASK_STATUS AS status
    FROM plan_flags bf
    CROSS JOIN (
        VALUES
        ('MODEL_PLAN'::PLAN_TASK_KEY),
        ('MTO'::PLAN_TASK_KEY),
        ('DATA_EXCHANGE'::PLAN_TASK_KEY)
    ) AS keys(task_key)
)

INSERT INTO plan_task (
    id,
    model_plan_id,
    key,
    status,
    created_by,
    completed_by,
    completed_dts
)
SELECT
    GEN_RANDOM_UUID() AS id,
    tr.model_plan_id,
    tr.task_key,
    tr.status,
    '00000001-0001-0001-0001-000000000001'::UUID AS created_by,
    CASE
        WHEN tr.status = 'COMPLETE'::PLAN_TASK_STATUS THEN '00000001-0001-0001-0001-000000000001'::UUID
    END AS completed_by,
    CASE
        WHEN tr.status = 'COMPLETE'::PLAN_TASK_STATUS THEN CURRENT_TIMESTAMP
    END AS completed_dts
FROM task_rows tr
WHERE NOT EXISTS (
    SELECT 1
    FROM plan_task pt
    WHERE
        pt.model_plan_id = tr.model_plan_id
        AND pt.key = tr.task_key
);
