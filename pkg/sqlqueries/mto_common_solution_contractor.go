package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_contractor/get_by_common_solution_key.sql
var MTOCommonSolutionContractorGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_contractor/get_by_id.sql
var MTOCommonSolutionContractorGetByID string

//go:embed SQL/mto/common_solution_contractor/get_by_ids.sql
var MTOCommonSolutionContractorGetByIDs string

//go:embed SQL/mto/common_solution_contractor/create.sql
var MTOCommonSolutionContractorCreate string

//go:embed SQL/mto/common_solution_contractor/update.sql
var MTOCommonSolutionContractorUpdate string

//go:embed SQL/mto/common_solution_contractor/delete.sql
var MTOCommonSolutionContractorDeleteByID string

type MTOCommonSolutionContractorScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	DeleteByID             string
}

// MTOCommonSolutionContractor houses all the sql for getting data for common solution contractor from the database
var MTOCommonSolutionContractor = MTOCommonSolutionContractorScripts{
	GetByCommonSolutionKey: MTOCommonSolutionContractorGetByCommonSolutionKey,
	GetByID:                MTOCommonSolutionContractorGetByID,
	GetByIDs:               MTOCommonSolutionContractorGetByIDs,
	Create:                 MTOCommonSolutionContractorCreate,
	Update:                 MTOCommonSolutionContractorUpdate,
	DeleteByID:             MTOCommonSolutionContractorDeleteByID,
}
