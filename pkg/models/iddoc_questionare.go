package models

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// IDDOCQuestionare represents the IDDOC questionnaire for a model plan
type IDDOCQuestionare struct {
	baseStruct
	modelPlanRelation

	Needed       bool       `json:"needed" db:"needed"`
	CompletedBy  *uuid.UUID `json:"completedBy" db:"completed_by"`
	CompletedDts *time.Time `json:"completedDts" db:"completed_dts"`
}

// NewIDDOCQuestionare returns a new IDDOCQuestionare object
func NewIDDOCQuestionare(createdBy uuid.UUID, modelPlanID uuid.UUID) *IDDOCQuestionare {
	return &IDDOCQuestionare{
		baseStruct:        NewBaseStruct(createdBy),
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		Needed:            false, // Default to false
	}
}

// CompletedByUserAccount returns the user account for the user who completed the questionnaire
func (iddoc *IDDOCQuestionare) CompletedByUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	if iddoc.CompletedBy == nil {
		return nil, nil
	}

	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, fmt.Errorf("unable to get completed by user account, there is an issue with the user account service. err %w", err)
	}
	account, err := service(ctx, *iddoc.CompletedBy)
	if err != nil {
		return nil, err
	}
	return account, nil
}
