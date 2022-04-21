package utilitySQL

import (
	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
)

// CreateIDQueryMap creates a map with key "id" which maps to the passed in id
func CreateIDQueryMap(id uuid.UUID) map[string]interface{} {
	id = utilityUUID.ValueOrNewUUID(id)

	return map[string]interface{}{
		"id": id,
	}
}
