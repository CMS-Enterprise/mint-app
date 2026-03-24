package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/helpers"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOCategoryCreate uses the provided information to create a new mto category
func MTOCategoryCreate(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	name string,
	modelPlanID uuid.UUID,
	parentID *uuid.UUID,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	// Note, the position added is not respected when inserted. It will be have a position equal to the max of all other positions
	category := models.NewMTOCategory(principalAccount.ID, name, modelPlanID, parentID, 0)

	err := BaseStructPreCreate(logger, category, principal, store, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryCreate(store, logger, category)
}

// MTOCategoryDelete removes an MTOCategory or SubCategory
func MTOCategoryDelete(logger *zap.Logger, principal authentication.Principal, store *storage.Store, id uuid.UUID) error {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	return sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		existing, err := storage.MTOCategoryGetByID(store, logger, id)
		if err != nil {
			return fmt.Errorf("unable to delete MTO category. Err %w", err)
		}

		// Just check access, don't apply changes here
		if err = BaseStructPreDelete(logger, existing, principal, store, true); err != nil {
			return fmt.Errorf("unable to delete MTO category. Err %w", err)
		}

		if err = storage.MTOCategoryDelete(tx, principalAccount.ID, id); err != nil {
			return fmt.Errorf("unable to delete MTO category. Err %w", err)
		}

		return nil
	})
}

// MTOCategoryRename updates the name of MTOCategory or SubCategory
func MTOCategoryRename(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	name string,
) (*models.MTOCategory, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO category. Err %w", err)
	}
	// update the name
	existing.Name = name

	// Just check access, don't apply changes here
	err = BaseStructPreUpdate(logger, existing, map[string]interface{}{}, principal, store, false, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryUpdate(store, logger, existing)
}

// MTOCategoryReorder updates the position of an MTOCategory or SubCategory
func MTOCategoryReorder(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store,
	id uuid.UUID,
	order *int,
	parentID *uuid.UUID,
) (*models.MTOCategory, error) {
	if order == nil && parentID == nil {
		return nil, fmt.Errorf(" either order or parentID must be provided for MTOCategoryReorder")
	}
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}
	existing, err := storage.MTOCategoryGetByID(store, logger, id)
	if err != nil {
		return nil, fmt.Errorf("unable to update MTO category. Err %w", err)
	}
	// update the position to the new value
	// the re-ordering of other rows is handled in the trigger added in migrations/V188__Add_MTO_Category_Reorder_Trigger.sql
	if order != nil {
		existing.Position = *order
	}
	if parentID != nil {
		if existing.ParentID == nil {
			return nil, fmt.Errorf("you cannot provide a parent id for a parent category")
		}
		// If the changing parents, update here
		if existing.ParentID != parentID {
			existing.ParentID = parentID
			// If an order wasn't provided, determine the position from the other subcategories
			if order == nil {
				existingSubCategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, *parentID)
				if err != nil {
					return nil, fmt.Errorf("unable to determine order for this new subcategory. Err %w", err)
				}
				currentMax := models.GetMaxPosition(existingSubCategories)
				existing.Position = currentMax + 1
			}
		}
	}

	// Just check access, don't apply changes here
	err = BaseStructPreUpdate(logger, existing, map[string]interface{}{}, principal, store, false, true)
	if err != nil {
		return nil, err
	}
	return storage.MTOCategoryUpdate(store, logger, existing)
}

type mtoStandardCategory struct {
	name          string
	subcategories []string
}

const (
	mtoCatParticipants    string = "Participants"
	mtoSubCatAppRevSelect string = "Application, review, and selection"
	mtoSubCatPartSupport  string = "Participant support"

	mtoCatOperations                      string = "Operations"
	mtoSubCatSetupOps                     string = "Set up operations"
	mtoSubCatCollectData                  string = "Collect data"
	mtoSubCatSendData                     string = "Send data to participants"
	mtoSubCatPartAndBeneTrackingAlignment string = "Participant and beneficiary tracking/alignment"
	mtoSubCatBenchmarks                   string = "Benchmarks"
	mtoSubCatInternalFunctions            string = "Internal functions"
	mtoSubCatFFS                          string = "Fee-for-service (FFS)"
	mtoSubCatMonitoring                   string = "Monitoring"

	mtoCatLegal                   string = "Legal"
	mtoSubCatAgreements           string = "Agreements"
	mtoSubCatBenefitEnhancements  string = "Benefit enhancements"
	mtoSubCatEngagementIncentives string = "Beneficiary engagement and incentives"

	mtoCatPayment      string = "Payment"
	mtoSubCatClaims    string = "Claims-based"
	mtoSubCatNonClaims string = "Non-claims based"

	mtoCatPayers        string = "Payers"
	mtoCatQuality       string = "Quality"
	mtoCatLearning      string = "Learning"
	mtoCatEvaluation    string = "Evaluation"
	mtoCatModelCloseout string = "Model closeout or extension"
)

