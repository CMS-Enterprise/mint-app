package storage

import (
	"database/sql"
	_ "embed"
	"github.com/cmsgov/mint-app/pkg/shared/utilityUUID"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/shared/utilitySQL"
	"github.com/cmsgov/mint-app/pkg/storage/genericmodel"
)

//go:embed SQL/plan_document_create.sql
var planDocumentCreateSQL string

//go:embed SQL/plan_document_update.sql
var planDocumentUpdateSQL string

//go:embed SQL/plan_document_read_by_id.sql
var planDocumentGetByIDSQL string

//go:embed SQL/plan_document_read_by_model_plan_id.sql
var planDocumentGetByModelPlanIDSQL string

//go:embed SQL/plan_document_delete_by_id.sql
var planDocumentDeleteByIDSQL string

// PlanDocumentCreate creates a plan document
func (s *Store) PlanDocumentCreate(logger *zap.Logger, document *models.PlanDocument) (*models.PlanDocument, error) {
	document.ID = utilityUUID.ValueOrNewUUID(document.ID)

	statement, err := s.db.PrepareNamed(planDocumentCreateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	err = statement.Get(document, document)
	if err != nil {
		return nil, genericmodel.HandleModelCreationError(logger, err, document)
	}

	return document, nil
}

// PlanDocumentRead reads a plan document object by id
func (s *Store) PlanDocumentRead(logger *zap.Logger, id uuid.UUID) (*models.PlanDocument, error) {
	statement, err := s.db.PrepareNamed(planDocumentGetByIDSQL)
	if err != nil {
		return nil, err
	}

	var document models.PlanDocument
	err = statement.Get(&document, utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, id)
	}

	return &document, nil
}

// PlanDocumentReadByModelPlanID reads a plan document object by model plan id
func (s *Store) PlanDocumentReadByModelPlanID(logger *zap.Logger, modelPlanID uuid.UUID) (*models.PlanDocument, error) {
	statement, err := s.db.PrepareNamed(planDocumentGetByModelPlanIDSQL)
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, modelPlanID)
	}

	var document models.PlanDocument
	err = statement.Get(&document, utilitySQL.CreateModelPlanIDQueryMap(modelPlanID))
	if err != nil {
		return nil, genericmodel.HandleModelFetchByIDError(logger, err, modelPlanID)
	}

	return &document, nil
}

// PlanDocumentUpdate updates a plan document object by id with provided values
func (s *Store) PlanDocumentUpdate(logger *zap.Logger, plan *models.PlanDocument) (*models.PlanDocument, error) {
	statement, err := s.db.PrepareNamed(planDocumentUpdateSQL)
	if err != nil {
		return nil, genericmodel.HandleModelUpdateError(logger, err, plan)
	}

	err = statement.Get(plan, plan)
	if err != nil {
		return nil, genericmodel.HandleModelQueryError(logger, err, plan)
	}

	return plan, nil
}

// PlanDocumentDelete deletes a plan document object by id
func (s *Store) PlanDocumentDelete(logger *zap.Logger, id uuid.UUID) (sql.Result, error) {
	statement, err := s.db.PrepareNamed(planDocumentDeleteByIDSQL)
	if err != nil {
		return nil, err
	}

	sqlResult, err := statement.Exec(utilitySQL.CreateIDQueryMap(id))
	if err != nil {
		return nil, genericmodel.HandleModelDeleteByIDError(logger, err, id)
	}

	return sqlResult, nil
}
