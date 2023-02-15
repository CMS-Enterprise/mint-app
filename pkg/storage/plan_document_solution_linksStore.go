package storage

import (
	_ "embed"

	"github.com/lib/pq"

	"github.com/cmsgov/mint-app/pkg/authentication"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"

	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_document_solution_link/create.sql
var planDocumentSolutionLinksCreateSQL string

//go:embed SQL/plan_document_solution_link/delete_by_id.sql
var planDocumentSolutionLinkDeleteByIDSQL string

//go:embed SQL/plan_document_solution_link/get_by_solution_id.sql
var planDocumentSolutionLinksGetBySolutionIDSQL string

//go:embed SQL/plan_document_solution_link/get_by_id.sql
var planDocumentSolutionLinkGetByIDSQL string

//go:embed SQL/plan_document_solution_link/num_links_by_document_id.sql
var planDocumentNumLinkedSolutionsSQL string

// PlanDocumentSolutionLinksCreate creates a collection of plan document solution links
func (s *Store) PlanDocumentSolutionLinksCreate(
	_ *zap.Logger,
	solutionID uuid.UUID,
	documentIDs []uuid.UUID,
	principal authentication.Principal,
) ([]*models.PlanDocumentSolutionLink, error) {

	docIDs := convertToStringArray(documentIDs)
	arg := map[string]interface{}{
		"solution_id":  solutionID,
		"document_ids": docIDs,
		"created_by":   principal.Account().ID,
	}

	var ret []*models.PlanDocumentSolutionLink
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinksCreateSQL)
	if err != nil {
		return nil, err
	}

	err = statement.Select(&ret, arg)
	if err != nil {
		return nil, err
	}

	return ret, nil
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

// PlanDocumentSolutionLinksGetBySolutionID gets a list of document solution links associated with the given plan ID
func (s *Store) PlanDocumentSolutionLinksGetBySolutionID(
	logger *zap.Logger,
	solutionID uuid.UUID,
) ([]*models.PlanDocumentSolutionLink, error) {
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinksGetBySolutionIDSQL)
	if err != nil {
		return nil, err
	}

	var solutionLinks []*models.PlanDocumentSolutionLink
	err = statement.Select(&solutionLinks, utilitySQL.CreateSolutionIDQueryMap(solutionID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	return solutionLinks, nil
}

// PlanDocumentNumLinkedSolutions implements store logic to retrieve the number of linked solutions for a document by ID
func (s *Store) PlanDocumentNumLinkedSolutions(logger *zap.Logger, documentID uuid.UUID) (int, error) {
	statement, err := s.db.PrepareNamed(planDocumentNumLinkedSolutionsSQL)
	if err != nil {
		return 0, genericmodel.HandleModelFetchGenericError(logger, err, documentID)
	}

	result := 0
	err = statement.Get(&result, map[string]interface{}{
		"document_id": documentID,
	})
	if err != nil {
		return 0, genericmodel.HandleModelFetchGenericError(logger, err, documentID)
	}

	return result, nil
}

// PlanDocumentSolutionLinkGetByID returns a single plan document solution link by ID
func (s *Store) PlanDocumentSolutionLinkGetByID(logger *zap.Logger, id uuid.UUID) (*models.PlanDocumentSolutionLink, error) {
	link := models.PlanDocumentSolutionLink{}

	stmt, err := s.db.PrepareNamed(planDocumentSolutionLinkGetByIDSQL)
	if err != nil {
		return nil, err
	}

	arg := map[string]interface{}{

		"id": id,
	}

	err = stmt.Get(&link, arg)

	if err != nil {
		return nil, err
	}
	return &link, nil
}

// convertToStringArray converts a UUID array to a string array so sqlx can understand the type
func convertToStringArray(uuidArray []uuid.UUID) pq.StringArray {

	stringArray := pq.StringArray{}

	for i := 0; i < len(uuidArray); i++ {
		stringArray = append(stringArray, uuidArray[i].String())
	}
	return stringArray

}
