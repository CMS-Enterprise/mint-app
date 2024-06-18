package storage

import (
	"fmt"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/sqlqueries"
	"github.com/cmsgov/mint-app/pkg/sqlutils"
)

// UserViewCustomizationCreate creates a new UserViewCustomization in the database
func UserViewCustomizationCreate(
	np sqlutils.NamedPreparer,
	userViewCustomization *models.UserViewCustomization,
) (*models.UserViewCustomization, error) {
	if userViewCustomization.ID == uuid.Nil {
		userViewCustomization.ID = uuid.New()
	}

	retUserViewCustomization, procErr := sqlutils.GetProcedure[models.UserViewCustomization](
		np,
		sqlqueries.UserViewCustomization.Create,
		userViewCustomization,
	)
	if procErr != nil {
		return nil, fmt.Errorf(
			"issue creating new UserViewCustomization object: %w",
			procErr,
		)
	}
	return retUserViewCustomization, nil
}

// UserViewCustomizationGetByUserID returns a UserViewCustomization object for a given user_id in the database
func UserViewCustomizationGetByUserID(
	np sqlutils.NamedPreparer,
	userID uuid.UUID,
) (*models.UserViewCustomization, error) {
	arg := map[string]interface{}{"user_id": userID}

	retUserViewCustomization, procErr := sqlutils.GetProcedure[models.UserViewCustomization](
		np,
		sqlqueries.UserViewCustomization.GetByUserID,
		arg,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue returning UserViewCustomization object by userID: %w", procErr)
	}

	return retUserViewCustomization, nil
}

// UserViewCustomizationUpdate updates a new UserViewCustomization in the database
func UserViewCustomizationUpdate(
	np sqlutils.NamedPreparer,
	userViewCustomization *models.UserViewCustomization,
) (*models.UserViewCustomization, error) {
	retUserViewCustomization, procErr := sqlutils.GetProcedure[models.UserViewCustomization](
		np,
		sqlqueries.UserViewCustomization.Update,
		userViewCustomization,
	)
	if procErr != nil {
		return nil, fmt.Errorf("issue updating UserViewCustomization object: %w", procErr)
	}

	return retUserViewCustomization, nil
}
