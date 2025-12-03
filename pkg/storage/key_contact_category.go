package storage

import (
	"errors"
	"fmt"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// KeyContactCategoryCreate creates a new key contact category
func KeyContactCategoryCreate(np sqlutils.NamedPreparer, _ *zap.Logger, keyContactCategory *model.KeyContactCategory) (*model.KeyContactCategory, error) {
	if keyContactCategory == nil {
		return nil, errors.New("keyContactCategory cannot be nil")
	}
	if keyContactCategory.ID == uuid.Nil {
		keyContactCategory.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[model.KeyContactCategory](np, sqlqueries.KeyContactCategory.Create, keyContactCategory)
	if err != nil {
		return nil, fmt.Errorf("issue creating new KeyContactCategory object: %w", err)
	}
	return returned, nil
}

// KeyContactCategoryDelete deletes a key contact category
func KeyContactCategoryDelete(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*model.KeyContactCategory, error) {
	arg := map[string]interface{}{"id": id}
	returned, err := sqlutils.GetProcedure[model.KeyContactCategory](np, sqlqueries.KeyContactCategory.Delete, arg)
	if err != nil {
		return nil, fmt.Errorf("issue deleting KeyContactCategory object: %w", err)
	}
	return returned, nil
}

// KeyContactCategoryUpdate updates a key contact category
func KeyContactCategoryUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, keyContactCategory *model.KeyContactCategory) (*model.KeyContactCategory, error) {
	if keyContactCategory == nil {
		return nil, errors.New("keyContactCategory cannot be nil")
	}
	if keyContactCategory.ID == uuid.Nil {
		return nil, errors.New("keyContactCategory.ID cannot be nil")
	}

	returned, err := sqlutils.GetProcedure[model.KeyContactCategory](np, sqlqueries.KeyContactCategory.Update, keyContactCategory)
	if err != nil {
		return nil, fmt.Errorf("issue updating KeyContactCategory object: %w", err)
	}
	return returned, nil
}
