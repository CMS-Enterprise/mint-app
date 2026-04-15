package helpers

import "github.com/google/uuid"

func CloneUUIDPointer(p *uuid.UUID) *uuid.UUID {
	if p == nil {
		return nil
	}
	return new(*p)
}
func UUIDPointerEqual(a, b *uuid.UUID) bool {
	switch {
	case a == nil && b == nil:
		return true
	case a == nil || b == nil:
		return false
	default:
		return *a == *b
	}
}
