package sqlqueries

import _ "embed"

// operationalSolutionAndNumberOfSubtasksGetByID returns a operational solution with number of subtasks object
//
//go:embed SQL/operational_solution/and_number_of_subtasks_get_by_id.sql
var operationalSolutionAndNumberOfSubtasksGetByID string

// operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL returns Operational Solutions by Operational Solution ID using a DataLoader
//
//go:embed SQL/operational_solution/get_by_id_LOADER.sql
var operationalSolutionGetByIDLOADER string

// operationalSolutionScripts holds all the relevant SQL related to Operational Solutions
type operationalSolutionScripts struct {
	//  returns a operational solution with number of subtasks object by a specific ID
	GetWithNumberOfSubtasksByID string
	// Holds the SQL query to return an OperationalSolution by ID using a DataLoader
	GetByIDLOADER string
}

// operationalSolution holds all the SQL scrips related to the operationalSolution Entity
var OperationalSolution = operationalSolutionScripts{
	GetWithNumberOfSubtasksByID: operationalSolutionAndNumberOfSubtasksGetByID,
	GetByIDLOADER:               operationalSolutionGetByIDLOADER,
}
