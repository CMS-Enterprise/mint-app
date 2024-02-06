package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// ActivityCreate creates a new activity in the database
func (s *Store) ActivityCreate(np NamedPreparer, activity *models.Activity) (*models.Activity, error) {
	if activity.ID == uuid.Nil {
		activity.ID = uuid.New()
	}
	retActivity, procErr := sqlutils.GetProcedure[models.Activity](np, sqlqueries.Activity.Create, activity)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new activity: %w", procErr)
	}
	return retActivity, nil
}

// ActivityGetByID returns an existing activity from the database
func (s *Store) ActivityGetByID(activityID uuid.UUID) (*models.Activity, error) {

	arg := map[string]interface{}{"id": activityID}

	retActivity, procErr := sqlutils.GetProcedure[models.Activity](s, sqlqueries.Activity.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving activity: %w", procErr)
	}
	return retActivity, nil
}
