-- Drop mto_solution_selected_details_get and recreate it:
DROP VIEW IF EXISTS mto_solution_selected_details_get;

CREATE VIEW mto_solution_selected_details_get AS
SELECT
    csol.filter_view AS filter_view, --noqa
    COALESCE(sol.name, csol.name) AS sol_name,
    sol.status AS sol_status,
    sol.mto_common_solution_key AS sol_key,
    (
        SELECT
            STRING_AGG(
                account.common_name, ', '
            )
        FROM plan_collaborator AS collab
        LEFT JOIN user_account AS account ON account.id = collab.user_id --noqa
        WHERE collab.model_plan_id = sol.model_plan_id AND collab.team_roles @> '{"MODEL_LEAD"}' --noqa
    ) AS model_lead_names,
    (
        SELECT
            STRING_AGG(
                COALESCE(milestone.name, common_milestone.name), ', '
            )
        FROM mto_milestone_solution_link AS link
        LEFT JOIN mto_milestone AS milestone ON milestone.id = link.milestone_id
        LEFT JOIN mto_common_milestone AS common_milestone
            ON common_milestone.key = milestone.mto_common_milestone_key
        WHERE link.solution_id = sol.ID

    ) AS milestone_names,
    plan.id AS model_id,
    plan.model_name,
    plan.abbreviation AS model_abbreviation,
    plan.status AS model_status,
    timeline.performance_period_starts AS model_start_date --noqa

FROM mto_solution AS sol
LEFT JOIN mto_common_solution AS csol ON csol.key = sol.mto_common_solution_key
LEFT JOIN model_plan AS plan ON plan.id = sol.model_plan_id
LEFT JOIN plan_timeline AS timeline ON timeline.model_plan_id = plan.id
WHERE
    sol.model_plan_id = plan.id
    AND sol.ID = :id;
