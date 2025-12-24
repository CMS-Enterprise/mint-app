package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_system_owner/get_by_common_solution_key.sql
var mtoCommonSolutionSystemOwnerGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_system_owner/get_by_id.sql
var mtoCommonSolutionSystemOwnerGetByID string

//go:embed SQL/mto/common_solution_system_owner/get_by_ids.sql
var mtoCommonSolutionSystemOwnerGetByIDs string

//go:embed SQL/mto/common_solution_system_owner/create.sql
var mtoCommonSolutionSystemOwnerCreate string

//go:embed SQL/mto/common_solution_system_owner/update.sql
var mtoCommonSolutionSystemOwnerUpdate string

//go:embed SQL/mto/common_solution_system_owner/delete.sql
var mtoCommonSolutionSystemOwnerDeleteByID string

type mtoCommonSolutionSystemOwnerScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	DeleteByID             string
}

// MTOCommonSolutionSystemOwner houses all the SQL for getting data for common solution system owner from the database
var MTOCommonSolutionSystemOwner = mtoCommonSolutionSystemOwnerScripts{
	GetByCommonSolutionKey: mtoCommonSolutionSystemOwnerGetByCommonSolutionKey,
	GetByID:                mtoCommonSolutionSystemOwnerGetByID,
	GetByIDs:               mtoCommonSolutionSystemOwnerGetByIDs,
	Create:                 mtoCommonSolutionSystemOwnerCreate,
	Update:                 mtoCommonSolutionSystemOwnerUpdate,
	DeleteByID:             mtoCommonSolutionSystemOwnerDeleteByID,
}
