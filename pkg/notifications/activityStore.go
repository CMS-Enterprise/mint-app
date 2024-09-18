package notifications

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// Create creates a new activity in the database
func (s *activityStore) Create(np sqlutils.NamedPreparer, activity *models.Activity) (*models.Activity, error) {
	if activity.ID == uuid.Nil {
		activity.ID = uuid.New()
	}
	// Set the raw data that gets saved to the DB.
	activity.MetaDataRaw = activity.MetaData
	retActivity, procErr := sqlutils.GetProcedure[models.Activity](np, sqlqueries.Activity.Create, activity)
	if procErr != nil {
		return nil, fmt.Errorf("issue creating new activity: %w", procErr)
	}
	return retActivity, nil
}

// GetByID returns an existing activity from the database
func (s *activityStore) GetByID(np sqlutils.NamedPreparer, activityID uuid.UUID) (*models.Activity, error) {

	arg := map[string]interface{}{"id": activityID}

	retActivity, procErr := sqlutils.GetProcedure[models.Activity](np, sqlqueries.Activity.GetByID, arg)
	if procErr != nil {
		return nil, fmt.Errorf("issue retrieving activity: %w", procErr)
	}

	meta, err := parseRawActivityMetaData(retActivity.ActivityType, retActivity.MetaDataRaw)
	if err != nil {
		return nil, fmt.Errorf("issue converting activity meta data to discrete type: %w", err)

	}
	retActivity.MetaData = meta
	return retActivity, nil
}

// GetByIDLoader returns a collection of existing activity from the database
func (s *activityStore) GetByIDLoader(np sqlutils.NamedPreparer, paramTableJSON string) ([]*models.Activity, error) {
	arg := map[string]interface{}{
		"paramTableJSON": paramTableJSON,
	}

	retActivities, err := sqlutils.SelectProcedure[models.Activity](np, sqlqueries.Activity.GetByIDLoader, arg)
	if err != nil {
		return nil, fmt.Errorf("issue selecting activities by ID with the data loader, %w", err)
	}
	//Note: This doesn't parse metaData here, that is the responsibility of the parent function
	return retActivities, nil
}
