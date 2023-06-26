package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
)

//go:embed SQL/model_plan_date_changed_email_recipients/get.sql
var modelPlanDateChangedEmailRecipientsSQL string

// ModelPlanDateChangedEmailRecipientsGet returns the model plan date changed email recipients
func (s *Store) ModelPlanDateChangedEmailRecipientsGet(logger *zap.Logger) ([]string, error) {
	stmt, err := s.db.PrepareNamed(modelPlanDateChangedEmailRecipientsSQL)
	if err != nil {
		return nil, err
	}

	var recipients []string
	err = stmt.Select(&recipients, map[string]interface{}{})

	if err != nil {
		logger.Error(
			"Failed to fetch model plan date changed email recipients",
			zap.Error(err),
		)
		return nil, &apperrors.QueryError{
			Err:       err,
			Operation: apperrors.QueryFetch,
		}
	}

	return recipients, nil
}
