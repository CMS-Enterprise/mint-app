package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_contact/get_by_common_solution_key.sql
var MTOCommonSolutionContactGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_contact/get_by_id.sql
var MTOCommonSolutionContactGetByID string

//go:embed SQL/mto/common_solution_contact/get_by_ids.sql
var MTOCommonSolutionContactGetByIDs string

//go:embed SQL/mto/common_solution_contact/create.sql
var MTOCommonSolutionContactCreate string

//go:embed SQL/mto/common_solution_contact/update.sql
var MTOCommonSolutionContactUpdate string

//go:embed SQL/mto/common_solution_contact/delete.sql
var MTOCommonSolutionContactDeleteByID string

type MTOCommonSolutionContactScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	DeleteByID             string
}

// MTOCommonSolutionContact houses all the sql for getting data for common solution contact from the database
var MTOCommonSolutionContact = MTOCommonSolutionContactScripts{
	GetByCommonSolutionKey: MTOCommonSolutionContactGetByCommonSolutionKey,
	GetByID:                MTOCommonSolutionContactGetByID,
	GetByIDs:               MTOCommonSolutionContactGetByIDs,
	Create:                 MTOCommonSolutionContactCreate,
	Update:                 MTOCommonSolutionContactUpdate,
	DeleteByID:             MTOCommonSolutionContactDeleteByID,
}
