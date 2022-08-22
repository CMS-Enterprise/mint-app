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
		accepted.Accepted = false
	} else {
		accepted.Accepted = nda.Accepted
		accepted.AcceptedDts = nda.AcceptedDts
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

	if !existing.Accepted && accept { //If not currently accepted, set acceptedDts to now
		now := time.Now()
		existing.AcceptedDts = &now
	}
	existing.Accepted = accept
	accepted := model.NDAInfo{}

	if existing.ID == uuid.Nil {

		new, err2 := store.NDAAgreementCreate(logger, existing)
		if err2 != nil {
			return nil, err2
		}
		accepted.Accepted = new.Accepted
		accepted.AcceptedDts = new.AcceptedDts

	} else {

		existing.ModifiedBy = models.StringPointer(principal.ID())
		update, err3 := store.NDAAgreementUpdate(logger, existing)
		if err3 != nil {
			return nil, err3
		}
		accepted.Accepted = update.Accepted
		accepted.AcceptedDts = update.AcceptedDts

	}

	return &accepted, err

}
