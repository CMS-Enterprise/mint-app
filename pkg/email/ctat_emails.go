package email

import (
	"context"
	_ "embed"
	"errors"
	"fmt"
	"slices"
	"strings"

	"github.com/google/uuid"
	"github.com/samber/lo"

	"github.com/cms-enterprise/mint-app/pkg/appcontext"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"
)

// CTATSubmittedTemplateName is the template name for the CTAT submitted email.
const CTATSubmittedTemplateName string = "ctat_submitted"

// CTATSubmittedAdminTemplateName is the template name for the CTAT submitted admin email.
const CTATSubmittedAdminTemplateName string = "ctat_submitted_admin"

// CTATUpdateTemplateName is the template name for the CTAT update email.
const CTATUpdateTemplateName string = "ctat_update"

// CTATUpdateAdminTemplateName is the template name for the CTAT update admin email.
const CTATUpdateAdminTemplateName string = "ctat_update_admin"

//go:embed templates/ctat_submitted_body.html
var ctatSubmittedBodyTemplate string

//go:embed templates/ctat_submitted_subject.html
var ctatSubmittedSubjectTemplate string

//go:embed templates/ctat_submitted_admin_body.html
var ctatSubmittedAdminBodyTemplate string

//go:embed templates/ctat_submitted_admin_subject.html
var ctatSubmittedAdminSubjectTemplate string

//go:embed templates/ctat_update_body.html
var ctatUpdateBodyTemplate string

//go:embed templates/ctat_update_subject.html
var ctatUpdateSubjectTemplate string

//go:embed templates/ctat_update_admin_body.html
var ctatUpdateAdminBodyTemplate string

//go:embed templates/ctat_update_admin_subject.html
var ctatUpdateAdminSubjectTemplate string

type ctatEmails struct {
	// Submitted is the email sent when a CTAT request is submitted.
	Submitted *emailtemplates.GenEmailTemplate[CTATSubmittedSubjectContent, CTATSubmittedBodyContent]
	// SubmittedAdmin is the email sent to admins when a CTAT request is submitted.
	SubmittedAdmin *emailtemplates.GenEmailTemplate[CTATSubmittedAdminSubjectContent, CTATSubmittedAdminBodyContent]
	// Update is the email sent when a CTAT request is updated.
	Update *emailtemplates.GenEmailTemplate[CTATUpdateSubjectContent, CTATUpdateBodyContent]
	// UpdateAdmin is the email sent to admins when a CTAT request is updated.
	UpdateAdmin *emailtemplates.GenEmailTemplate[CTATUpdateAdminSubjectContent, CTATUpdateAdminBodyContent]
}

// CTAT is the collection of CTAT-related email templates.
var CTAT = ctatEmails{
	Submitted: NewEmailTemplate[CTATSubmittedSubjectContent, CTATSubmittedBodyContent](
		CTATSubmittedTemplateName,
		ctatSubmittedSubjectTemplate,
		ctatSubmittedBodyTemplate,
	),
	SubmittedAdmin: NewEmailTemplate[CTATSubmittedAdminSubjectContent, CTATSubmittedAdminBodyContent](
		CTATSubmittedAdminTemplateName,
		ctatSubmittedAdminSubjectTemplate,
		ctatSubmittedAdminBodyTemplate,
	),
	Update: NewEmailTemplate[CTATUpdateSubjectContent, CTATUpdateBodyContent](
		CTATUpdateTemplateName,
		ctatUpdateSubjectTemplate,
		ctatUpdateBodyTemplate,
	),
	UpdateAdmin: NewEmailTemplate[CTATUpdateAdminSubjectContent, CTATUpdateAdminBodyContent](
		CTATUpdateAdminTemplateName,
		ctatUpdateAdminSubjectTemplate,
		ctatUpdateAdminBodyTemplate,
	),
}

// CTATSubmittedSubjectContent defines the parameters necessary for the corresponding email subject.
type CTATSubmittedSubjectContent struct {
	TicketNumber string
}

// CTATSubmittedAdminSubjectContent defines the parameters necessary for the corresponding admin email subject.
// It currently shares the same shape as the requester-submitted email.
type CTATSubmittedAdminSubjectContent = CTATSubmittedSubjectContent

// CTATSubmittedBodyContent defines the parameters necessary for the corresponding email body.
type CTATSubmittedBodyContent struct {
	ClientAddress          string
	CTATTicketID           string
	TicketNumber           string
	RequesterName          string
	RequesterEmail         string
	CMMIGroup              string
	CMMIDivision           string
	RelatedMINTModels      string
	ContractActivityType   string
	ContractName           string
	ContractType           string
	TypeOfHelpNeeded       string
	DescribeHelpNeeded     string
	RequestUrgency         string
	DateAssistanceNeededBy string
	UploadedFiles          string
}

