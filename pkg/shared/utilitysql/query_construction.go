package utilitysql

import (
	"github.com/google/uuid"
)

// CreateIDQueryMap creates a map with key "id" which maps to the passed in id
func CreateIDQueryMap(id uuid.UUID) map[string]interface{} {
	return CreateNamedIDQueryMap("id", id)
}

// CreateUserIDQueryMap creates a map with key "user_id" which maps to the passed in id
func CreateUserIDQueryMap(id uuid.UUID) map[string]interface{} {
	return CreateNamedIDQueryMap("user_id", id)
}

// CreateModelPlanIDQueryMap creates a map with key "model_plan_id" which maps to the passed in id
func CreateModelPlanIDQueryMap(id uuid.UUID) map[string]interface{} {
	return CreateNamedIDQueryMap("model_plan_id", id)
}

// CreateSolutionIDQueryMap creates a map with key "solution_id" which maps to the passed in id
func CreateSolutionIDQueryMap(id uuid.UUID) map[string]interface{} {
	return CreateNamedIDQueryMap("solution_id", id)
}

// CreateDocumentIDQueryMap creates a map with key "document_id" which maps to the passed in id
func CreateDocumentIDQueryMap(id uuid.UUID) map[string]interface{} {
	return CreateNamedIDQueryMap("document_id", id)
}

// CreateNamedIDQueryMap creates a map with a named key which maps to the passed in id
func CreateNamedIDQueryMap(keyIDName string, id uuid.UUID) map[string]interface{} {
	return map[string]interface{}{
		keyIDName: id,
	}
}
