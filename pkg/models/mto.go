package models

type ModelsToOperationMatrix struct {
	// empty on purpose so we have to add resolvers
	// we could probably swap ModelPlan out for modelPlanRelation since we only really need the ID, but this works for now
	ModelPlan *ModelPlan
}
