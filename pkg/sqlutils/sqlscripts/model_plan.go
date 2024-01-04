// Package sqlscripts holds references to relevant SQL queries
package sqlscripts

import _ "embed"

// ModelPlanCreateSQL holds the SQL command to create a model plan
//
//go:embed SQL/model_plan/create.sql
var ModelPlanCreateSQL string

// ModelPlanUpdateSQL holds the SQL command to update a model plan
//
//go:embed SQL/model_plan/update.sql
var ModelPlanUpdateSQL string
