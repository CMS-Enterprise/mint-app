package resolvers

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
	"github.com/cms-enterprise/mint-app/pkg/graph/model"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/storage"
)

// NDAAgreementGetByUserID returns an EUA agreement by eua
func NDAAgreementGetByUserID(logger *zap.Logger, principal authentication.Principal, store *storage.Store) (*model.NDAInfo, error) {
	nda, err := store.NDAAgreementGetByUserID(logger, principal.Account().ID)
	info := model.NDAInfo{}
	if err != nil {
		return nil, err
	}
	if nda == nil {
		info.Agreed = false
	} else {
		info.Agreed = nda.V2Agreed
		info.AgreedDts = nda.V2AgreedDts
	}

	return &info, err

}

// NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func NDAAgreementUpdateOrCreate(logger *zap.Logger, agree bool, principal authentication.Principal, store *storage.Store) (*model.NDAInfo, error) {
	user := principal.Account()
	existing, err := store.NDAAgreementGetByUserID(logger, principal.Account().ID)
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = &models.NDAAgreement{}
		existing.CreatedBy = user.ID
		existing.UserID = user.ID
	} else {
		existing.ModifiedBy = &user.ID
	}

	if !existing.V2Agreed && agree { //If not currently agreed, set agreeDts to now
		now := time.Now()
		existing.V2AgreedDts = &now
	}
	existing.V2Agreed = agree
	info := model.NDAInfo{}

	if existing.ID == uuid.Nil {

		new, err2 := store.NDAAgreementCreate(logger, existing)
		if err2 != nil {
			return nil, err2
		}
		info.Agreed = new.V2Agreed
		info.AgreedDts = new.V2AgreedDts

	} else {

		existing.ModifiedBy = &user.ID
		update, err3 := store.NDAAgreementUpdate(logger, existing)
		if err3 != nil {
			return nil, err3
		}
		info.Agreed = update.V2Agreed
		info.AgreedDts = update.V2AgreedDts

	}

	return &info, err

}