// CTATSubmittedAdminBodyContent defines the parameters necessary for the corresponding admin email body.
// It currently shares the same shape as the requester-submitted email.
type CTATSubmittedAdminBodyContent = CTATSubmittedBodyContent

// CTATUpdateSubjectContent defines the parameters necessary for the corresponding email subject.
type CTATUpdateSubjectContent struct {
	TicketNumber string
}

// CTATUpdateAdminSubjectContent defines the parameters necessary for the corresponding admin email subject.
// It currently shares the same shape as the requester-update email.
type CTATUpdateAdminSubjectContent = CTATUpdateSubjectContent

// CTATUpdateBodyContent defines the parameters necessary for the corresponding email body.
type CTATUpdateBodyContent struct {
	Status                    string
	StatusUpdated             bool
	AssignedTeamMemberUpdated bool
	AssignedTeamMemberName    string
	AssignedTeamMemberEmail   string
	ProgressNotesUpdated      bool
	ProgressNotes             string
	ResolutionUpdated         bool
	Resolution                string
	ClientAddress             string
	CTATTicketID              string
	TicketNumber              string
	RequesterName             string
	RequesterEmail            string
	CMMIGroup                 string
	CMMIDivision              string
	RelatedMINTModels         string
	ContractActivityType      string
	ContractName              string
	ContractType              string
	TypeOfHelpNeeded          string
	DescribeHelpNeeded        string
	RequestUrgency            string
	DateAssistanceNeededBy    string
	UploadedFiles             string
}

// CTATUpdateAdminBodyContent defines the parameters necessary for the corresponding admin email body.
// It currently shares the same shape as the requester-update email.
type CTATUpdateAdminBodyContent struct {
	CTATUpdateBodyContent
	AdminName string
}

// BuildCTATSubmittedBodyContent assembles the CTAT submitted email body content.
func BuildCTATSubmittedBodyContent(
	ctx context.Context,
	emailService oddmail.EmailService,
	ctatRequest *models.CTATRequest,
	getRelatedMINTModels func(context.Context, uuid.UUID) ([]*models.ModelPlan, error),
	getSupportingDocuments func(context.Context, uuid.UUID) ([]*models.CTATRequestDocument, error),
) (CTATSubmittedBodyContent, error) {
	if emailService == nil || ctatRequest == nil {
		return CTATSubmittedBodyContent{}, nil
	}

	requesterAccount, err := ctatRequest.RequesterUserAccount(ctx)
	if err != nil {
		return CTATSubmittedBodyContent{}, err
	}

	relatedModels := []*models.ModelPlan{}
	if getRelatedMINTModels != nil {
		relatedModels, err = getRelatedMINTModels(ctx, ctatRequest.ID)
		if err != nil {
			return CTATSubmittedBodyContent{}, err
		}
	}

	documents := []*models.CTATRequestDocument{}
	if getSupportingDocuments != nil {
		documents, err = getSupportingDocuments(ctx, ctatRequest.ID)
		if err != nil {
			return CTATSubmittedBodyContent{}, err
		}
	}

	bodyContent := CTATSubmittedBodyContent{
		ClientAddress:          emailService.GetConfig().GetClientAddress(),
		CTATTicketID:           ctatRequest.ID.String(),
		TicketNumber:           ctatRequest.HumanReadableID(),
		CMMIGroup:              ctatRequest.CmmiGroup.Humanize(),
		RelatedMINTModels:      strings.Join(lo.Map(relatedModels, func(item *models.ModelPlan, _ int) string { return item.ModelName }), ", "),
		TypeOfHelpNeeded:       strings.Join(lo.Map(ctatRequest.TypeOfHelpNeeded, func(item models.CTATHelpNeededType, _ int) string { return item.Humanize() }), ", "),
		DescribeHelpNeeded:     ctatRequest.DescribeHelpNeeded,
		RequestUrgency:         ctatRequest.RequestUrgency.Humanize(),
		DateAssistanceNeededBy: ctatRequest.DateAssistanceNeededBy.Format("01/02/2006"),
		UploadedFiles:          strings.Join(lo.Map(documents, func(item *models.CTATRequestDocument, _ int) string { return item.FileName }), ", "),
	}

	if requesterAccount != nil {
		bodyContent.RequesterName = requesterAccount.CommonName
		bodyContent.RequesterEmail = requesterAccount.Email
	}

	if ctatRequest.ContractName != nil {
		bodyContent.ContractName = *ctatRequest.ContractName
	}

	if ctatRequest.CmmiGroup == models.CTATCMMIGroupOptionOther && ctatRequest.CmmiGroupOther != nil {
		bodyContent.CMMIGroup = fmt.Sprintf("%s (%s)", bodyContent.CMMIGroup, *ctatRequest.CmmiGroupOther)
	}

	if ctatRequest.CmmiDivision != nil {
		bodyContent.CMMIDivision = ctatRequest.CmmiDivision.Humanize()
		if *ctatRequest.CmmiDivision == models.CTATCMMIDivisionOptionOther && ctatRequest.CmmiDivisionOther != nil {
			bodyContent.CMMIDivision = fmt.Sprintf("%s (%s)", bodyContent.CMMIDivision, *ctatRequest.CmmiDivisionOther)
		}
	}

	if ctatRequest.ContractActivityType != nil {
		bodyContent.ContractActivityType = ctatRequest.ContractActivityType.Humanize()
		if *ctatRequest.ContractActivityType == models.CTATContractActivityTypeOther && ctatRequest.ContractActivityTypeOther != nil {
			bodyContent.ContractActivityType = fmt.Sprintf("%s (%s)", bodyContent.ContractActivityType, *ctatRequest.ContractActivityTypeOther)
		}
	}

	if ctatRequest.ContractType != nil {
		bodyContent.ContractType = ctatRequest.ContractType.Humanize()
		if *ctatRequest.ContractType == models.CTATContractTypeOther && ctatRequest.ContractTypeOther != nil {
			bodyContent.ContractType = fmt.Sprintf("%s (%s)", bodyContent.ContractType, *ctatRequest.ContractTypeOther)
		}
	}

	if slices.Contains(ctatRequest.TypeOfHelpNeeded, models.CTATHelpNeededTypeOther) && ctatRequest.TypeOfHelpNeededOther != nil {
		helpNeededValues := lo.Map(ctatRequest.TypeOfHelpNeeded, func(item models.CTATHelpNeededType, _ int) string {
			humanized := item.Humanize()
			if item == models.CTATHelpNeededTypeOther {
				return fmt.Sprintf("%s (%s)", humanized, *ctatRequest.TypeOfHelpNeededOther)
			}

			return humanized
		})
		bodyContent.TypeOfHelpNeeded = strings.Join(helpNeededValues, ", ")
	}

	return bodyContent, nil
}

