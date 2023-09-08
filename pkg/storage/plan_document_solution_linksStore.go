package storage

import (
	_ "embed"
	"fmt"

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

//go:embed SQL/plan_document_solution_link/delete_by_ids.sql
var planDocumentSolutionLinkDeleteByIDsSQL string

//go:embed SQL/plan_document_solution_link/get_by_solution_id.sql
var planDocumentSolutionLinksGetBySolutionIDSQL string

//go:embed SQL/plan_document_solution_link/get_by_ids.sql
var planDocumentSolutionLinkGetByIDsSQL string

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

	err := s.db.Select(&ret, planDocumentSolutionLinksCreateSQL, arg)
	if err != nil {
		return nil, err
	}

	return ret, nil
}

// PlanDocumentSolutionLinksRemove deletes a plan document object by id
func (s *Store) PlanDocumentSolutionLinksRemove(
	logger *zap.Logger,
	solutionID uuid.UUID,
	documentIDs []uuid.UUID,
	userID uuid.UUID,
) (bool, error) {

	tx := s.db.MustBegin()
	defer tx.Rollback()

	err := setCurrentSessionUserVariable(tx, userID)
	if err != nil {
		return false, err
	}

	statement, err := tx.PrepareNamed(planDocumentSolutionLinkDeleteByIDsSQL)
	if err != nil {
		return false, err
	}

	docIDs := convertToStringArray(documentIDs)
	arg := map[string]interface{}{
		"solution_id":  solutionID,
		"document_ids": docIDs,
	}

	_, err = statement.Exec(arg)
	if err != nil {
		return false, err
	}

	err = tx.Commit()
	if err != nil {
		return false, fmt.Errorf("could not commit plan document solution link delete transaction: %w", err)
	}

	return true, nil
}

// PlanDocumentSolutionLinksGetBySolutionID gets a list of document solution links associated with the given plan ID
func (s *Store) PlanDocumentSolutionLinksGetBySolutionID(
	logger *zap.Logger,
	solutionID uuid.UUID,
) ([]*models.PlanDocumentSolutionLink, error) {

	var solutionLinks []*models.PlanDocumentSolutionLink
	err := s.db.Select(
		&solutionLinks,
		planDocumentSolutionLinksGetBySolutionIDSQL,
		utilitySQL.CreateSolutionIDQueryMap(solutionID),
	)
	if err != nil {
		return nil, genericmodel.HandleModelFetchGenericError(logger, err, solutionID)
	}

	return solutionLinks, nil
}

// PlanDocumentNumLinkedSolutions implements store logic to retrieve the number of linked solutions for a document by ID
func (s *Store) PlanDocumentNumLinkedSolutions(logger *zap.Logger, documentID uuid.UUID) (int, error) {

	result := 0
	args := map[string]interface{}{
		"document_id": documentID,
	}

	err := s.db.Get(&result, planDocumentNumLinkedSolutionsSQL, args)
	if err != nil {
		return 0, genericmodel.HandleModelFetchGenericError(logger, err, documentID)
	}

	return result, nil
}

// PlanDocumentSolutionLinkGetByIDs returns a single plan document solution link by ID
func (s *Store) PlanDocumentSolutionLinkGetByIDs(
	logger *zap.Logger,
	solutionID uuid.UUID,
	documentID uuid.UUID,
) (*models.PlanDocumentSolutionLink, error) {

	link := &models.PlanDocumentSolutionLink{}
	arg := map[string]interface{}{
		"solution_id": solutionID,
		"document_id": documentID,
	}

	err := s.db.Get(link, planDocumentSolutionLinkGetByIDsSQL, arg)

	if err != nil {
		return nil, err
	}
	return link, nil
}

// convertToStringArray converts a UUID array to a string array so sqlx can understand the type
func convertToStringArray(uuidArray []uuid.UUID) pq.StringArray {

	stringArray := pq.StringArray{}

	for i := 0; i < len(uuidArray); i++ {
		stringArray = append(stringArray, uuidArray[i].String())
	}
	return stringArray

}
