package utilityuuid

import "github.com/google/uuid"

// ValueOrNewUUID returns the value if it is not empty, otherwise it returns a new UUID
func ValueOrNewUUID(id uuid.UUID) uuid.UUID {
	if id == uuid.Nil {
		return uuid.New()
	}

	return id
}
