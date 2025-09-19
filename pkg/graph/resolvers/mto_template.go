package resolvers

import (
	"context"
	"fmt"
	"sort"
	"time"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
	"github.com/cms-enterprise/mint-app/pkg/storage/loaders"
)

// MTOTemplateCategoryGetByTemplateIDLOADER implements resolver logic to get all MTO template categories by a template ID using a data loader
func MTOTemplateCategoryGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateCategory, error) {
	return loaders.MTOTemplateCategory.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateMilestoneGetByTemplateIDLOADER implements resolver logic to get all MTO template milestones by a template ID using a data loader
func MTOTemplateMilestoneGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateSolutionGetByTemplateIDLOADER implements resolver logic to get all MTO template solutions by a template ID using a data loader
func MTOTemplateSolutionGetByTemplateIDLOADER(ctx context.Context, templateID uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	return loaders.MTOTemplateSolution.ByTemplateID.Load(ctx, templateID)
}

// MTOTemplateSubCategoryGetByCategoryIDLOADER implements resolver logic to get all MTO template subcategories by a category ID using a data loader
func MTOTemplateSubCategoryGetByCategoryIDLOADER(ctx context.Context, categoryID uuid.UUID) ([]*models.MTOTemplateSubCategory, error) {
	return loaders.MTOTemplateSubCategory.ByCategoryID.Load(ctx, categoryID)
}

// MTOTemplateSolutionGetByMilestoneIDLOADER implements resolver logic to get all MTO template solutions by a milestone ID using a data loader
func MTOTemplateSolutionGetByMilestoneIDLOADER(ctx context.Context, milestoneID uuid.UUID) ([]*models.MTOTemplateSolution, error) {
	return loaders.MTOTemplateSolution.ByMilestoneID.Load(ctx, milestoneID)
}

// MTOTemplateMilestoneGetByCategoryIDLOADER implements resolver logic to get all MTO template milestones by a category ID using a data loader
func MTOTemplateMilestoneGetByCategoryIDLOADER(ctx context.Context, categoryID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.ByCategoryID.Load(ctx, categoryID)
}

// MTOTemplateGetByKeysLOADER implements resolver logic to get all MTO templates, optionally filtered by keys using a data loader
func MTOTemplateGetByKeysLOADER(ctx context.Context, keys []models.MTOTemplateKey) ([]*models.MTOTemplate, error) {
	if len(keys) == 0 {
		// No keys provided, get all templates
		return loaders.MTOTemplate.GetAll.Load(ctx, "")
	}

	// Keys provided, filter by those keys
	var templates []*models.MTOTemplate
	for _, key := range keys {
		template, err := loaders.MTOTemplate.ByKey.Load(ctx, key)
		if err != nil {
			return nil, err
		}
		if template != nil {
			templates = append(templates, template)
		}
	}
	return templates, nil
}

// MTOTemplateGetByIDOrKeyLOADER implements resolver logic to get a single MTO template by ID or key using a data loader
func MTOTemplateGetByIDOrKeyLOADER(ctx context.Context, id *uuid.UUID, key *models.MTOTemplateKey) (*models.MTOTemplate, error) {
	if id != nil {
		return loaders.MTOTemplate.ByID.Load(ctx, *id)
	}
	if key != nil {
		return loaders.MTOTemplate.ByKey.Load(ctx, *key)
	}
	return nil, fmt.Errorf("either id or key must be provided")
}

// MTOTemplateMilestoneGetBySolutionIDLOADER implements resolver logic to get all MTO template milestones by a solution ID using a data loader
func MTOTemplateMilestoneGetBySolutionIDLOADER(ctx context.Context, solutionID uuid.UUID) ([]*models.MTOTemplateMilestone, error) {
	return loaders.MTOTemplateMilestone.BySolutionID.Load(ctx, solutionID)
}

// ApplyTemplateToMTO applies a template to a model plan's MTO
func ApplyTemplateToMTO(
	ctx context.Context,
	store *storage.Store,
	logger *zap.Logger,
	principal authentication.Principal,
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	modelPlanID uuid.UUID,
	templateID uuid.UUID,
) (*model.ApplyTemplateResult, error) {
	principalAccount := principal.Account()
	if principalAccount == nil {
		return nil, fmt.Errorf("principal doesn't have an account, username %s", principal.String())
	}

	// Verify the model plan exists
	modelPlan, err := loaders.ModelPlan.GetByID.Load(ctx, modelPlanID)
	if err != nil {
		return nil, fmt.Errorf("failed to get model plan: %w", err)
	}
	if modelPlan == nil {
		return nil, fmt.Errorf("model plan not found")
	}

	// Verify the template exists
	template, err := loaders.MTOTemplate.ByID.Load(ctx, templateID)
	if err != nil {
		return nil, fmt.Errorf("failed to get template: %w", err)
	}
	if template == nil {
		return nil, fmt.Errorf("template not found")
	}

	// Check if template is already applied to this model plan
	existingLinks, err := loaders.ModelPlanMTOTemplateLink.ByModelPlanID.Load(ctx, modelPlanID)
	if err == nil {
		for _, link := range existingLinks {
			if link.TemplateID == templateID && link.IsActive {
				return nil, fmt.Errorf("template is already applied to this model plan")
			}
		}
	}

	// Start a transaction for the rest of the operations
	return sqlutils.WithTransaction(store, func(tx *sqlx.Tx) (*model.ApplyTemplateResult, error) {

		// Create the new template link
		note := fmt.Sprintf("Template %s applied to model plan %s by %s", template.Name, modelPlan.ModelName, *principalAccount.Username)
		newLink := models.NewModelPlanMTOTemplateLink(
			principalAccount.ID,
			modelPlanID,
			templateID,
			time.Now(),
			true,
			&note,
		)

		// Get template data using loaders
		categories, err := loaders.MTOTemplateCategory.ByTemplateID.Load(ctx, templateID)
		if err != nil {
			return nil, fmt.Errorf("failed to get template categories: %w", err)
		}

		milestones, err := loaders.MTOTemplateMilestone.ByTemplateID.Load(ctx, templateID)
		if err != nil {
			return nil, fmt.Errorf("failed to get template milestones: %w", err)
		}

		solutions, err := loaders.MTOTemplateSolution.ByTemplateID.Load(ctx, templateID)
		if err != nil {
			return nil, fmt.Errorf("failed to get template solutions: %w", err)
		}

		milestoneSolutionLinks, err := loaders.MTOTemplateMilestoneSolutionLink.ByTemplateID.Load(ctx, templateID)
		if err != nil {
			return nil, fmt.Errorf("failed to get template milestone-solution links: %w", err)
		}

		// Apply template data to the model plan's MTO
		warnings := []string{}
		categoriesCreated := 0
		milestonesCreated := 0
		solutionsCreated := 0

		// Map template category IDs to new MTO category IDs,
		// to maintain parent-child relationships and associations
		// when copying categories, milestones, and solutions
		categoryIDMap := make(map[*uuid.UUID]*uuid.UUID)

		// Map template solution IDs to their keys for linking with milestones
		// the links in the DB are based on template solution IDs so we need to preserve them
		solutionIDKeyMap := make(map[uuid.UUID]models.MTOCommonSolutionKey)

		// Copy categories to MTO categories
		// Sort categories by order to maintain proper hierarchy
		sort.Slice(categories, func(i, j int) bool {
			return categories[i].Order < categories[j].Order
		})

		for _, category := range categories {
			parentID := categoryIDMap[category.ParentID]
			mtoCategory := models.NewMTOCategory(
				principalAccount.ID,
				category.Name,
				modelPlanID,
				parentID,
				category.Order,
			)

			err := BaseStructPreCreate(logger, mtoCategory, principal, store, true)
			if err != nil {
				warnings = append(warnings, fmt.Sprintf("failed to prepare MTO category %s: %v", category.Name, err))
				continue
			}

			categoryAdded, err := storage.MTOCategoryCreate(tx, logger, mtoCategory)
			if err != nil {
				warnings = append(warnings, fmt.Sprintf("failed to create MTO category %s: %v", category.Name, err))
				continue
			}

			categoryIDMap[&category.ID] = &categoryAdded.ID

			categoriesCreated++
		}

		// Copy solutions to MTO solutions
		for _, solution := range solutions {
			solutionIDKeyMap[solution.ID] = solution.Key
			_, err := MTOSolutionCreateCommon(
				ctx,
				logger,
				principal,
				store,
				emailService,
				emailTemplateService,
				addressBook,
				modelPlanID,
				solution.Key,
				nil,
			)

			if err != nil {
				warnings = append(warnings, fmt.Sprintf("failed to create MTO solution %s: %v", solution.Name, err))
				continue
			}
			solutionsCreated++
		}

		// Copy milestones to MTO milestones
		for _, milestone := range milestones {

			// // find records in milestoneSolutionLinks that match this milestone ID
			var associatedSolutions []models.MTOCommonSolutionKey
			for _, link := range milestoneSolutionLinks {
				if link.TemplateMilestoneID == milestone.ID {
					if solutionKey, ok := solutionIDKeyMap[link.TemplateSolutionID]; ok {
						associatedSolutions = append(associatedSolutions, solutionKey)
					} else {
						warnings = append(warnings, fmt.Sprintf("solution ID %s linked to milestone ID %s not found in solutionIDKeyMap", link.TemplateSolutionID, milestone.ID))
					}
				}
			}

			_, err := MTOMilestoneCreateCommon(
				ctx,
				logger,
				principal,
				store,
				emailService,
				emailTemplateService,
				addressBook,
				modelPlanID,
				milestone.Key,
				associatedSolutions,
			)
			if err != nil {
				warnings = append(warnings, fmt.Sprintf("failed to create MTO milestone %s: %v", milestone.Name, err))
				continue
			}
			milestonesCreated++
		}

		// Create the template link record
		_, err = storage.ModelPlanMTOTemplateLinkCreate(tx, logger, newLink)
		if err != nil {
			return nil, fmt.Errorf("failed to create template link: %w", err)
		}

		// Return the result
		result := &model.ApplyTemplateResult{
			ModelPlanID:     modelPlanID,
			TemplateID:      templateID,
			CategoriesAdded: categoriesCreated,
			MilestonesAdded: milestonesCreated,
			SolutionsAdded:  solutionsCreated,
			Warnings:        warnings,
		}

		return result, nil
	})
}
