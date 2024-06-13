package resolvers

import (
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/sqlutils"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func UserViewCustomizationGetByUserID(
	logger *zap.Logger,
	store *storage.Store,
	userID uuid.UUID,
) (*models.UserViewCustomization, error) {
	retVal, err := sqlutils.WithTransaction[models.UserViewCustomization](
		store,
		func(tx *sqlx.Tx) (*models.UserViewCustomization, error) {
			uvc, err := storage.UserViewCustomizationGetByUserID(tx, userID)
			if err != nil {
				// TODO: If the error indicates a missing record, create a new record here
				if errors.Is(err, sql.ErrNoRows) {
					uvcToCreate := models.UserViewCustomization{
						ViewCustomization:            nil,
						PossibleOperationalSolutions: nil,
					}

					// TODO: Pipe in necessary dependencies
					creationErr := BaseStructPreCreate(logger, &uvcToCreate, nil, store, true)
					if creationErr != nil {
						return nil, creationErr
					}

					_, creationErr = storage.UserViewCustomizationCreate(tx, &uvcToCreate)
					if creationErr != nil {
						return nil, creationErr
					}
				}

				// TODO: Remove this debug println
				println("UserViewCustomizationGetByUserID: ", err.Error())
				return nil, err
			}

			if uvc.ViewCustomization == nil {
				// TODO: Apply default view customization based on user role
				uvc.ViewCustomization = []models.ViewCustomizationType{}

				uvc, err = storage.UserViewCustomizationUpdate(tx, uvc)
				if err != nil {
					return nil, err
				}
			}

			return uvc, nil
		},
	)
	if err != nil {
		return nil, err
	}

	return retVal, nil
}

func UserViewCustomizationUpdate(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	userID uuid.UUID,
	changes map[string]interface{},
) (*models.UserViewCustomization, error) {
	existingUserViewCustomization, err := UserViewCustomizationGetByUserID(logger, store, userID)
	if err != nil {
		return nil, err
	}

	err = BaseStructPreUpdate(
		logger,
		existingUserViewCustomization,
		changes,
		principal,
		store,
		true,
		false,
	)
	if err != nil {
		return nil, err
	}

	return storage.UserViewCustomizationUpdate(store, existingUserViewCustomization)
}
