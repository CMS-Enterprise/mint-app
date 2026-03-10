package models

import (
	"context"
	"fmt"

	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// completedByRelation is a struct meant to be embedded to show that the object has completed_by and completed_dts fields, as well as
// shared logic to get the user account represented by the completed_by uuid
type completedByRelation struct {
	CompletedBy  *uuid.UUID `json:"completedBy" db:"completed_by"`
	CompletedDts *time.Time `json:"completedDts" db:"completed_dts"`
}

// CompletedByUserAccount returns the user account of the user who completed the struct from the DB using the UserAccount service
func (cbr *completedByRelation) CompletedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {

	if cbr.CompletedBy == nil {
		return nil, nil
	}
	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get completed by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, *cbr.CompletedBy)
	if err != nil {
		return nil, err
	}
	return account, nil

}
