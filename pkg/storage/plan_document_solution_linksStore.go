package storage

import (
	_ "embed"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_document_solution_links_create.sql
var planDocumentSolutionLinksCreateSQL string

//go:embed SQL/plan_document_solution_link_delete_by_id.sql
var planDocumentSolutionLinkDeleteByIDSQL string

//go:embed SQL/plan_document_solution_links_get_by_id.sql
var planDocumentSolutionLinksGetByIDSQL string

// PlanDocumentSolutionLinksCreate creates a collection of plan document solution links
func (s *Store) PlanDocumentSolutionLinksCreate(
	logger *zap.Logger,
	planDocumentSolutionLinks []*models.PlanDocumentSolutionLink,
) ([]*models.PlanDocumentSolutionLink, error) {

	var result []*models.PlanDocumentSolutionLink

	for _, link := range planDocumentSolutionLinks {
		item, err := s.PlanDocumentSolutionLinkCreate(logger, link)
		if err != nil {
			return nil, err
		}

		result = append(result, item)
	}

	return result, nil
}

// PlanDocumentSolutionLinkCreate creates a plan document solution link
func (s *Store) PlanDocumentSolutionLinkCreate(
	logger *zap.Logger,
	planDocumentSolutionLink *models.PlanDocumentSolutionLink,
) (*models.PlanDocumentSolutionLink, error) {
	planDocumentSolutionLink.ID = utilityUUID.ValueOrNewUUID(planDocumentSolutionLink.ID)
	planDocumentSolutionLink.ModifiedBy = nil
	planDocumentSolutionLink.ModifiedDts = nil

	retLink := &models.PlanDocumentSolutionLink{}
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinksCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, planDocumentSolutionLink)
	}

	err = statement.Get(retLink, planDocumentSolutionLink)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, retLink)
	}

	return retLink, nil
}

// PlanDocumentSolutionLinkRemove deletes a plan document object by id
func (s *Store) PlanDocumentSolutionLinkRemove(
	logger *zap.Logger,
	id uuid.UUID,
) (bool, error) {
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinkDeleteByIDSQL)
	if err != nil {
		return false, err
	}

	_, err = statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return false, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return true, nil
}

// PlanDocumentSolutionLinksGetByID gets a list of document solution links associated with the given plan ID
func (s *Store) PlanDocumentSolutionLinksGetByID(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
) ([]*models.PlanDocumentSolutionLink, error) {
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinksGetByIDSQL)
	if err != nil {
		return nil, err
	}

	var modelPlanLinks []*models.PlanDocumentSolutionLink
	err = statement.Select(&modelPlanLinks, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, modelPlanID)
	}

	return modelPlanLinks, nil
}
