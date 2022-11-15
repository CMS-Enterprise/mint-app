package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

// PlanDocumentSolutionLinksCreate implements resolver logic to create a collection of new plan document solution links
func PlanDocumentSolutionLinksCreate(logger *zap.Logger, store *storage.Store, solutionID uuid.UUID, documentIDs []uuid.UUID, principal authentication.Principal) ([]*models.PlanDocumentSolutionLink, error) {
	return store.PlanDocumentSolutionLinksCreate(logger, solutionID, documentIDs, principal)
}

// PlanDocumentSolutionLinkRemove implements resolver logic to delete a plan document solution link
func PlanDocumentSolutionLinkRemove(logger *zap.Logger, id uuid.UUID, store *storage.Store) (bool, error) {
	return store.PlanDocumentSolutionLinkRemove(logger, id)
}

// PlanDocumentSolutionLinksGetBySolutionID implements resolver logic to get plan document solution links associated with a plan ID
func PlanDocumentSolutionLinksGetBySolutionID(logger *zap.Logger, id uuid.UUID, store *storage.Store) ([]*models.PlanDocumentSolutionLink, error) {
	return store.PlanDocumentSolutionLinksGetBySolutionID(logger, id)
}
