SELECT
    possol.filter_view AS filter_view, --noqa
    possol.sol_name AS sol_name, --noqa
    sol.status AS sol_status,
    (
        SELECT
            string_agg(
                account.common_name, ', '
            )
        FROM plan_collaborator AS collab
        LEFT JOIN user_account AS account ON account.id = collab.user_id --noqa
        WHERE collab.model_plan_id = plan.id AND collab.team_roles @> '{"MODEL_LEAD"}' --noqa
    ) AS model_lead_names,
    posneed.need_name,
    plan.id AS model_id,
    plan.model_name,
    plan.abbreviation AS model_abbreviation,
    plan.status AS model_status,
    timeline.performance_period_starts AS model_start_date --noqa
FROM operational_solution AS sol
LEFT JOIN possible_operational_solution AS possol
    ON possol.id = sol.solution_type
LEFT JOIN operational_need AS need ON need.id = sol.operational_need_id
LEFT JOIN possible_operational_need AS posneed ON posneed.id = need.need_type
LEFT JOIN model_plan AS plan ON need.model_plan_id = plan.id
LEFT JOIN plan_timeline AS timeline ON timeline.model_plan_id = plan.id
WHERE sol.id = :sol_id;
