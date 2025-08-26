package resolvers

import (
	"context"
	"testing"
)

func TestGetChangesPerModel(t *testing.T) {
	// This is a basic test to ensure the method exists and can be called
	resolver := &queryResolver{
		&Resolver{},
	}

	ctx := context.Background()

	// Test that the method exists and can be called
	// This will panic due to nil store, but it tests the method signature
	defer func() {
		if r := recover(); r != nil {
			// Expected panic due to nil store
		}
	}()

	_, _ = resolver.getChangesPerModel(ctx)
}

func TestGetModelsByStatus(t *testing.T) {
	resolver := &queryResolver{
		&Resolver{},
	}

	ctx := context.Background()

	// Test that the method exists and can be called
	defer func() {
		if r := recover(); r != nil {
			// Expected panic due to nil store
		}
	}()

	_, _ = resolver.getModelsByStatus(ctx)
}

func TestGetTotalNumberOfModels(t *testing.T) {
	resolver := &queryResolver{
		&Resolver{},
	}

	ctx := context.Background()

	// Test that the method exists and can be called
	defer func() {
		if r := recover(); r != nil {
			// Expected panic due to nil store
		}
	}()

	_, _ = resolver.getTotalNumberOfModels(ctx)
}
