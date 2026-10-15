package storage

import (
	"fmt"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ModelFollowerUpdateCreate saves a new model follower update message
func ModelFollowerUpdateCreate(np sqlutils.NamedPreparer, followerUpdate *models.ModelFollowerUpdate) (*models.ModelFollowerUpdate, error) {
	returned, err := sqlutils.GetProcedure[models.ModelFollowerUpdate](np, sqlqueries.ModelFollowerUpdate.Create, followerUpdate)
	if err != nil {
		return nil, fmt.Errorf("issue creating new ModelFollowerUpdate object: %w", err)
	}
	return returned, nil
}
