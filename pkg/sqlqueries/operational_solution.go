package sqlqueries

import _ "embed"

// operationalSolutionAndPossibleGetByOperationalNeedIDLOADERSQL returns Operational Solutions by Operational Solution ID using a DataLoader
//
//go:embed SQL/operational_solution/get_by_id_LOADER.sql
var operationalSolutionGetByIDLOADER string

type operationalSolutionScripts struct {
	// Holds the SQL query to return an OperationalSolution by ID using a DataLoader
	GetByIDLOADER string
}

// OperationalSolution holds all the SQL scrips related to the OperationalSolution Entity
var OperationalSolution = operationalSolutionScripts{
	GetByIDLOADER: operationalSolutionGetByIDLOADER,
}
