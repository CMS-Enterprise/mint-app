package models

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// CTATRequest represents a request for CTAT assistance.
type CTATRequest struct {
	baseStruct

	Requester  uuid.UUID  `json:"requester" db:"requester"`
	Status     CTATStatus `json:"status" db:"status"`
	Notes      *string    `json:"notes,omitempty" db:"notes"`
	Resolution *string    `json:"resolution,omitempty" db:"resolution"`

	AssignedAdmin *uuid.UUID `json:"assignedAdmin,omitempty" db:"assigned_admin"`

	CmmiGroup         CTATCMMIGroupOption     `json:"cmmiGroup" db:"cmmi_group"`
	CmmiGroupOther    *string                 `json:"cmmiGroupOther,omitempty" db:"cmmi_group_other"`
	CmmiDivision      *CTATCMMIDivisionOption `json:"cmmiDivision,omitempty" db:"cmmi_division"`
	CmmiDivisionOther *string                 `json:"cmmiDivisionOther,omitempty" db:"cmmi_division_other"`

	RelatedMINTModels []uuid.UUID `json:"relatedMINTModels,omitempty" db:"-"`

	ContractActivityType      *CTATContractActivityType `json:"contractActivityType,omitempty" db:"contract_activity_type"`
	ContractActivityTypeOther *string                   `json:"contractActivityTypeOther,omitempty" db:"contract_activity_type_other"`
	ContractName              *string                   `json:"contractName,omitempty" db:"contract_name"`
	ContractNumber            *string                   `json:"contractNumber,omitempty" db:"contract_number"`
	ContractType              *CTATContractType         `json:"contractType,omitempty" db:"contract_type"`
	ContractTypeOther         *string                   `json:"contractTypeOther,omitempty" db:"contract_type_other"`

	TypeOfHelpNeeded       EnumArray[CTATHelpNeededType] `json:"typeOfHelpNeeded" db:"type_of_help_needed"`
	TypeOfHelpNeededOther  *string                       `json:"typeOfHelpNeededOther,omitempty" db:"type_of_help_needed_other"`
	DescribeHelpNeeded     string                        `json:"describeHelpNeeded" db:"describe_help_needed"`
	RequestUrgency         CTATRequestUrgency            `json:"requestUrgency" db:"request_urgency"`
	DateAssistanceNeededBy time.Time                     `json:"dateAssistanceNeededBy" db:"date_assistance_needed_by"`

	SupportingDocuments []*CTATRequestDocument `json:"supportingDocuments,omitempty" db:"-"`

	HumanReadableIDNumber int `json:"humanReadableIDNumber" db:"human_readable_id_number"`
}

// ctatRequestHumanReadableIDPrefix is the only currently available prefix
const ctatRequestHumanReadableIDPrefix = "CTAT"

// HumanReadableID composes the display ID from the fixed CTAT prefix and stored numeric suffix.
func (c *CTATRequest) HumanReadableID() string {
	if c == nil || c.HumanReadableIDNumber == 0 {
		// really shouldn't be possible with the data type in the DB, but will guard for safety
		return "CTAT-000"
	}

	// pad number to force number minimum width of 3 (i.e., `25` becomes `025`, but `1000` remains `1000`)
	return fmt.Sprintf("%s-%03d", ctatRequestHumanReadableIDPrefix, c.HumanReadableIDNumber)
}

func (c *CTATRequest) RequesterUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	if c == nil || c.Requester == uuid.Nil {
		return nil, nil
	}

	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, err
	}

	return service(ctx, c.Requester)
}

func (c *CTATRequest) AssignedAdminUserAccount(ctx context.Context) (*authentication.UserAccount, error) {
	if c == nil || c.AssignedAdmin == nil {
		return nil, nil
	}

	service, err := appcontext.UserAccountService(ctx)
	if err != nil {
		return nil, err
	}

	return service(ctx, *c.AssignedAdmin)
}
