package storage

import (
	"fmt"

	"github.com/google/uuid"
	"github.com/lib/pq"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ModelPlanMTOTemplateLinkGetByIDLoader returns model plan MTO template links by ID
func ModelPlanMTOTemplateLinkGetByIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, ids []uuid.UUID) ([]*models.ModelPlanMTOTemplateLink, error) {
	args := map[string]interface{}{
		"ids": pq.Array(ids),
	}

	returned, err := sqlutils.SelectProcedure[models.ModelPlanMTOTemplateLink](np, sqlqueries.ModelPlanMTOTemplateLink.GetByIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// ModelPlanMTOTemplateLinkGetByModelPlanIDLoader returns model plan MTO template links by model plan ID
func ModelPlanMTOTemplateLinkGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.ModelPlanMTOTemplateLink, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.ModelPlanMTOTemplateLink](np, sqlqueries.ModelPlanMTOTemplateLink.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// ModelPlanMTOTemplateLinkGetByTemplateIDLoader returns model plan MTO template links by template ID
func ModelPlanMTOTemplateLinkGetByTemplateIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, templateIDs []uuid.UUID) ([]*models.ModelPlanMTOTemplateLink, error) {
	args := map[string]interface{}{
		"template_ids": pq.Array(templateIDs),
	}

	returned, err := sqlutils.SelectProcedure[models.ModelPlanMTOTemplateLink](np, sqlqueries.ModelPlanMTOTemplateLink.GetByTemplateIDLoader, args)
	if err != nil {
		return nil, err
	}

	return returned, nil
}

// ModelPlanMTOTemplateLinkCreate creates a new model plan MTO template link
func ModelPlanMTOTemplateLinkCreate(np sqlutils.NamedPreparer, _ *zap.Logger, link *models.ModelPlanMTOTemplateLink) (*models.ModelPlanMTOTemplateLink, error) {
	if link.ID == uuid.Nil {
		link.ID = uuid.New()
	}

	returned, err := sqlutils.GetProcedure[models.ModelPlanMTOTemplateLink](np, sqlqueries.ModelPlanMTOTemplateLink.Create, link)
	if err != nil {
		return nil, fmt.Errorf("issue creating new ModelPlanMTOTemplateLink object: %w", err)
	}
	return returned, nil
}
