package storage

import (
	_ "embed"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/apperrors"
)

//go:embed SQL/model_plan_date_changed_email_recipients/get.sql
var modelPlanDateChangedEmailRecipientsSQL string

//go:embed SQL/model_plan_date_changed_email_recipients/create.sql
var modelPlanDateChangedEmailRecipientsCreateSQL string

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

// ModelPlanDateChangedEmailRecipientCreate creates a model plan date changed email recipient
func (s *Store) ModelPlanDateChangedEmailRecipientCreate(logger *zap.Logger, email string) (int, string, error) {
	stmt, err := s.db.PrepareNamed(modelPlanDateChangedEmailRecipientsCreateSQL)
	if err != nil {
		logger.Error(
			"Failed to prepare model plan date changed email recipient create statement",
			zap.Error(err),
		)

		return -1, "", err
	}

	emailRow := struct {
		ID    int    `db:"id"`
		Email string `db:"email"`
	}{}

	err = stmt.Get(&emailRow, map[string]interface{}{"email": email})
	if err != nil {
		logger.Error(
			"Failed to fetch model plan date changed email recipient",
			zap.Error(err),
		)
		return -1, "", &apperrors.QueryError{
			Err:       err,
			Operation: apperrors.QueryFetch,
		}
	}

	return emailRow.ID, emailRow.Email, nil
}
