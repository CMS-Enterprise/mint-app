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
	accepted := model.NDAInfo{}
	if err != nil {
		return nil, err
	}
	if nda == nil {
		accepted.Agreed = false
	} else {
		accepted.Agreed = nda.Agreed
		accepted.AgreedDts = nda.AgreedDts
	}

	return &accepted, err

}

//NDAAgreementUpdateOrCreate either writes an entry to the nda table, or updates an existing one
func NDAAgreementUpdateOrCreate(logger *zap.Logger, accept bool, principal authentication.Principal, store *storage.Store) (*model.NDAInfo, error) {
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

	if !existing.Agreed && accept { //If not currently accepted, set acceptedDts to now
		now := time.Now()
		existing.AgreedDts = &now
	}
	existing.Agreed = accept
	accepted := model.NDAInfo{}

	if existing.ID == uuid.Nil {

		new, err2 := store.NDAAgreementCreate(logger, existing)
		if err2 != nil {
			return nil, err2
		}
		accepted.Agreed = new.Agreed
		accepted.AgreedDts = new.AgreedDts

	} else {

		existing.ModifiedBy = models.StringPointer(principal.ID())
		update, err3 := store.NDAAgreementUpdate(logger, existing)
		if err3 != nil {
			return nil, err3
		}
		accepted.Agreed = update.Agreed
		accepted.AgreedDts = update.AgreedDts

	}

	return &accepted, err

}
