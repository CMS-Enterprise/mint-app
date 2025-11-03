package helpers

import "github.com/google/uuid"

// PointerTo takes in any item and returns a pointer to that item
func PointerTo[T any](val T) *T {
	return &val
}

// helper
func CloneUUIDPointer(p *uuid.UUID) *uuid.UUID {
	if p == nil {
		return nil
	}
	v := *p
	return &v
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
