package sqlqueries

import _ "embed"

//go:embed SQL/plan_data_exchange_approach/create.sql
var planDataExchangeApproachCreateSQL string

//go:embed SQL/plan_data_exchange_approach/update.sql
var planDataExchangeApproachUpdateSQL string

//go:embed SQL/plan_data_exchange_approach/delete.sql
var planDataExchangeApproachDeleteSQL string

//go:embed SQL/plan_data_exchange_approach/get_by_id.sql
var planDataExchangeApproachGetByIDSQL string

type planDataExchangeApproachScripts struct {
	Create  string
	Update  string
	Delete  string
	GetByID string
}

// PlanDataExchangeApproach houses all the SQL scripts for the plan_data_exchange_approach table
var PlanDataExchangeApproach = planDataExchangeApproachScripts{
	Create:  planDataExchangeApproachCreateSQL,
	Update:  planDataExchangeApproachUpdateSQL,
	Delete:  planDataExchangeApproachDeleteSQL,
	GetByID: planDataExchangeApproachGetByIDSQL,
}
