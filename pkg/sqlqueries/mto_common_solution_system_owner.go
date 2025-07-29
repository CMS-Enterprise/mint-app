package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_system_owner/get_by_common_solution_key.sql
var MTOCommonSolutionSystemOwnerGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_system_owner/get_by_id.sql
var MTOCommonSolutionSystemOwnerGetByID string

//go:embed SQL/mto/common_solution_system_owner/get_by_ids.sql
var MTOCommonSolutionSystemOwnerGetByIDs string

//go:embed SQL/mto/common_solution_system_owner/create.sql
var MTOCommonSolutionSystemOwnerCreate string

//go:embed SQL/mto/common_solution_system_owner/update.sql
var MTOCommonSolutionSystemOwnerUpdate string

//go:embed SQL/mto/common_solution_system_owner/delete.sql
var MTOCommonSolutionSystemOwnerDeleteByID string

type MTOCommonSolutionSystemOwnerScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	DeleteByID             string
}

// MTOCommonSolutionSystemOwner houses all the SQL for getting data for common solution system owner from the database
var MTOCommonSolutionSystemOwner = MTOCommonSolutionSystemOwnerScripts{
	GetByCommonSolutionKey: MTOCommonSolutionSystemOwnerGetByCommonSolutionKey,
	GetByID:                MTOCommonSolutionSystemOwnerGetByID,
	GetByIDs:               MTOCommonSolutionSystemOwnerGetByIDs,
	Create:                 MTOCommonSolutionSystemOwnerCreate,
	Update:                 MTOCommonSolutionSystemOwnerUpdate,
	DeleteByID:             MTOCommonSolutionSystemOwnerDeleteByID,
}
