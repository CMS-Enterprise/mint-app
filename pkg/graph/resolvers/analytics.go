package resolvers

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

/*
Analytics is the resolver for the analytics query.
It returns the changes per model, changes per model by section, changes per model other data,
models by status, number of followers per model, and total number of models.
*/
func Analytics(ctx context.Context, store *storage.Store, logger *zap.Logger) (*models.AnalyticsSummary, error) {

	analyticsSummary, err := sqlutils.WithTransaction[models.AnalyticsSummary](
		store,
		func(tx *sqlx.Tx) (*models.AnalyticsSummary, error) {

			// Get changes per model
			changesPerModel, err := storage.GetChangesPerModelLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get changes per model: %w", err)
			}

			// Get changes per model by section
			changesPerModelBySection, err := storage.GetChangesPerModelBySectionLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get changes per model by section: %w", err)
			}

			// Get changes per model other data
			changesPerModelOtherData, err := storage.GetChangesPerModelOtherDataLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get changes per model other data: %w", err)
			}

			// Get models by status
			modelsByStatus, err := storage.GetModelsByStatusLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get models by status: %w", err)
			}

			// Get number of followers per model
			numberOfFollowersPerModel, err := storage.GetNumberOfFollowersPerModelLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get number of followers per model: %w", err)
			}

			// Get total number of models
			totalNumberOfModels, err := storage.GetTotalNumberOfModelsLoader(tx, logger)
			if err != nil {
				return nil, fmt.Errorf("failed to get total number of models: %w", err)
			}

			// Check if we have results before accessing the first element
			if len(totalNumberOfModels) == 0 {
				return nil, fmt.Errorf("no total number of models data available")
			}

			// Create analytics summary
			analyticsSummary := &models.AnalyticsSummary{
				ChangesPerModel:           changesPerModel,
				ChangesPerModelBySection:  changesPerModelBySection,
				ChangesPerModelOtherData:  changesPerModelOtherData,
				ModelsByStatus:            modelsByStatus,
				NumberOfFollowersPerModel: numberOfFollowersPerModel,
				TotalNumberOfModels:       totalNumberOfModels[0],
			}

			return analyticsSummary, nil
		})

	return analyticsSummary, err
}