// SendCTATSubmittedEmails sends the CTAT submitted emails to the requester and admin
func SendCTATSubmittedEmails(
	ctx context.Context,
	emailService oddmail.EmailService,
	addressBook AddressBook,
	ctatRequest *models.CTATRequest,
	getRelatedMINTModels func(context.Context, uuid.UUID) ([]*models.ModelPlan, error),
	getSupportingDocuments func(context.Context, uuid.UUID) ([]*models.CTATRequestDocument, error),
) error {
	if emailService == nil || ctatRequest == nil {
		return nil
	}

	subjectContent := CTATSubmittedSubjectContent{
		TicketNumber: ctatRequest.HumanReadableID(),
	}

	bodyContent, err := BuildCTATSubmittedBodyContent(
		ctx,
		emailService,
		ctatRequest,
		getRelatedMINTModels,
		getSupportingDocuments,
	)
	if err != nil {
		return err
	}
	if bodyContent.RequesterEmail == "" {
		return nil
	}

	requesterEmailSubject, requesterEmailBody, err := CTAT.Submitted.GetContent(subjectContent, bodyContent)
	if err != nil {
		return err
	}

	if err := emailService.Send(
		addressBook.DefaultSender,
		[]string{bodyContent.RequesterEmail},
		nil,
		requesterEmailSubject,
		"text/html",
		requesterEmailBody,
	); err != nil {
		return err
	}

	// if unset, exit here
	if len(addressBook.CTATTeamEmail) < 1 {
		return errors.New("CTAT team email unset, aborting admin email send on submission")
	}

	adminEmailSubject, adminEmailBody, err := CTAT.SubmittedAdmin.GetContent(subjectContent, bodyContent)
	if err != nil {
		return err
	}

	return emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.CTATTeamEmail},
		nil,
		adminEmailSubject,
		"text/html",
		adminEmailBody,
	)
}

func uuidPointersEqual(first *uuid.UUID, second *uuid.UUID) bool {
	if first == nil && second == nil {
		return true
	}

	if first == nil || second == nil {
		return false
	}

	return *first == *second
}

func trimmedStringPointersEqual(first *string, second *string) bool {
	firstValue := ""
	if first != nil {
		firstValue = strings.TrimSpace(*first)
	}

	secondValue := ""
	if second != nil {
		secondValue = strings.TrimSpace(*second)
	}

	return firstValue == secondValue
}

