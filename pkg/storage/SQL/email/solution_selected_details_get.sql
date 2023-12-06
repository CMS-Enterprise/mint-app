SELECT
    posSol.filter_view AS filter_view, --noqa
    posSol.sol_name AS sol_name, --noqa
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

    posNEED.need_name AS need_name,
    PLAN.ID AS model_id,
    PLAN.Model_Name AS model_name,
    PLAN.abbreviation AS model_abbreviation,
    PLAN.status AS model_status,
    basics.performance_period_starts AS model_start_date --noqa



FROM operational_solution AS SOL
LEFT JOIN possible_operational_solution AS posSOL ON posSOL.id = SOL.solution_type
LEFT JOIN operational_need AS NEED ON NEED.id = SOL.operational_need_id
LEFT JOIN possible_operational_need AS posNEED ON posNEED.id = NEED.need_type
LEFT JOIN model_plan AS PLAN ON NEED.model_plan_id = PLAN.id
LEFT JOIN plan_basics AS BASICS ON BASICS.model_plan_id = PLAN.id
WHERE

    SOL.ID = :sol_id
