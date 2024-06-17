package resolvers

import (
	"database/sql"
	"errors"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"github.com/samber/lo"
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
		PossibleOperationalSolutions: pq.StringArray{},
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

	// Check the user's role and return the default view customizations
	// Note: The order of these checks is important, as a user who, for example, has AllowAssessment() will also have AllowUser()
	// Therefore, we should check AllowUser() last
	// See pkg/okta/authentication_middleware.go newPrincipal() for details on how role assignment works
	if principal.AllowASSESSMENT() {
		// Assessment users should have 1 or 2 customizations by default:
		// 1. My Model Plans (Only present for Assessment users who are collaborators on at least one model plan)
		// 2. All Model Plans (Always present for Assessment users)
		userCollaborationsCount, collabCountErr := store.PlanCollaboratorGetCountByUserID(principal.Account().ID)
		if collabCountErr != nil {
			return nil, collabCountErr
		}

		if userCollaborationsCount > 0 {
			customizations = append(customizations, models.ViewCustomizationTypeMyModelPlans)
		}

		customizations = append(customizations, models.ViewCustomizationTypeAllModelPlans)
	} else if principal.AllowMAC() {
		// MAC users should always have 1 customization by default:
		// 1. ModelsWithCrTdl (Always present for MAC users)
		customizations = append(customizations, models.ViewCustomizationTypeModelsWithCrTdl)
	} else if principal.AllowNonCMSUser() {
		// TODO: nothing?
	} else if principal.AllowUSER() {
		// If the user has none of the above roles, they're just a regular user
		// Regular users should have 1 customization by default:
		// 1. My Model Plans (Always present for regular users)
		customizations = append(customizations, models.ViewCustomizationTypeMyModelPlans)
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

// UserViewCustomizationStringToUUIDSlice converts a pq.StringArray to a []uuid.UUID
// If the pq.StringArray is nil, it returns nil
// If any of the strings in the pq.StringArray are not valid UUIDs (if they fail to parse from a string), uuid.Nil is returned in its place
func UserViewCustomizationStringToUUIDSlice(logger *zap.Logger, s pq.StringArray) []uuid.UUID {
	if s == nil {
		return nil
	}

	return lo.Map(s, func(id string, index int) uuid.UUID {
		u, err := uuid.Parse(id)
		if err != nil {
			logger.Error("error parsing possible operational solution UUID in UserViewCustomization", zap.String("id", id), zap.Error(err))
			return uuid.Nil
		}
		return u
	})
}
