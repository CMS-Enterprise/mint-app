package utilitySQL

import (
	"github.com/google/uuid"
)

// CreateIDQueryMap creates a map with key "id" which maps to the passed in id
func CreateIDQueryMap(id uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		"id": id,
	}
}

// CreateModelPlanIDQueryMap creates a map with key "model_plan_id" which maps to the passed in id
func CreateModelPlanIDQueryMap(id uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		"model_plan_id": id,
	}
}
