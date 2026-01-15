package sqlqueries

import _ "embed"

//go:embed SQL/operational_solution_subtask/get_by_id.sql
var operationalSolutionSubtaskGetByIDSQL string

//go:embed SQL/operational_solution_subtask/get_by_solution_id_LOADER.sql
var operationalSolutionSubtaskGetBySolutionIDLoaderSQL string

type operationalSolutionSubtaskScripts struct {
	GetByID string

	GetBySolutionIDLoader string
}

// OperationalSolutionSubtask houses all the sql for getting data for operational solution subtask from the database
var OperationalSolutionSubtask = operationalSolutionSubtaskScripts{
	GetByID:               operationalSolutionSubtaskGetByIDSQL,
	GetBySolutionIDLoader: operationalSolutionSubtaskGetBySolutionIDLoaderSQL,
}
