package models

// CTATRequestModelPlanLink represents a related MINT model linked to a CTAT request.
type CTATRequestModelPlanLink struct {
	baseStruct
	ctatRequestRelation
	modelPlanRelation
}
