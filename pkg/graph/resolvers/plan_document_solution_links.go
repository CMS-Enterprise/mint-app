package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// PlanDocumentSolutionLinksCreate implements resolver logic to create a collection of new plan document solution links
func PlanDocumentSolutionLinksCreate(logger *zap.Logger, store *storage.Store, solutionID uuid.UUID, documentIDs []uuid.UUID, principal authentication.Principal) ([]*models.PlanDocumentSolutionLink, error) {

	//check one link, since all are for the same solution
	link := models.NewPlanDocumentSolutionLink(principal.Account().ID, solutionID)

	err := BaseStructPreCreate(logger, &link, principal, store, true)
	if err != nil {
		return nil, err
	}

	return store.PlanDocumentSolutionLinksCreate(logger, solutionID, documentIDs, principal)
}

// PlanDocumentSolutionLinkRemove implements resolver logic to delete a plan document solution link
func PlanDocumentSolutionLinkRemove(logger *zap.Logger, solutionID uuid.UUID, documentIDs []uuid.UUID, store *storage.Store, principal authentication.Principal) (bool, error) {
	if len(documentIDs) == 0 {
		return true, nil
	}

	existingLink, err := store.PlanDocumentSolutionLinkGetByIDs(logger, solutionID, documentIDs[0])
	if err != nil {
		return false, err
	}

	// Calling BaseStructPreDelete on TODO because we just care if the user has the ability
	// to delete one of the links (if they can delete one, they can delete them all)
	err = BaseStructPreDelete(logger, existingLink, principal, store, true)
	if err != nil {
		return false, err
	}
	return store.PlanDocumentSolutionLinksRemove(logger, solutionID, documentIDs, principal.Account().ID)
}

// PlanDocumentSolutionLinksGetBySolutionID implements resolver logic to get plan document solution links associated with a plan ID
func PlanDocumentSolutionLinksGetBySolutionID(logger *zap.Logger, id uuid.UUID, store *storage.Store) ([]*models.PlanDocumentSolutionLink, error) {
	return store.PlanDocumentSolutionLinksGetBySolutionID(logger, id)
}

// PlanDocumentNumLinkedSolutions implements resolver logic to retrieve the number of linked solutions for a document by ID
func PlanDocumentNumLinkedSolutions(logger *zap.Logger, principal authentication.Principal, store *storage.Store, documentID uuid.UUID) (int, error) {
	return store.PlanDocumentNumLinkedSolutions(logger, documentID)
}
