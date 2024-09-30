package models

import (
	"context"
	"fmt"

	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// MarkedCompleteByRelation is a struct meant to be embedded to show that the object has marked_complete_by and marked_complete_dts fields, as well as
// shared logic to get the user account represented by the marked_complete_by uuid
type markedCompleteByRelation struct {
	MarkedCompleteBy  uuid.UUID `json:"markedCompleteBy" db:"marked_complete_by"`
	MarkedCompleteDts time.Time `json:"markedCompleteDts" db:"marked_complete_dts"`
}

// MarkedCompleteByUserAccount returns the user account of the user who marked the struct as complete from the DB using the UserAccount service
func (relation *markedCompleteByRelation) MarkedCompleteByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {

	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get marked complete by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, relation.MarkedCompleteBy)
	if err != nil {
		return nil, err
	}
	return account, nil

}
