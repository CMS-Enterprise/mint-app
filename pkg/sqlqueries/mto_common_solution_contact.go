package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_contact/get_by_common_solution_key.sql
var mtoCommonSolutionContactGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_contact/get_by_id.sql
var mtoCommonSolutionContactGetByID string

//go:embed SQL/mto/common_solution_contact/get_by_ids.sql
var mtoCommonSolutionContactGetByIDs string

//go:embed SQL/mto/common_solution_contact/create.sql
var mtoCommonSolutionContactCreate string

//go:embed SQL/mto/common_solution_contact/unset_primary_key.sql
var mtoCommonSolutionContactUnsetPrimaryKey string

//go:embed SQL/mto/common_solution_contact/update.sql
var mtoCommonSolutionContactUpdate string

//go:embed SQL/mto/common_solution_contact/delete.sql
var mtoCommonSolutionContactDeleteByID string

type mtoCommonSolutionContactScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	UnsetPrimaryKey        string
	DeleteByID             string
}

// MTOCommonSolutionContact houses all the sql for getting data for common solution contact from the database
var MTOCommonSolutionContact = mtoCommonSolutionContactScripts{
	GetByCommonSolutionKey: mtoCommonSolutionContactGetByCommonSolutionKey,
	GetByID:                mtoCommonSolutionContactGetByID,
	GetByIDs:               mtoCommonSolutionContactGetByIDs,
	Create:                 mtoCommonSolutionContactCreate,
	Update:                 mtoCommonSolutionContactUpdate,
	UnsetPrimaryKey:        mtoCommonSolutionContactUnsetPrimaryKey,
	DeleteByID:             mtoCommonSolutionContactDeleteByID,
}
