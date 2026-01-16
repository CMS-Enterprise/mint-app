package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/lib/pq"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"

	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage/genericmodel"
)

// PlanDocumentSolutionLinksGetBySolutionID gets a list of document solution links associated with the given plan ID
func (s *Store) PlanDocumentSolutionLinksGetBySolutionID(
	logger *zap.Logger,
	solutionID uuid.UUID,
) ([]*models.PlanDocumentSolutionLink, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocumentSolutionLink.GetBySolutionID)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	var solutionLinks []*models.PlanDocumentSolutionLink
	err = stmt.Select(&solutionLinks, utilitysql.CreateSolutionIDQueryMap(solutionID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	return solutionLinks, nil
}

// PlanDocumentSolutionLinkGetByIDs returns a single plan document solution link by ID
func (s *Store) PlanDocumentSolutionLinkGetByIDs(
	_ *zap.Logger,
	solutionID uuid.UUID,
	documentID uuid.UUID,
) (*models.PlanDocumentSolutionLink, error) {

	link := &models.PlanDocumentSolutionLink{}

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocumentSolutionLink.GetByIDs)
	if err != nil {
		return nil, err
	}
	defer stmt.Close()

	arg := map[string]interface{}{
		"solution_id": solutionID,
		"document_id": documentID,
	}

	err = stmt.Get(link, arg)

	if err != nil {
		return nil, err
	}
	return link, nil
}

// PlanDocumentNumLinkedSolutions implements store logic to retrieve the number of linked solutions for a document by ID
func (s *Store) PlanDocumentNumLinkedSolutions(logger *zap.Logger, documentID uuid.UUID) (int, error) {

	stmt, err := s.db.PrepareNamed(sqlqueries.PlanDocumentSolutionLink.NumLinksByDocumentID)
	if err != nil {
		return 0, genericmodel.HandleModelFetchGenericError(logger, err, documentID)
	}
	defer stmt.Close()

	result := 0
	err = stmt.Get(&result, map[string]interface{}{
		"document_id": documentID,
	})
	if err != nil {
		return 0, genericmodel.HandleModelFetchGenericError(logger, err, documentID)
	}

	return result, nil
}

// convertToStringArray converts a UUID array to a string array so sqlx can understand the type
func convertToStringArray(uuidArray []uuid.UUID) pq.StringArray {

	stringArray := pq.StringArray{}

	for i := 0; i < len(uuidArray); i++ {
		stringArray = append(stringArray, uuidArray[i].String())
	}
	return stringArray

}
