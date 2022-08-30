package resolvers

import (
	"time"

	"github.com/google/uuid"
	"go.uber.org/zap"

	"github.com/cmsgov/mint-app/pkg/authentication"
	"github.com/cmsgov/mint-app/pkg/graph/model"
	"github.com/cmsgov/mint-app/pkg/models"
	"github.com/cmsgov/mint-app/pkg/storage"
)

//NDAAgreementGetByEUA returns an EUA agreement by eua
func NDAAgreementGetByEUA(logger *zap.Logger, principal authentication.Principal, store *storage.Store) (*model.NDAInfo, error) {
	nda, err := store.NDAAgreementGetByEUA(logger, principal.ID())
	info := model.NDAInfo{}
	if err != nil {
		return nil, err
	}
	if nda == nil {
		info.Agreed = false
	} else {
		info.Agreed = nda.Agreed
		info.AgreedDts = nda.AgreedDts
	}

	return &info, err

}

//NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func NDAAgreementUpdateOrCreate(logger *zap.Logger, agree bool, principal authentication.Principal, store *storage.Store) (*model.NDAInfo, error) {
	existing, err := store.NDAAgreementGetByEUA(logger, principal.ID())
	if err != nil {
		return nil, err
	}
	if existing == nil {
		existing = &models.NDAAgreement{}
		existing.CreatedBy = principal.ID()
		existing.UserID = principal.ID()
	} else {
		existing.ModifiedBy = models.StringPointer(principal.ID())
	}

	if !existing.Agreed && agree { //If not currently agreed, set agreeDts to now
		now := time.Now()
		existing.AgreedDts = &now
	}
	existing.Agreed = agree
	info := model.NDAInfo{}

	if existing.ID == uuid.Nil {

		new, err2 := store.NDAAgreementCreate(logger, existing)
		if err2 != nil {
			return nil, err2
		}
		info.Agreed = new.Agreed
		info.AgreedDts = new.AgreedDts

	} else {

		existing.ModifiedBy = models.StringPointer(principal.ID())
		update, err3 := store.NDAAgreementUpdate(logger, existing)
		if err3 != nil {
			return nil, err3
		}
		info.Agreed = update.Agreed
		info.AgreedDts = update.AgreedDts

	}

	return &info, err

}
