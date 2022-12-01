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

//go:embed SQL/plan_document_solution/links_create.sql
var planDocumentSolutionLinksCreateSQL string

//go:embed SQL/plan_document_solution/link_delete_by_id.sql
var planDocumentSolutionLinkDeleteByIDSQL string

//go:embed SQL/plan_document_solution/links_get_by_id.sql
var planDocumentSolutionLinksGetByIDSQL string

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
		"created_by":   principal.ID(),
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
	statement, err := s.db.PrepareNamed(planDocumentSolutionLinksGetByIDSQL)
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

// convertToStringArray converts a UUID array to a string array so sqlx can understand the type
func convertToStringArray(uuidArray []uuid.UUID) pq.StringArray {

	stringArray := pq.StringArray{}

	for i := 0; i < len(uuidArray); i++ {
		stringArray = append(stringArray, uuidArray[i].String())
	}
	return stringArray

}
