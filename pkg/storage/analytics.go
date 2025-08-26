package storage

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"go.uber.org/zap"
)

func GetNumberOfFollowersPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelFollowersAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelFollowersAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.NumberOfFollowersPerModel); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelFollowersAnalytics](np, sqlqueries.NumberOfFollowersPerModel, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetTotalNumberOfModelsLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelCountAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelCountAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.NumberOfModels); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelCountAnalytics](np, sqlqueries.NumberOfModels, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelChangesAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.ChangesPerModel); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelChangesAnalytics](np, sqlqueries.ChangesPerModel, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelBySectionLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesBySectionAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelChangesBySectionAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.ChangesPerModelBySection); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelChangesBySectionAnalytics](np, sqlqueries.ChangesPerModelBySection, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetChangesPerModelOtherDataLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesOtherDataAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelChangesOtherDataAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.ChangesPerModelOtherData); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelChangesOtherDataAnalytics](np, sqlqueries.ChangesPerModelOtherData, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetModelsByStatusLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelsByStatusAnalytics, error) {
	// Since there are no named parameters, use the transaction's Select method directly
	// to avoid SQLx named statement processing issues
	var results []*models.ModelsByStatusAnalytics

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, sqlqueries.ModelsByStatus); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[models.ModelsByStatusAnalytics](np, sqlqueries.ModelsByStatus, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}
