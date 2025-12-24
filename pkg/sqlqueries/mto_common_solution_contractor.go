package sqlqueries

import _ "embed"

//go:embed SQL/mto/common_solution_contractor/get_by_common_solution_key.sql
var mtoCommonSolutionContractorGetByCommonSolutionKey string

//go:embed SQL/mto/common_solution_contractor/get_by_id.sql
var mtoCommonSolutionContractorGetByID string

//go:embed SQL/mto/common_solution_contractor/get_by_ids.sql
var mtoCommonSolutionContractorGetByIDs string

//go:embed SQL/mto/common_solution_contractor/create.sql
var mtoCommonSolutionContractorCreate string

//go:embed SQL/mto/common_solution_contractor/update.sql
var mtoCommonSolutionContractorUpdate string

//go:embed SQL/mto/common_solution_contractor/delete.sql
var mtoCommonSolutionContractorDeleteByID string

type mtoCommonSolutionContractorScripts struct {
	GetByCommonSolutionKey string
	GetByID                string
	GetByIDs               string
	Create                 string
	Update                 string
	DeleteByID             string
}

// MTOCommonSolutionContractor houses all the sql for getting data for common solution contractor from the database
var MTOCommonSolutionContractor = mtoCommonSolutionContractorScripts{
	GetByCommonSolutionKey: mtoCommonSolutionContractorGetByCommonSolutionKey,
	GetByID:                mtoCommonSolutionContractorGetByID,
	GetByIDs:               mtoCommonSolutionContractorGetByIDs,
	Create:                 mtoCommonSolutionContractorCreate,
	Update:                 mtoCommonSolutionContractorUpdate,
	DeleteByID:             mtoCommonSolutionContractorDeleteByID,
}
