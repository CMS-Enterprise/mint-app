package sqlqueries

import _ "embed"

//go:embed SQL/analytics/changes_per_model.sql
var changesPerModelSQL string

//go:embed SQL/analytics/changes_per_model_by_section.sql
var changesPerModelBySectionSQL string

//go:embed SQL/analytics/changes_per_model_other_data.sql
var changesPerModelOtherDataSQL string

//go:embed SQL/analytics/models_by_status.sql
var modelsByStatusSQL string

//go:embed SQL/analytics/number_of_followers_per_model.sql
var numberOfFollowersPerModelSQL string

//go:embed SQL/analytics/number_of_models.sql
var numberOfModelsSQL string

type analyticsScripts struct {
	ChangesPerModel           string
	ChangesPerModelBySection  string
	ChangesPerModelOtherData  string
	ModelsByStatus            string
	NumberOfFollowersPerModel string
	NumberOfModels            string
}

// Analytics houses all the sql for getting analytics data from the database
var Analytics = analyticsScripts{
	ChangesPerModel:           changesPerModelSQL,
	ChangesPerModelBySection:  changesPerModelBySectionSQL,
	ChangesPerModelOtherData:  changesPerModelOtherDataSQL,
	ModelsByStatus:            modelsByStatusSQL,
	NumberOfFollowersPerModel: numberOfFollowersPerModelSQL,
	NumberOfModels:            numberOfModelsSQL,
}

// Individual query constants for direct access
var (
	ChangesPerModel           = changesPerModelSQL
	ChangesPerModelBySection  = changesPerModelBySectionSQL
	ChangesPerModelOtherData  = changesPerModelOtherDataSQL
	ModelsByStatus            = modelsByStatusSQL
	NumberOfFollowersPerModel = numberOfFollowersPerModelSQL
	NumberOfModels            = numberOfModelsSQL
)
