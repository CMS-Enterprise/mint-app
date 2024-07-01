package sqlqueries

import _ "embed"

//go:embed SQL/plan_ops_eval_and_learning/create.sql
var planOpsEvalAndLearningCreateSQL string

//go:embed SQL/plan_ops_eval_and_learning/update.sql
var planOpsEvalAndLearningUpdateSQL string

//go:embed SQL/plan_ops_eval_and_learning/get_by_id.sql
var planOpsEvalAndLearningGetByIDSQL string

//go:embed SQL/plan_ops_eval_and_learning/get_by_model_plan_id_LOADER.sql
var planOpsEvalAndLearningGetByModelPlanIDLoaderSQL string

type planOpsEvalAndLearningScripts struct {
	Create                 string
	Update                 string
	GetByID                string
	GetByModelPlanIDLoader string
}

// PlanOpsEvalAndLearning houses all the sql for getting data for plan ops eval and learning from the database
var PlanOpsEvalAndLearning = planOpsEvalAndLearningScripts{
	Create:                 planOpsEvalAndLearningCreateSQL,
	Update:                 planOpsEvalAndLearningUpdateSQL,
	GetByID:                planOpsEvalAndLearningGetByIDSQL,
	GetByModelPlanIDLoader: planOpsEvalAndLearningGetByModelPlanIDLoaderSQL,
}
