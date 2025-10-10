package helpers

import (
	"fmt"

	"github.com/google/uuid"
)

// PointerTo takes in any item and returns a pointer to that item
func PointerTo[T any](val T) *T {
	return &val
}

// helper function to coerce various types to *uuid.UUID
func CoerceUUIDPtr(v any) (*uuid.UUID, error) {
	switch x := v.(type) {
	case nil:
		return nil, nil
	case *uuid.UUID:
		return x, nil
	case uuid.UUID:
		u := x
		return &u, nil
	case *string:
		if x == nil || *x == "" {
			return nil, nil
		}
		u, err := uuid.Parse(*x)
		return &u, err
	case string:
		if x == "" {
			return nil, nil
		}
		u, err := uuid.Parse(x)
		return &u, err
	case []byte:
		u, err := uuid.FromBytes(x)
		return &u, err
	default:
		return nil, fmt.Errorf("unsupported type %T", v)
	}
}
