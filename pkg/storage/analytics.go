package storage

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"go.uber.org/zap"
)

// func GetTotalNumberOfModelsLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelCountAnalytics, error) {
// 	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
// 	returned, err := sqlutils.SelectProcedure[models.ModelCountAnalytics](np, sqlqueries.NumberOfModels, map[string]interface{}{})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return returned, nil
// }

func GetChangesPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesAnalytics, error) {
	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
	returned, err := sqlutils.SelectProcedure[models.ModelChangesAnalytics](np, sqlqueries.ChangesPerModel, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

// func GetChangesPerModelBySectionLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesBySectionAnalytics, error) {
// 	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
// 	returned, err := sqlutils.SelectProcedure[models.ModelChangesBySectionAnalytics](np, sqlqueries.ChangesPerModelBySection, map[string]interface{}{})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return returned, nil
// }

// func GetChangesPerModelOtherDataLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesOtherDataAnalytics, error) {
// 	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
// 	returned, err := sqlutils.SelectProcedure[models.ModelChangesOtherDataAnalytics](np, sqlqueries.ChangesPerModelOtherData, map[string]interface{}{})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return returned, nil
// }

// func GetModelsByStatusLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelsByStatusAnalytics, error) {
// 	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
// 	returned, err := sqlutils.SelectProcedure[models.ModelsByStatusAnalytics](np, sqlqueries.ModelsByStatus, map[string]interface{}{})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return returned, nil
// }

// func GetNumberOfFollowersPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelFollowersAnalytics, error) {
// 	// Pass empty map instead of nil to avoid nil pointer dereference in SQLx
// 	returned, err := sqlutils.SelectProcedure[models.ModelFollowersAnalytics](np, sqlqueries.NumberOfFollowersPerModel, map[string]interface{}{})
// 	if err != nil {
// 		return nil, err
// 	}
// 	return returned, nil
// }
