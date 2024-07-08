package sqlqueries

import _ "embed"

//go:embed SQL/plan_participants_and_providers/create.sql
var planParticipantsAndProvidersCreateSQL string

//go:embed SQL/plan_participants_and_providers/update.sql
var planParticipantsAndProvidersUpdateSQL string

//go:embed SQL/plan_participants_and_providers/get_by_id.sql
var planParticipantsAndProvidersGetByIDSQL string

//go:embed SQL/plan_participants_and_providers/get_by_model_plan_id_LOADER.sql
var planParticipantsAndProvidersGetByModelPlanIDLoaderSQL string

type planParticipantsAndProvidersScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// PlanParticipantsAndProviders houses all the sql for getting data for plan participants and providers from the database
var PlanParticipantsAndProviders = planParticipantsAndProvidersScripts{
	Create:                 planParticipantsAndProvidersCreateSQL,
	Update:                 planParticipantsAndProvidersUpdateSQL,
	GetByID:                planParticipantsAndProvidersGetByIDSQL,
	GetByModelPlanIDLoader: planParticipantsAndProvidersGetByModelPlanIDLoaderSQL,
}
