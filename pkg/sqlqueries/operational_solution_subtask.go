package sqlqueries

import _ "embed"

//go:embed SQL/operational_solution_subtask/create.sql
var operationalSolutionSubtaskCreateSQL string

//go:embed SQL/operational_solution_subtask/get_by_id.sql
var operationalSolutionSubtaskGetByIDSQL string

//go:embed SQL/operational_solution_subtask/update.sql
var operationalSolutionSubtaskUpdateByIDSQL string

//go:embed SQL/operational_solution_subtask/delete_by_id.sql
var operationalSolutionSubtaskDeleteByIDSQL string

//go:embed SQL/operational_solution_subtask/get_by_solution_id_LOADER.sql
var operationalSolutionSubtaskGetBySolutionIDLoaderSQL string

type operationalSolutionSubtaskScripts struct {
	Create                string
	GetByID               string
	Update                string
	DeleteByID            string
	GetBySolutionIDLoader string
}

// OperationalSolutionSubtask houses all the sql for getting data for operational solution subtask from the database
var OperationalSolutionSubtask = operationalSolutionSubtaskScripts{
	Create:                operationalSolutionSubtaskCreateSQL,
	GetByID:               operationalSolutionSubtaskGetByIDSQL,
	Update:                operationalSolutionSubtaskUpdateByIDSQL,
	DeleteByID:            operationalSolutionSubtaskDeleteByIDSQL,
	GetBySolutionIDLoader: operationalSolutionSubtaskGetBySolutionIDLoaderSQL,
}
