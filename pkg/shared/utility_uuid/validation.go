package utility_uuid

import "github.com/google/uuid"

func ValueOrNewUUID(id uuid.UUID) uuid.UUID {
	if id == uuid.Nil {
		return uuid.New()
	}

	return id
}