var mtoStandardCategories []mtoStandardCategory = []mtoStandardCategory{
	{
		name: mtoCatParticipants,
		subcategories: []string{
			mtoSubCatAppRevSelect,
			mtoSubCatPartSupport,
		},
	},
	{
		name: mtoCatOperations,
		subcategories: []string{
			mtoSubCatSetupOps,
			mtoSubCatCollectData,
			mtoSubCatSendData,
			mtoSubCatPartAndBeneTrackingAlignment,
			mtoSubCatBenchmarks,
			mtoSubCatInternalFunctions,
			mtoSubCatFFS,
			mtoSubCatMonitoring,
		},
	},
	{
		name: mtoCatLegal,
		subcategories: []string{
			mtoSubCatAgreements,
			mtoSubCatBenefitEnhancements,
			mtoSubCatEngagementIncentives,
		},
	},
	{
		name: mtoCatPayment,
		subcategories: []string{
			mtoSubCatClaims,
			mtoSubCatNonClaims,
		},
	},
	{name: mtoCatPayers, subcategories: []string{}},
	{name: mtoCatQuality, subcategories: []string{}},
	{name: mtoCatLearning, subcategories: []string{}},
	{name: mtoCatEvaluation, subcategories: []string{}},
	{name: mtoCatModelCloseout, subcategories: []string{}},
}

// MTOCreateStandardCategories attempts to create a bunch of categories (some with subcategories) that represent a "standard" set of categories that might
// be useful / expected in a standard MTO
//
// TODO Refactor to do a bulk insert instead of having to loop over the standard categories struct and repeatedly call storage methods in a `tx“
func MTOCreateStandardCategories(ctx context.Context, logger *zap.Logger, principal authentication.Principal, store *storage.Store, modelPlanID uuid.UUID) (bool, error) {
	if err := sqlutils.WithTransactionNoReturn(store, func(tx *sqlx.Tx) error {
		for _, c := range mtoStandardCategories {
			categoryToAdd := models.NewMTOCategory(principal.Account().ID, c.name, modelPlanID, nil, 0)
			createdCategory, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, categoryToAdd)
			if err != nil {
				return err
			}

			for _, sc := range c.subcategories {
				subcategoryToAdd := models.NewMTOCategory(principal.Account().ID, sc, modelPlanID, &createdCategory.ID, 0)
				_, err := storage.MTOCategoryCreateAllowConflicts(tx, logger, subcategoryToAdd)
				if err != nil {
					return err
				}
			}
		}

		return nil
	}); err != nil {
		return false, err
	}
	return true, nil
}

func MTOCategoryGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.ByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}

	// return while adding an uncategorized record as well
	return append(dbCategories, models.MTOUncategorizedFromArray(modelPlanID, nil, dbCategories)), nil
}

// MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER implements resolver logic to get all MTO Categories (including subcategories) by a model plan ID using a data loader
// This is largely useful for testing instead of for app code, as the categories are all returned at the top level.
// It does not include  uncategorized records, as it contextually doesn't make sense.
func MTOCategoryAndSubcategoriesGetByModelPlanIDLOADER(ctx context.Context, modelPlanID uuid.UUID) ([]*models.MTOCategory, error) {
	dbCategories, err := loaders.MTOCategory.AndSubCategoriesByModelPlanID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, err
	}
	// NOTE uncategorized is not included in this call, as it is not able to use it for each parent level category. All are returned at a flat level
	return dbCategories, nil
}

func MTOSubcategoryGetByParentIDLoader(ctx context.Context, modelPlanID uuid.UUID, parentID uuid.UUID) ([]*models.MTOSubcategory, error) {
	dbSubcategories, err := loaders.MTOSubcategory.ByParentID.Load(ctx, parentID)
	if err != nil {
		return nil, err
	}
	// return while adding an uncategorized record as well
	return append(dbSubcategories, models.MTOUncategorizedSubcategoryFromArray(modelPlanID, &parentID, dbSubcategories)), nil
}

func MTOCategoryGetByID(ctx context.Context, id uuid.UUID) (*models.MTOCategory, error) {
	return loaders.MTOCategory.ByID.Load(ctx, id)
}

// MTOCategoriesGetByID returns the subcategory and parent category information given an mto category id
// This function first fetches the category by the provided ID.
// Then, if that category is a parent category (and we have nothing else to fetch), returns that category.
// However, if the supplied ID points to a subcategory (i.e. it has a parent ID), then it also fetches the parent category information so both category AND subcategory are returned as part of this resolver.
// We are not doing a larger SQL call that would return both objects, as that would result in less maintainable code
func MTOCategoriesGetByID(ctx context.Context, id *uuid.UUID, modelPlanID uuid.UUID) (*models.MTOCategories, error) {
	Categories := &models.MTOCategories{
		Category:    models.MTOUncategorized(modelPlanID, nil, 0),
		SubCategory: models.MTOUncategorizedSubcategory(modelPlanID, helpers.PointerTo(uuid.Nil), 0),
	}
	if id == nil {
		return Categories, nil
	}
	immediateCategory, err := MTOCategoryGetByID(ctx, *id)
	if err != nil {
		return nil, err
	}
	// Check if it is a parent category, if so early return without fetching parent
	if immediateCategory.ParentID == nil {
		Categories.Category = immediateCategory
		return Categories, nil
	}

	// fetch the parent category
	parentCategory, err := MTOCategoryGetByID(ctx, *immediateCategory.ParentID)
	if err != nil {
		return nil, err
	}
	Categories.SubCategory = immediateCategory.ToSubcategory()
	Categories.Category = parentCategory

	return Categories, nil
}
