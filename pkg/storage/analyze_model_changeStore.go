package storage

import (
	_ "embed"
	"fmt"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/google/uuid"
	"go.uber.org/zap"
)

//go:embed SQL/analyzed_model_change_create.sql
var analyzedModelChangeCreate string

//go:embed SQL/analyzed_model_change_delete.sql
var analyzedModelChangeDelete string

//go:embed SQL/analyzed_model_change_get_by_model_plan_id.sql
var analyzedModelChangeGetByModelPlanID string

func (s *Store) AnalyzedModelChangeCreate(logger *zap.Logger, analyzedModelChange *models.AnalyzedModelChange) (*models.AnalyzedModelChange, error) {

	if analyzedModelChange.ID == uuid.Nil {
		analyzedModelChange.ID = uuid.New()
	}
	stmt, err := s.db.PrepareNamed(analyzedModelChangeCreate)

	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to create cr__tdl with error %s", err),
			zap.String("user", analyzedModelChange.CreatedBy),
		)
		return nil, err
	}
	retModelChange := models.AnalyzedModelChange{}
	err = stmt.Get(&retModelChange, analyzedModelChange)
	if err != nil {
		logger.Error(
			fmt.Sprintf("Failed to cr__tdl with error %s", err),
			zap.String("user", analyzedModelChange.CreatedBy),
		)
		return nil, err

	}

	return &retModelChange, nil
}
