package models

import (
	"context"
	"fmt"

	"time"

	"github.com/google/uuid"

	"github.com/cmsgov/mint-app/pkg/appcontext"
	"github.com/cmsgov/mint-app/pkg/authentication"
)

// modifiedByRelation is a struct meant to be embedded to show that the object has created_by and created_dts fields, as well as
// shared logic to get the user account represented by the created_by uuid
type modifiedByRelation struct {
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}

// ModifiedByUserAccount returns the user account of the user who created the struct from the DB using the UserAccount service
func (mbr *modifiedByRelation) ModifiedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {

	if mbr.ModifiedBy == nil {
		return nil, nil
	}
	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get modified by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, *mbr.ModifiedBy)
	if err != nil {
		return nil, err
	}
	return account, nil

}
