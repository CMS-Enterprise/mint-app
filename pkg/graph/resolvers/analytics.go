package resolvers

import (
	"context"
	"fmt"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// Analytics is the resolver for the analytics query
func Analytics(ctx context.Context, store *storage.Store, logger *zap.Logger) (*model.AnalyticsSummary, error) {
	analyticsSummary, err := sqlutils.WithTransaction[model.AnalyticsSummary](
		store,
		func(tx *sqlx.Tx) (*model.AnalyticsSummary, error) {

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

			// Create analytics summary
			analyticsSummary := &model.AnalyticsSummary{
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

// func getChangesPerModel(ctx context.Context, store *storage.Store) ([]*model.ModelChangesAnalytics, error) {
// 	rows, err := store.DB().QueryContext(ctx, sqlqueries.ChangesPerModel)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to query changes per model: %w", err)
// 	}
// 	defer rows.Close()

// 	var results []*model.ModelChangesAnalytics
// 	for rows.Next() {
// 		var analytics model.ModelChangesAnalytics
// 		err := rows.Scan(
// 			&analytics.ModelName,
// 			&analytics.NumberOfChanges,
// 			&analytics.NumberOfRecordChanges,
// 			&analytics.ModelPlanID,
// 		)
// 		if err != nil {
// 			return nil, fmt.Errorf("failed to scan changes per model row: %w", err)
// 		}
// 		results = append(results, &analytics)
// 	}

// 	if err = rows.Err(); err != nil {
// 		return nil, fmt.Errorf("error iterating changes per model rows: %w", err)
// 	}

// 	return results, nil
// }
// func getChangesPerModelBySection(ctx context.Context, store *storage.Store) ([]*model.ModelChangesBySectionAnalytics, error) {
// 	rows, err := store.DB().QueryContext(ctx, sqlqueries.ChangesPerModelBySection)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to query changes per model by section: %w", err)
// 	}
// 	defer rows.Close()

// 	var results []*model.ModelChangesBySectionAnalytics
// 	for rows.Next() {
// 		var analytics model.ModelChangesBySectionAnalytics
// 		err := rows.Scan(
// 			&analytics.ModelName,
// 			&analytics.TableName,
// 			&analytics.NumberOfChanges,
// 			&analytics.NumberOfRecordChanges,
// 			&analytics.ModelPlanID,
// 		)
// 		if err != nil {
// 			return nil, fmt.Errorf("failed to scan changes per model by section row: %w", err)
// 		}
// 		results = append(results, &analytics)
// 	}

// 	if err = rows.Err(); err != nil {
// 		return nil, fmt.Errorf("error iterating changes per model by section rows: %w", err)
// 	}

// 	return results, nil
// }
// func getChangesPerModelOtherData(ctx context.Context, store *storage.Store) ([]*model.ModelChangesOtherDataAnalytics, error) {
// 	rows, err := store.DB().QueryContext(ctx, sqlqueries.ChangesPerModelOtherData)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to query changes per model other data: %w", err)
// 	}
// 	defer rows.Close()

// 	var results []*model.ModelChangesOtherDataAnalytics
// 	for rows.Next() {
// 		var analytics model.ModelChangesOtherDataAnalytics
// 		err := rows.Scan(
// 			&analytics.ModelName,
// 			&analytics.TableName,
// 			&analytics.NumberOfChanges,
// 			&analytics.NumberOfRecordChanges,
// 			&analytics.Section,
// 			&analytics.ModelPlanID,
// 		)
// 		if err != nil {
// 			return nil, fmt.Errorf("failed to scan changes per model other data row: %w", err)
// 		}
// 		results = append(results, &analytics)
// 	}

// 	if err = rows.Err(); err != nil {
// 		return nil, fmt.Errorf("error iterating changes per model other data rows: %w", err)
// 	}

// 	return results, nil
// }
// func getModelsByStatus(ctx context.Context, store *storage.Store) ([]*model.ModelsByStatusAnalytics, error) {
// 	rows, err := store.DB().QueryContext(ctx, sqlqueries.ModelsByStatus)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to query models by status: %w", err)
// 	}
// 	defer rows.Close()

// 	var results []*model.ModelsByStatusAnalytics
// 	for rows.Next() {
// 		var analytics model.ModelsByStatusAnalytics
// 		err := rows.Scan(
// 			&analytics.Status,
// 			&analytics.NumberOfModels,
// 		)
// 		if err != nil {
// 			return nil, fmt.Errorf("failed to scan models by status row: %w", err)
// 		}
// 		results = append(results, &analytics)
// 	}

// 	if err = rows.Err(); err != nil {
// 		return nil, fmt.Errorf("error iterating models by status rows: %w", err)
// 	}

// 	return results, nil
// }
// func getNumberOfFollowersPerModel(ctx context.Context, store *storage.Store) ([]*model.ModelFollowersAnalytics, error) {
// 	rows, err := store.DB().QueryContext(ctx, sqlqueries.NumberOfFollowersPerModel)
// 	if err != nil {
// 		return nil, fmt.Errorf("failed to query number of followers per model: %w", err)
// 	}
// 	defer rows.Close()

// 	var results []*model.ModelFollowersAnalytics
// 	for rows.Next() {
// 		var analytics model.ModelFollowersAnalytics
// 		err := rows.Scan(
// 			&analytics.ModelName,
// 			&analytics.NumberOfFollowers,
// 			&analytics.ModelPlanID,
// 		)
// 		if err != nil {
// 			return nil, fmt.Errorf("failed to scan number of followers per model row: %w", err)
// 		}
// 		results = append(results, &analytics)
// 	}

// 	if err = rows.Err(); err != nil {
// 		return nil, fmt.Errorf("error iterating number of followers per model rows: %w", err)
// 	}

// 	return results, nil
// }
