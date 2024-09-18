package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// AuditChangeCollectionByIDAndTable returns changes based on tablename and primary key
func AuditChangeCollectionByIDAndTable(logger *zap.Logger, tableName models.TableName, primaryKey uuid.UUID, store *storage.Store) ([]*models.AuditChange, error) {
	return store.AuditChangeCollectionByIDAndTable(logger, tableName, primaryKey)
}
