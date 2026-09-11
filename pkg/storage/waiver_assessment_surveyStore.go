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

// WaiverAssessmentSurveyCreate creates a new waiver assessment survey
func WaiverAssessmentSurveyCreate(np sqlutils.NamedPreparer, _ *zap.Logger, survey *models.WaiverAssessmentSurvey) (*models.WaiverAssessmentSurvey, error) {
	survey.ID = utilityuuid.ValueOrNewUUID(survey.ID)
	return sqlutils.GetProcedure[models.WaiverAssessmentSurvey](np, sqlqueries.WaiverAssessmentSurvey.Create, survey)
}

// WaiverAssessmentSurveyGetByID returns the waiver assessment survey for a given id
func WaiverAssessmentSurveyGetByID(np sqlutils.NamedPreparer, _ *zap.Logger, id uuid.UUID) (*models.WaiverAssessmentSurvey, error) {
	return sqlutils.GetProcedure[models.WaiverAssessmentSurvey](np, sqlqueries.WaiverAssessmentSurvey.GetByID, utilitysql.CreateIDQueryMap(id))
}

// WaiverAssessmentSurveyUpdate updates the waiver assessment survey for a given id
func WaiverAssessmentSurveyUpdate(np sqlutils.NamedPreparer, _ *zap.Logger, survey *models.WaiverAssessmentSurvey) (*models.WaiverAssessmentSurvey, error) {
	return sqlutils.GetProcedure[models.WaiverAssessmentSurvey](np, sqlqueries.WaiverAssessmentSurvey.Update, survey)
}

// WaiverAssessmentSurveyGetByModelPlanIDLoader returns the waiver assessment surveys for a slice of model plan ids
func WaiverAssessmentSurveyGetByModelPlanIDLoader(np sqlutils.NamedPreparer, _ *zap.Logger, modelPlanIDs []uuid.UUID) ([]*models.WaiverAssessmentSurvey, error) {
	args := map[string]interface{}{
		"model_plan_ids": pq.Array(modelPlanIDs),
	}

	res, err := sqlutils.SelectProcedure[models.WaiverAssessmentSurvey](np, sqlqueries.WaiverAssessmentSurvey.GetByModelPlanIDLoader, args)
	if err != nil {
		return nil, err
	}
	return res, nil
}