// SendCTATUpdateEmails sends the CTAT update emails to the requester and admin
func SendCTATUpdateEmails(
	ctx context.Context,
	emailService oddmail.EmailService,
	addressBook AddressBook,
	originalRequest *models.CTATRequest,
	updatedRequest *models.CTATRequest,
	getRelatedMINTModels func(context.Context, uuid.UUID) ([]*models.ModelPlan, error),
	getSupportingDocuments func(context.Context, uuid.UUID) ([]*models.CTATRequestDocument, error),
) error {
	if emailService == nil || originalRequest == nil || updatedRequest == nil {
		return nil
	}

	statusUpdated := originalRequest.Status != updatedRequest.Status
	assignedAdminUpdated := !uuidPointersEqual(originalRequest.AssignedAdmin, updatedRequest.AssignedAdmin)
	progressNotesUpdated := !trimmedStringPointersEqual(originalRequest.Notes, updatedRequest.Notes)
	resolutionUpdated := !trimmedStringPointersEqual(originalRequest.Resolution, updatedRequest.Resolution)
	if !statusUpdated && !assignedAdminUpdated && !progressNotesUpdated && !resolutionUpdated {
		return nil
	}

	bodySummary, err := BuildCTATSubmittedBodyContent(
		ctx,
		emailService,
		updatedRequest,
		getRelatedMINTModels,
		getSupportingDocuments,
	)
	if err != nil {
		return err
	}
	if bodySummary.RequesterEmail == "" {
		return nil
	}

	assignedAdminAccount, err := updatedRequest.AssignedAdminUserAccount(ctx)
	if err != nil {
		return err
	}

	subjectContent := CTATUpdateSubjectContent{
		TicketNumber: updatedRequest.HumanReadableID(),
	}

	bodyContent := CTATUpdateBodyContent{
		Status:                    updatedRequest.Status.Humanize(),
		StatusUpdated:             statusUpdated,
		AssignedTeamMemberUpdated: assignedAdminUpdated,
		ProgressNotesUpdated:      progressNotesUpdated,
		ResolutionUpdated:         resolutionUpdated,
		ClientAddress:             bodySummary.ClientAddress,
		CTATTicketID:              bodySummary.CTATTicketID,
		TicketNumber:              bodySummary.TicketNumber,
		RequesterName:             bodySummary.RequesterName,
		RequesterEmail:            bodySummary.RequesterEmail,
		CMMIGroup:                 bodySummary.CMMIGroup,
		CMMIDivision:              bodySummary.CMMIDivision,
		RelatedMINTModels:         bodySummary.RelatedMINTModels,
		ContractActivityType:      bodySummary.ContractActivityType,
		ContractName:              bodySummary.ContractName,
		ContractType:              bodySummary.ContractType,
		TypeOfHelpNeeded:          bodySummary.TypeOfHelpNeeded,
		DescribeHelpNeeded:        bodySummary.DescribeHelpNeeded,
		RequestUrgency:            bodySummary.RequestUrgency,
		DateAssistanceNeededBy:    bodySummary.DateAssistanceNeededBy,
		UploadedFiles:             bodySummary.UploadedFiles,
	}

	if assignedAdminAccount != nil {
		bodyContent.AssignedTeamMemberName = assignedAdminAccount.CommonName
		bodyContent.AssignedTeamMemberEmail = assignedAdminAccount.Email
	}

	if updatedRequest.Notes != nil {
		bodyContent.ProgressNotes = *updatedRequest.Notes
	}

	if updatedRequest.Resolution != nil {
		bodyContent.Resolution = *updatedRequest.Resolution
	}

	requesterEmailSubject, requesterEmailBody, err := CTAT.Update.GetContent(subjectContent, bodyContent)
	if err != nil {
		return err
	}

	if err := emailService.Send(
		addressBook.DefaultSender,
		[]string{bodySummary.RequesterEmail},
		nil,
		requesterEmailSubject,
		"text/html",
		requesterEmailBody,
	); err != nil {
		return err
	}

	// if unset, exit here
	if len(addressBook.CTATTeamEmail) < 1 {
		return errors.New("CTAT email team unset, aborting admin email send on update")
	}

	principalAcct := appcontext.Principal(ctx).Account()
	if principalAcct == nil {
		return errors.New("unexpected nil principal account, aborting admin email send on update")
	}

	adminEmailSubject, adminEmailBody, err := CTAT.UpdateAdmin.GetContent(subjectContent, CTATUpdateAdminBodyContent{
		CTATUpdateBodyContent: bodyContent,
		AdminName:             principalAcct.CommonName,
	})
	if err != nil {
		return err
	}

	// send email to CTAT team inbox
	if err := emailService.Send(
		addressBook.DefaultSender,
		[]string{addressBook.CTATTeamEmail},
		nil,
		adminEmailSubject,
		"text/html",
		adminEmailBody,
	); err != nil {
		return err
	}

	if assignedAdminAccount != nil && len(assignedAdminAccount.Email) > 0 {
		// send email to the assigned admin on the CTAT request
		if err := emailService.Send(
			addressBook.DefaultSender,
			[]string{assignedAdminAccount.Email},
			nil,
			adminEmailSubject,
			"text/html",
			adminEmailBody,
		); err != nil {
			return err
		}
	}

	return nil
}
