package resolvers

import (
	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//NDAAgreementGetByEUA returns an EUA agreement by eua
func NDAAgreementGetByEUA(logger *zap.Logger, euaID string, store *storage.Store) (*models.NDAAgreement, error) {
	nda, err := store.NDAAgreementGetByEUA(logger, euaID)
	if err != nil {
		return nil, err
	}
	return nda, err

}

//NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func NDAAgreementUpdateOrCreate(logger *zap.Logger, changes map[string]interface{}, principal authentication.Principal, store *storage.Store) (*models.NDAAgreement, error) {
	existing, err := store.NDAAgreementGetByEUA(logger, changes["userID"].(string))
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = &models.NDAAgreement{}
		existing.CreatedBy = principal.ID()
	}

	err = BaseStructPreUpdate(existing, changes, principal.ID()) //TODO refactor to use the changes for collab based access control
	if err != nil {
		return nil, err
	}

	if existing.ID == uuid.Nil {
		// if existing == nil {
		// nda := &models.NDAAgreement{
		// 	BaseStruct: models.BaseStruct{
		// 		// ID: ut
		// 	},
		// }
		logger.Info("nda", zap.Any("nda", existing))

		return store.NDAAgreementCreate(logger, existing)

	}

	return store.NDAAgreementUpdate(logger, existing)

}
