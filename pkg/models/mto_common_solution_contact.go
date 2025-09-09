package models

import (
	"fmt"
	"strings"

	"github.com/google/uuid"
	"github.com/samber/lo"
)

// MTOCommonSolutionContactInformation is a wrapper method that enables efficient fetching and sorting of MTOCommonSolutionContact information
type MTOCommonSolutionContactInformation struct {
	PointsOfContact []*MTOCommonSolutionContact `json:"pointsOfContact"`
}

func (mtoCSC *MTOCommonSolutionContactInformation) PrimaryContact() (*MTOCommonSolutionContact, error) {
	if mtoCSC == nil {
		return nil, fmt.Errorf("contact information is not populated as expected")
	}
	if len(mtoCSC.PointsOfContact) < 1 {
		return nil, fmt.Errorf("points of contact are not listed for this solution")
	}
	contact, found := lo.Find(mtoCSC.PointsOfContact, func(contact *MTOCommonSolutionContact) bool {
		return contact.IsPrimary
	})
	if !found {
		return nil, fmt.Errorf("there was no primary contact found for this point of contact")
	}
	return contact, nil

}

func (mtoCSC *MTOCommonSolutionContactInformation) EmailAddresses(sendToTaggedPOCs bool, devTeamEmail string) ([]string, error) {
	var pocEmailAddress []string
	if mtoCSC == nil {
		return nil, fmt.Errorf("contact information is not populated as expected")
	}
	pocs := mtoCSC.PointsOfContact
	if sendToTaggedPOCs { //send to the pocs
		pocEmailAddress = lo.Map(pocs, func(poc *MTOCommonSolutionContact, _ int) string {
			return poc.Email
		})
	} else {
		devEmailusername, devEmailDomain, emailValid := strings.Cut(devTeamEmail, "@")
		if !emailValid {
			return nil, fmt.Errorf("dev team email format is invalid, unable to send mock solution POC emails. Expected email to only have @ symbol, email :%s", devTeamEmail)
		}
		pocEmailAddress = lo.Map(pocs, func(poc *MTOCommonSolutionContact, _ int) string {
			// this takes advantage of the fact that you can append extra information after the + sign to send to an email address with extra info.
			noSpaceName := strings.ReplaceAll(poc.Name, " ", "")
			return devEmailusername + "+" + noSpaceName + "@" + devEmailDomain
		})

	}
	return pocEmailAddress, nil
}

type MTOCommonSolutionContact struct {
	baseStruct
	Key            MTOCommonSolutionKey `json:"key" db:"mto_common_solution_key"`
	MailboxTitle   *string              `db:"mailbox_title" json:"mailboxTitle"`
	MailboxAddress *string              `db:"mailbox_address" json:"mailboxAddress"`
	// These are convenience fields, they are not stored in the database, they are sourced from user account
	Name  string `db:"name" json:"name"`
	Email string `db:"email" json:"email"`
	// -----------------------------------------------------------------------------------------------------
	userIDRelationPtr
	IsTeam        bool    `db:"is_team" json:"isTeam"`
	Role          *string `db:"role" json:"role"`
	IsPrimary     bool    `db:"is_primary" json:"isPrimary"`
	ReceiveEmails bool    `db:"receive_emails" json:"receiveEmails"`
}

// NewMTOCommonSolutionContact returns a new MTOCommonSolutionContact object
func NewMTOCommonSolutionContact(
	createdBy uuid.UUID,
	key MTOCommonSolutionKey,
	mailboxTitle *string,
	mailboxAddress *string,
	userID *uuid.UUID,
	isTeam bool,
	role *string,
	isPrimary bool,
	receiveEmails bool,
) *MTOCommonSolutionContact {
	return &MTOCommonSolutionContact{
		baseStruct:        NewBaseStruct(createdBy),
		Key:               key,
		MailboxTitle:      mailboxTitle,
		MailboxAddress:    mailboxAddress,
		userIDRelationPtr: NewUserIDRelationPtr(userID),
		IsTeam:            isTeam,
		Role:              role,
		IsPrimary:         isPrimary,
		ReceiveEmails:     receiveEmails,
	}
}

// NewMtoTemplateCategory returns a new MtoTemplateCategory object
func NewMtoTemplateCategory(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	name string,
	parentID *uuid.UUID,
	order int,
) *MtoTemplateCategory {
	return &MtoTemplateCategory{
		baseStruct: NewBaseStruct(createdBy),
		TemplateID: templateID,
		Name:       name,
		ParentID:   parentID,
		Order:      order,
	}
}

// NewMtoTemplateMilestone returns a new MtoTemplateMilestone object
func NewMtoTemplateMilestone(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonMilestoneKey string,
	mtoTemplateCategoryID *uuid.UUID,
) *MtoTemplateMilestone {
	return &MtoTemplateMilestone{
		baseStruct:            NewBaseStruct(createdBy),
		TemplateID:            templateID,
		MtoCommonMilestoneKey: mtoCommonMilestoneKey,
		MtoTemplateCategoryID: mtoTemplateCategoryID,
	}
}

// NewMtoTemplateSolution returns a new MtoTemplateSolution object
func NewMtoTemplateSolution(
	createdBy uuid.UUID,
	templateID uuid.UUID,
	mtoCommonSolutionID uuid.UUID,
) *MtoTemplateSolution {
	return &MtoTemplateSolution{
		baseStruct:          NewBaseStruct(createdBy),
		TemplateID:          templateID,
		MtoCommonSolutionID: mtoCommonSolutionID,
	}
}
