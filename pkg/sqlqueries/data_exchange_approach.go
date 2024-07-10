package sqlqueries

import _ "embed"

//go:embed SQL/data_exchange_approach/create.sql
var dataExchangeApproachCreateSQL string

//go:embed SQL/data_exchange_approach/get_by_id_LOADER.sql
var dataExchangeApproachGetByIDLoaderSQL string

//go:embed SQL/data_exchange_approach/get_by_model_plan_id_LOADER.sql
var dataExchangeApproachGetByModelPlanIDLoaderSQL string

//go:embed SQL/data_exchange_approach/update.sql
var dataExchangeApproachUpdateSQL string

type dataExchangeApproachScripts struct {
	Create                 string
	GetByIDLoader          string
	GetByModelPlanIDLoader string
	Update                 string
}

// DataExchangeApproach houses all the SQL for getting data for data exchange approach from the database
var DataExchangeApproach = dataExchangeApproachScripts{
	Create:                 dataExchangeApproachCreateSQL,
	GetByIDLoader:          dataExchangeApproachGetByIDLoaderSQL,
	GetByModelPlanIDLoader: dataExchangeApproachGetByModelPlanIDLoaderSQL,
	Update:                 dataExchangeApproachUpdateSQL,
}
