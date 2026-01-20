package storage

import (
	_ "embed"

	"github.com/lib/pq"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilityuuid"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// IDDOCQuestionnaireCreate creates a new IDDOC questionnaire
func IDDOCQuestionnaireCreate(np sqlutils.NamedPreparer, _ *zap.Logger, questionnaire *models.IDDOCQuestionnaire) (*models.IDDOCQuestionnaire, error) {
	questionnaire.ID = utilityuuid.ValueOrNewUUID(questionnaire.ID)
	return sqlutils.GetProcedure[models.IDDOCQuestionnaire](np, sqlqueries.IDDOCQuestionnaire.Create, questionnaire)
}

// IDDOCQuestionnaireGetByID returns the IDDOC questionnaire for a given id
func IDDOCQuestionnaireGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.IDDOCQuestionnaire, error) {
	return sqlutils.GetProcedure[models.IDDOCQuestionnaire](np, sqlqueries.IDDOCQuestionnaire.GetByID, utilitysql.CreateIDQueryMap(id))
}

// IDDOCQuestionnaireUpdate updates the IDDOC questionnaire for a given id
func IDDOCQuestionnaireUpdate(np sqlutils.NamedPreparer, logger *zap.Logger, questionnaire *models.IDDOCQuestionnaire) (*models.IDDOCQuestionnaire, error) {
	return sqlutils.GetProcedure[models.IDDOCQuestionnaire](np, sqlqueries.IDDOCQuestionnaire.Update, questionnaire)
}

// IDDOCQuestionnaireGetByModelPlanIDLoader returns the IDDOC questionnaire for a slice of model plan ids
func IDDOCQuestionnaireGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.IDDOCQuestionnaire, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.IDDOCQuestionnaire](np, sqlqueries.IDDOCQuestionnaire.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil
}
