package resolvers

import (
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/sqlutils"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

func UserViewCustomizationGetByUserID(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
) (*models.UserViewCustomization, error) {
	retVal, err := sqlutils.WithTransaction[models.UserViewCustomization](
		store,
		func(tx *sqlx.Tx) (*models.UserViewCustomization, error) {
			uvc, err := storage.UserViewCustomizationGetByUserID(tx, principal.Account().ID)
			if err != nil {

				// If the user view customization does not exist, create it
				if errors.Is(err, sql.ErrNoRows) {
					createdUVC, creationErr := createAndInitializeUserViewCustomization(
						tx,
						principal,
						store,
						logger,
						uvc,
					)
					if creationErr != nil {
						return nil, creationErr
					}

					// Assign the uvc value to avoid shadowing
					uvc = createdUVC
				} else {
					return nil, err
				}
			}

			// TODO: What is the point of ViewCustomization being nil if we always set it to a valid array on creation?
			if uvc.ViewCustomization == nil {
				// TODO: Refactor default view customization to a method and apply it here
				uvc.ViewCustomization = pq.StringArray{}

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

func createAndInitializeUserViewCustomization(
	tx *sqlx.Tx,
	principal authentication.Principal,
	store *storage.Store,
	logger *zap.Logger,
	uvc *models.UserViewCustomization,
) (*models.UserViewCustomization, error) {
	uvcToCreate := models.UserViewCustomization{
		UserID:                       principal.Account().ID,
		ViewCustomization:            pq.StringArray{},
		PossibleOperationalSolutions: []uuid.UUID{},
	}

	customizations, err := getDefaultViewCustomizationsByRole(principal, store)
	if err != nil {
		return nil, err
	}

	uvcToCreate.ViewCustomization = models.ConvertEnumsToStringArray(customizations)

	creationErr := BaseStructPreCreate(logger, &uvcToCreate, principal, store, false)
	if creationErr != nil {
		return nil, creationErr
	}

	return storage.UserViewCustomizationCreate(tx, &uvcToCreate)
}

func getDefaultViewCustomizationsByRole(
	principal authentication.Principal,
	store *storage.Store,
) ([]models.ViewCustomizationType, error) {
	var customizations []models.ViewCustomizationType

	if principal.AllowUSER() {
		customizations = append(customizations, models.ViewCustomizationTypeMyModelPlans)
	} else if principal.AllowASSESSMENT() {

		userCollaborationsCount, collabCountErr := store.PlanCollaboratorGetCountByUserID(principal.Account().ID)
		if collabCountErr != nil {
			return nil, collabCountErr
		}

		if userCollaborationsCount > 0 {
			customizations = append(customizations, models.ViewCustomizationTypeMyModelPlans)
		}

		customizations = append(customizations, models.ViewCustomizationTypeAllModelPlans)
	} else if principal.AllowMAC() {
		customizations = append(customizations, models.ViewCustomizationTypeModelsWithCrTdl)
	}
	return customizations, nil
}

func UserViewCustomizationUpdate(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	changes map[string]interface{},
) (*models.UserViewCustomization, error) {
	existingUserViewCustomization, err := UserViewCustomizationGetByUserID(logger, store, principal)
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
