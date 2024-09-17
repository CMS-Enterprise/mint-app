package resolvers

import (
	"database/sql"
	"errors"

	"github.com/jmoiron/sqlx"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/sqlutils"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// UserViewCustomizationGetByUserID retrieves a user view customization by user ID (using the ID from the passed in authentication.Principal object)
func UserViewCustomizationGetByUserID(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
) (*models.UserViewCustomization, error) {
	// Ensure the principal has an account, throw an error otherwise.
	// This function relies on the account ID for many of its functions
	account, err := principal.MustAccount()
	if err != nil {
		logger.Error("user account was nil when fetching user view customizations", zap.Error(err))
		return nil, err
	}

	retVal, err := sqlutils.WithTransaction[models.UserViewCustomization](
		store,
		func(tx *sqlx.Tx) (*models.UserViewCustomization, error) {
			uvc, err := storage.UserViewCustomizationGetByUserID(tx, account.ID)
			if err != nil {

				// If the user view customization does not exist, create it
				if errors.Is(err, sql.ErrNoRows) {
					createdUVC, creationErr := createAndInitializeUserViewCustomization(
						tx,
						principal,
						store,
						logger,
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
) (*models.UserViewCustomization, error) {
	uvcToCreate := models.UserViewCustomization{
		ViewCustomization:            pq.StringArray{},
		PossibleOperationalSolutions: pq.StringArray{},
	}

	// should be created for (and by) the user who made the query
	uvcToCreate.UserID = principal.Account().ID
	uvcToCreate.CreatedBy = principal.Account().ID

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

// getDefaultViewCustomizationsByRole returns a default view customization slice for a principal based on their role
//
// Note: The order of these role checks is important. A user who, for example, has AllowAssessment() will ALSO have AllowUser()
// Therefore, we should check AllowUser() last
// See pkg/okta/authentication_middleware.go newPrincipal() for details on how role assignment works
func getDefaultViewCustomizationsByRole(
	principal authentication.Principal,
	store *storage.Store,
) ([]models.ViewCustomizationType, error) {
	var customizations []models.ViewCustomizationType

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
	} else if principal.AllowNonCMSUser() || principal.AllowUSER() {
		// If the user has none of the above roles, they're just a regular user or a non-CMS user, which we treat the same for this function
		// These users should have 1 customization by default:
		// 1. My Model Plans (Always present)
		customizations = append(customizations, models.ViewCustomizationTypeMyModelPlans)
	}

	return customizations, nil
}

// UserViewCustomizationUpdate handles updating a user view customization with a map of changes
func UserViewCustomizationUpdate(
	logger *zap.Logger,
	store *storage.Store,
	principal authentication.Principal,
	changes map[string]interface{},
) (*models.UserViewCustomization, error) {
	// Ensure the principal has an account, throw an error otherwise.
	// This function relies on the account ID for many of its functions
	if _, err := principal.MustAccount(); err != nil {
		logger.Error("user account was nil when updating user view customizations", zap.Error(err))
		return nil, err
	}

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
