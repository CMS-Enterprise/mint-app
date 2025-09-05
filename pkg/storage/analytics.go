package storage

import (
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlqueries"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
)

// AnalyticsType constraint ensures T is one of the analytics struct types
type AnalyticsType interface {
	models.ModelFollowersAnalytics |
		models.ModelCountAnalytics |
		models.ModelChangesAnalytics |
		models.ModelChangesBySectionAnalytics |
		models.ModelChangesOtherDataAnalytics |
		models.ModelsByStatusAnalytics
}

// genericAnalyticsLoader is a generic function that handles the common pattern
// for loading analytics data with transaction type checking and fallback logic
func genericAnalyticsLoader[T AnalyticsType](np sqlutils.NamedPreparer, query string) ([]*T, error) {
	var results []*T

	// Check if we can cast to a transaction that has Select method
	if tx, ok := np.(interface {
		Select(dest interface{}, query string, args ...interface{}) error
	}); ok {
		if err := tx.Select(&results, query); err != nil {
			return nil, err
		}
		return results, nil
	}

	// Fallback to SelectProcedure with empty map
	returned, err := sqlutils.SelectProcedure[T](np, query, map[string]interface{}{})
	if err != nil {
		return nil, err
	}
	return returned, nil
}

func GetNumberOfFollowersPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelFollowersAnalytics, error) {
	return genericAnalyticsLoader[models.ModelFollowersAnalytics](np, sqlqueries.NumberOfFollowersPerModel)
}

func GetTotalNumberOfModelsLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelCountAnalytics, error) {
	return genericAnalyticsLoader[models.ModelCountAnalytics](np, sqlqueries.NumberOfModels)
}

func GetChangesPerModelLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesAnalytics, error) {
	return genericAnalyticsLoader[models.ModelChangesAnalytics](np, sqlqueries.ChangesPerModel)
}

func GetChangesPerModelBySectionLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesBySectionAnalytics, error) {
	return genericAnalyticsLoader[models.ModelChangesBySectionAnalytics](np, sqlqueries.ChangesPerModelBySection)
}

func GetChangesPerModelOtherDataLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelChangesOtherDataAnalytics, error) {
	return genericAnalyticsLoader[models.ModelChangesOtherDataAnalytics](np, sqlqueries.ChangesPerModelOtherData)
}

func GetModelsByStatusLoader(np sqlutils.NamedPreparer, _ *zap.Logger) ([]*models.ModelsByStatusAnalytics, error) {
	return genericAnalyticsLoader[models.ModelsByStatusAnalytics](np, sqlqueries.ModelsByStatus)
}
