package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

// CTATRequest represents a request for CTAT assistance.
type CTATRequest struct {
	baseStruct

	Requester  uuid.UUID  `json:"requester" db:"requester"`
	Status     CTATStatus `json:"status" db:"status"`
	Notes      *string    `json:"notes,omitempty" db:"notes"`
	Resolution *string    `json:"resolution,omitempty" db:"resolution"`

	AssignedAdminID *uuid.UUID `json:"-" db:"assigned_admin"`
	AssignedAdmin   *UserInfo  `json:"assignedAdmin,omitempty" db:"-"`

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

	HumanReadableIDNumber int `json:"-" db:"human_readable_id_number"`
}

const ctatRequestHumanReadableIDPrefix = "CTAT"

// HumanReadableID composes the display ID from the fixed CTAT prefix and stored numeric suffix.
func (c *CTATRequest) HumanReadableID() string {
	if c == nil || c.HumanReadableIDNumber == 0 {
		return ""
	}

	return fmt.Sprintf("%s-%d", ctatRequestHumanReadableIDPrefix, c.HumanReadableIDNumber)
}
