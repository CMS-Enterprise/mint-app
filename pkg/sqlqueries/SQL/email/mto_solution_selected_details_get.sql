SELECT
    cSol.filter_view AS filter_view, --noqa
    COALESCE(SOL.name, cSol.name) AS sol_name,
    SOL.status AS sol_status,
    SOL.mto_common_solution_key AS sol_key,
    (
        SELECT
            STRING_AGG(
                account.common_name, ', '
            )
        FROM plan_collaborator AS collab
        LEFT JOIN user_account AS account ON account.id = collab.user_id --noqa
        WHERE collab.model_plan_id = plan.ID AND collab.team_roles @> '{"MODEL_LEAD"}' --noqa
    ) AS model_lead_names,
    (
        SELECT
            STRING_AGG(
                COALESCE(milestone.name, common_milestone.name), ', '
            )
        FROM mto_milestone_solution_link AS link
        LEFT JOIN mto_milestone AS milestone ON milestone.id = link.milestone_id
        LEFT JOIN mto_common_milestone AS common_milestone ON common_milestone.key = milestone.mto_common_milestone_key
        WHERE link.solution_id = SOL.ID

    ) AS milestone_names,
    PLAN.ID AS model_id,
    PLAN.model_name,
    PLAN.abbreviation AS model_abbreviation,
    PLAN.status AS model_status,
    basics.performance_period_starts AS model_start_date --noqa



FROM mto_solution AS SOL
LEFT JOIN mto_common_solution AS cSol ON cSol.key = SOL.mto_common_solution_key
LEFT JOIN model_plan AS PLAN ON SOL.model_plan_id = PLAN.id
LEFT JOIN plan_basics AS BASICS ON BASICS.model_plan_id = PLAN.id
WHERE

    SOL.ID = :id
