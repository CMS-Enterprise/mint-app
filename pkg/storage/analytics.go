package storage

import (
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"go.uber.org/zap"
)

func GetTotalNumberOfModelsLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelCountAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelCountAnalytics](np, sqlqueries.NumberOfModels, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelChangesAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelChangesAnalytics](np, sqlqueries.ChangesPerModel, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelBySectionLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelChangesBySectionAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelChangesBySectionAnalytics](np, sqlqueries.ChangesPerModelBySection, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelOtherDataLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelChangesOtherDataAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelChangesOtherDataAnalytics](np, sqlqueries.ChangesPerModelOtherData, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetModelsByStatusLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelsByStatusAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelsByStatusAnalytics](np, sqlqueries.ModelsByStatus, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetNumberOfFollowersPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*model.ModelFollowersAnalytics, error) {
	returned, err := sqlutils.SelectProcedure[model.ModelFollowersAnalytics](np, sqlqueries.NumberOfFollowersPerModel, nil)
	if err != nil {
		return nil, err
	}
	return returned, nil
}
