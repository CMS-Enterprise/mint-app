package resolvers

import (
	"context"
	"fmt"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/models"
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
