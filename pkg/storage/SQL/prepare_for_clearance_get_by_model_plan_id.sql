SELECT
    GREATEST(
        basics.ready_for_clearance_dts,
        charact.ready_for_clearance_dts,
        part.ready_for_clearance_dts,
        bene.ready_for_clearance_dts,
        ops.ready_for_clearance_dts,
        pay.ready_for_clearance_dts
    ) AS most_recent_clearance_dts,
    basics.clearance_starts,
    (
        GREATEST(
            basics.status,
            charact.status,
            part.status,
            bene.status,
            ops.status,
            pay.status
        ) = LEAST(
            basics.status,
            charact.status,
            part.status,
            bene.status,
            ops.status,
            pay.status
        )
    )
    AND basics.status = 'READY_FOR_CLEARANCE' AS all_ready_for_clearance
FROM model_plan AS mp
LEFT JOIN plan_basics AS basics ON basics.model_plan_id = mp.id
LEFT JOIN plan_general_characteristics AS charact ON charact.model_plan_id = mp.id
LEFT JOIN plan_participants_and_providers AS part ON part.model_plan_id = mp.id
LEFT JOIN plan_beneficiaries AS bene ON bene.model_plan_id = mp.id
LEFT JOIN plan_ops_eval_and_learning AS ops ON ops.model_plan_id = mp.id
LEFT JOIN plan_payments AS pay ON pay.model_plan_id = mp.id
WHERE mp.id = :model_plan_id
