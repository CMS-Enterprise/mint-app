package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// CreatePlanDocumentSolutionLinks implements resolver logic to create a collection of new plan document solution links
func CreatePlanDocumentSolutionLinks(logger *zap.Logger, planDocumentSolutionLinks []*models.PlanDocumentSolutionLink, store *storage.Store) ([]*models.PlanDocumentSolutionLink, error) {
	return store.PlanDocumentSolutionLinksCreate(logger, planDocumentSolutionLinks)
}

// RemovePlanDocumentSolutionLink implements resolver logic to delete a plan document solution link
func RemovePlanDocumentSolutionLink(logger *zap.Logger, id uuid.UUID, store *storage.Store) (bool, error) {
	return store.PlanDocumentSolutionLinkRemove(logger, id)
}
