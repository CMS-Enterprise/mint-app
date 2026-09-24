package storage

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/utilitysql"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// ReadyForClearanceGetByModelPlanID reads information about a model plan's clearance
func (s *Store) ReadyForClearanceGetByModelPlanID(
	logger *zap.Logger,
	modelPlanID uuid.UUID,
) (*models.PrepareForClearanceResponse, error) {
	return ReadyForClearanceGetByModelPlanIDNP(s, logger, modelPlanID)
}

// ReadyForClearanceGetByModelPlanIDNP reads clearance aggregate data for a model plan.
func ReadyForClearanceGetByModelPlanIDNP(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
) (*models.PrepareForClearanceResponse, error) {
	return sqlutils.GetProcedure[models.PrepareForClearanceResponse](
		np,
		sqlqueries.PrepareForClearance.GetByModelPlanID,
		utilitysql.CreateModelPlanIDQueryMap(modelPlanID),
	)
}

// ClearReadyForClearanceByModelPlanID clears ready-for-clearance status on all task-list sections
// for a model plan.
func ClearReadyForClearanceByModelPlanID(
	np sqlutils.NamedPreparer,
	_ *zap.Logger,
	modelPlanID uuid.UUID,
	modifiedBy uuid.UUID,
) error {
	args := map[string]interface{}{
		"model_plan_id": modelPlanID,
		"modified_by":   modifiedBy,
	}

	clearQueries := []string{
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanBasics,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanGeneralCharacteristics,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanParticipantsAndProviders,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanBeneficiaries,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanOpsEvalAndLearning,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanPayments,
		sqlqueries.PrepareForClearance.ClearReadyForClearancePlanTimeline,
	}

	for _, query := range clearQueries {
		if err := sqlutils.ExecProcedure(np, query, args); err != nil {
			return err
		}
	}

	return nil
}
