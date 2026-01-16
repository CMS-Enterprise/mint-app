package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanDocumentSolutionLinksGetBySolutionID implements resolver logic to get plan document solution links associated with a plan ID
func PlanDocumentSolutionLinksGetBySolutionID(logger *zap.Logger, id uuid.UUID, store *storage.Store) ([]*models.PlanDocumentSolutionLink, error) {
	return store.PlanDocumentSolutionLinksGetBySolutionID(logger, id)
}

// PlanDocumentNumLinkedSolutions implements resolver logic to retrieve the number of linked solutions for a document by ID
func PlanDocumentNumLinkedSolutions(logger *zap.Logger, principal authentication.Principal, store *storage.Store, documentID uuid.UUID) (int, error) {
	return store.PlanDocumentNumLinkedSolutions(logger, documentID)
}
