// Package sqlscripts holds references to relevant SQL queries
package sqlscripts

import _ "embed"

// modelPlanCreateSQL holds the SQL command to create a model plan
//
//go:embed SQL/model_plan/create.sql
var modelPlanCreateSQL string

// modelPlanUpdateSQL holds the SQL command to update a model plan
//
//go:embed SQL/model_plan/update.sql
var modelPlanUpdateSQL string

// ModelPlan holds all relevant SQL scripts for a model plan
var ModelPlan = modelPlanScripts{
	Create: modelPlanCreateSQL,
	Update: modelPlanUpdateSQL,
}

type modelPlanScripts struct {
	// Holds the SQL command to create a model plan
	Create string
	// Holds the SQL command to update a model plan
	Update string
}
