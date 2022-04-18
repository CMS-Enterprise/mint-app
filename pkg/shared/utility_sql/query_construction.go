package utility_sql

import (
	"github.com/cmsgov/mint-app/pkg/shared/utility_uuid"
	"github.com/google/uuid"
)

func CreateIDQueryMap(id uuid.UUID) map[string]interface{} {
	id = utility_uuid.ValueOrNewUUID(id)

	return map[string]interface{}{
		"id": id,
	}
}
