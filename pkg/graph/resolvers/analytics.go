package resolvers

import (
	"context"
	"fmt"
	"runtime/debug"

	"github.com/jmoiron/sqlx"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/sqlutils"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// Analytics is the resolver for the analytics query
func Analytics(ctx context.Context, store *storage.Store, logger *zap.Logger) (*models.AnalyticsSummary, error) {
	// Check if store is properly initialized
	if store == nil {
		logger.Error("Store is nil")
		return nil, fmt.Errorf("database store is not available")
	}

	// Check if logger is nil to prevent nil pointer dereference
	if logger == nil {
		return nil, fmt.Errorf("logger is not available")
	}

	// Check if the store has a valid database connection by testing a simple query
	if _, err := store.PrepareNamed("SELECT 1"); err != nil {
		logger.Error("Database connection test failed", zap.Error(err))
		return nil, fmt.Errorf("database connection test failed: %w", err)
	}
	logger.Info("Database connection test successful")

	logger.Info("Starting analytics query", zap.String("storeType", fmt.Sprintf("%T", store)))

	analyticsSummary, err := sqlutils.WithTransaction[models.AnalyticsSummary](
		store,
		func(tx *sqlx.Tx) (*models.AnalyticsSummary, error) {
			// Capture logger in closure to avoid scope issues
			log := logger

			// Add panic recovery to catch any unexpected panics
			defer func() {
				if r := recover(); r != nil {
					if log != nil {
						log.Error("Panic recovered in analytics transaction", zap.Any("panic", r))
						// Log the stack trace to help diagnose the issue
						log.Error("Panic stack trace", zap.String("stack", string(debug.Stack())))
					}
				}
			}()

			if tx == nil {
				if log != nil {
					log.Error("Transaction is nil")
				}
				return nil, fmt.Errorf("database transaction is nil")
			}
			if log != nil {
				log.Info("Transaction started successfully")
			}

			// Test the transaction by executing a simple query to ensure it's working
			var testResult int
			if err := tx.Get(&testResult, "SELECT 1"); err != nil {
				if log != nil {
					log.Error("Transaction test query failed", zap.Error(err))
				}
				return nil, fmt.Errorf("transaction test failed: %w", err)
			}
			if log != nil {
				log.Info("Transaction test query successful", zap.Int("result", testResult))
			}

			// Get changes per model
			changesPerModel, err := storage.GetChangesPerModelLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get changes per model", zap.Error(err))
					log.Error("Error details", zap.String("errorType", fmt.Sprintf("%T", err)))
				}
				// Check if it's a table not found error
				if err.Error() == "pq: relation \"model_plan\" does not exist" {
					return nil, fmt.Errorf("required database table 'model_plan' does not exist: %w", err)
				}
				if err.Error() == "pq: relation \"translated_audit\" does not exist" {
					return nil, fmt.Errorf("required database table 'translated_audit' does not exist: %w", err)
				}
				return nil, fmt.Errorf("failed to get changes per model: %w", err)
			}
			if changesPerModel == nil {
				if log != nil {
					log.Info("Changes per model is nil, initializing empty slice")
				}
				changesPerModel = []*models.ModelChangesAnalytics{}
			}
			if log != nil {
				log.Info("Successfully retrieved changes per model", zap.Int("count", len(changesPerModel)))
			}

			// Get changes per model by section
			changesPerModelBySection, err := storage.GetChangesPerModelBySectionLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get changes per model by section", zap.Error(err))
				}
				return nil, fmt.Errorf("failed to get changes per model by section: %w", err)
			}
			if changesPerModelBySection == nil {
				if log != nil {
					log.Info("Changes per model by section is nil, initializing empty slice")
				}
				changesPerModelBySection = []*models.ModelChangesBySectionAnalytics{}
			}
			if log != nil {
				log.Info("Successfully retrieved changes per model by section", zap.Int("count", len(changesPerModelBySection)))
			}

			// Get changes per model other data
			changesPerModelOtherData, err := storage.GetChangesPerModelOtherDataLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get changes per model other data", zap.Error(err))
				}
				return nil, fmt.Errorf("failed to get changes per model other data: %w", err)
			}
			if changesPerModelOtherData == nil {
				if log != nil {
					log.Info("Changes per model other data is nil, initializing empty slice")
				}
				changesPerModelOtherData = []*models.ModelChangesOtherDataAnalytics{}
			}
			if log != nil {
				log.Info("Successfully retrieved changes per model other data", zap.Int("count", len(changesPerModelOtherData)))
			}

			// Get models by status
			modelsByStatus, err := storage.GetModelsByStatusLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get models by status", zap.Error(err))
				}
				return nil, fmt.Errorf("failed to get models by status: %w", err)
			}
			if modelsByStatus == nil {
				if log != nil {
					log.Info("Models by status is nil, initializing empty slice")
				}
				modelsByStatus = []*models.ModelsByStatusAnalytics{}
			}
			if log != nil {
				log.Info("Successfully retrieved models by status", zap.Int("count", len(modelsByStatus)))
			}

			// Get number of followers per model
			numberOfFollowersPerModel, err := storage.GetNumberOfFollowersPerModelLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get number of followers per model", zap.Error(err))
				}
				return nil, fmt.Errorf("failed to get number of followers per model: %w", err)
			}
			if numberOfFollowersPerModel == nil {
				if log != nil {
					log.Info("Number of followers per model is nil, initializing empty slice")
				}
				numberOfFollowersPerModel = []*models.ModelFollowersAnalytics{}
			}
			if log != nil {
				log.Info("Successfully retrieved number of followers per model", zap.Int("count", len(numberOfFollowersPerModel)))
			}

			// Get total number of models
			if log != nil {
				log.Info("Starting to get total number of models")
			}
			totalNumberOfModels, err := storage.GetTotalNumberOfModelsLoader(tx, log)
			if err != nil {
				if log != nil {
					log.Error("Failed to get total number of models", zap.Error(err))
					// Log the specific error type to help diagnose the issue
					log.Error("Error details", zap.String("errorType", fmt.Sprintf("%T", err)))
				}
				// Check if it's a table not found error
				if err.Error() == "pq: relation \"model_plan\" does not exist" {
					return nil, fmt.Errorf("required database table 'model_plan' does not exist: %w", err)
				}
				// Check if it's a connection error
				if err.Error() == "pq: connection to server was lost" {
					return nil, fmt.Errorf("database connection lost: %w", err)
				}
				// Check if it's a permission error
				if err.Error() == "pq: permission denied for table model_plan" {
					return nil, fmt.Errorf("insufficient database permissions: %w", err)
				}
				return nil, fmt.Errorf("failed to get total number of models: %w", err)
			}
			if log != nil {
				log.Info("Total number of models query completed", zap.Int("resultCount", len(totalNumberOfModels)))
			}

			// Check if we have results before accessing the first element
			if len(totalNumberOfModels) == 0 {
				if log != nil {
					log.Error("Total number of models returned empty result set")
				}
				return nil, fmt.Errorf("no total number of models data available")
			}

			if log != nil {
				log.Info("Creating analytics summary with all data")
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

			if log != nil {
				log.Info("Analytics summary created successfully")
			}
			return analyticsSummary, nil
		})

	return analyticsSummary, err
}
