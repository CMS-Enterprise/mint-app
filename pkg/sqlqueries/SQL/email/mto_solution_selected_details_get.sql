SELECT
    cSol.filter_view AS filter_view, --noqa
    cSol.sol_name AS sol_name, --noqa
    SOL.status AS sol_status,
    (
        SELECT
            string_agg(
                account.common_name, ', '
            )
        FROM plan_collaborator AS collab
        LEFT JOIN user_account AS account ON account.id = collab.user_id --noqa
        WHERE collab.model_plan_id = plan.ID AND collab.team_roles @> '{"MODEL_LEAD"}' --noqa
    ) AS model_lead_names,

    posNEED.need_name,
    PLAN.ID AS model_id,
    PLAN.model_name,
    PLAN.abbreviation AS model_abbreviation,
    PLAN.status AS model_status,
    basics.performance_period_starts AS model_start_date --noqa



FROM mto_solution AS SOL
LEFT JOIN mto_common_solution AS cSol ON cSol.id = SOL.solution_type
LEFT JOIN operational_need AS NEED ON NEED.id = SOL.operational_need_id
LEFT JOIN possible_operational_need AS posNEED ON posNEED.id = NEED.need_type
LEFT JOIN model_plan AS PLAN ON NEED.model_plan_id = PLAN.id
LEFT JOIN plan_basics AS BASICS ON BASICS.model_plan_id = PLAN.id
WHERE

    SOL.ID = 'ee63364f-9f82-41e8-8784-9d5b144f80cb'
    -- SOL.ID = :id
