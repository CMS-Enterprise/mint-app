package sqlqueries

import _ "embed"

//go:embed SQL/model_plan/create.sql
var modelPlanCreateSQL string

//go:embed SQL/model_plan/update.sql
var modelPlanUpdateSQL string

//go:embed SQL/model_plan/get_by_id.sql
var modelPlanGetByIDSQL string

//go:embed SQL/model_plan/get_by_name.sql
var modelPlanGetByNameSQL string

//go:embed SQL/model_plan/collection_where_archived.sql
var modelPlanCollectionWhereArchivedSQL string

//go:embed SQL/model_plan/collection_by_collaborator.sql
var modelPlanCollectionByCollaboratorSQL string

//go:embed SQL/model_plan/collection_with_crtdl.sql
var modelPlanCollectionWithCRTDlSQL string

//go:embed SQL/model_plan/collection_approaching_clearance.sql
var modelPlanCollectionApproachingClearanceSQL string

//go:embed SQL/model_plan/delete_by_id.sql
var modelPlanDeleteByID string

//go:embed SQL/model_plan/get_by_id_LOADER.sql
var modelPlanGetByIDLoaderSQL string

//go:embed SQL/model_plan/get_op_solution_last_modified_dts_by_id_LOADER.sql
var modelPlanPlanOpSolutionLastModifiedDtsGetByIDLoaderSQL string

//go:embed SQL/model_plan/get_by_operational_solution_key.sql
var modelPlanGetByOperationalSolutionKeySQL string

//go:embed SQL/model_plan/collection_where_favorited_by_user_id.sql
var modelPlanCollectionWhereFavoritedByUserID string

type modelPlanScripts struct {
	Create                                 string
	Update                                 string
	GetByID                                string
	GetByName                              string
	CollectionWhereArchived                string
	CollectionByCollaborator               string
	CollectionWithCRTDL                    string
	CollectionApproachingClearance         string
	DeleteByID                             string
	GetByIDLoader                          string
	GetOpSolutionLastModifiedDtsByIDLoader string
	GetByOperationalSolutionKey            string
	CollectionWhereFavoritedByUserID       string
}

// ModelPlan houses all the sql for getting data for model plan from the database
var ModelPlan = modelPlanScripts{
	Create:                                 modelPlanCreateSQL,
	Update:                                 modelPlanUpdateSQL,
	GetByID:                                modelPlanGetByIDSQL,
	GetByName:                              modelPlanGetByNameSQL,
	CollectionWhereArchived:                modelPlanCollectionWhereArchivedSQL,
	CollectionByCollaborator:               modelPlanCollectionByCollaboratorSQL,
	CollectionWithCRTDL:                    modelPlanCollectionWithCRTDlSQL,
	CollectionApproachingClearance:         modelPlanCollectionApproachingClearanceSQL,
	DeleteByID:                             modelPlanDeleteByID,
	GetByIDLoader:                          modelPlanGetByIDLoaderSQL,
	GetOpSolutionLastModifiedDtsByIDLoader: modelPlanPlanOpSolutionLastModifiedDtsGetByIDLoaderSQL,
	GetByOperationalSolutionKey:            modelPlanGetByOperationalSolutionKeySQL,
	CollectionWhereFavoritedByUserID:       modelPlanCollectionWhereFavoritedByUserID,
}
