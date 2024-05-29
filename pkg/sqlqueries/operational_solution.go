package sqlqueries

import _ "embed"

// operationalSolutionAndNumberOfSubtasksGetByID returns a operational solution with number of subtasks object
//
//go:embed SQL/operational_solution/and_number_of_subtasks_get_by_id.sql
var operationalSolutionAndNumberOfSubtasksGetByID string

// operationalSolutionScripts holds all the relevant SQL related to Operational Solutions
type operationalSolutionScripts struct {
	//  returns a operational solution with number of subtasks object by a specific ID
	GetWithNumberOfSubtasksByID string
}

// operationalSolution holds all the SQL scrips related to the operationalSolution Entity
var OperationalSolution = operationalSolutionScripts{
	GetWithNumberOfSubtasksByID: operationalSolutionAndNumberOfSubtasksGetByID,
}
