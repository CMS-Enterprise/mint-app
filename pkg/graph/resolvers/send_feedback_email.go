package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/graph/model"

	"github.com/cmsgov/mint-app/pkg/authentication"
)

// SendFeedbackEmail sends a feedback email to the mint team
func SendFeedbackEmail(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	principal authentication.Principal,
	input model.SendFeedbackEmailInput,
) (bool, error) {
	if emailService != nil && emailTemplateService != nil {
		emailTemplate, err := emailTemplateService.GetEmailTemplate(email.SendFeedbackTemplateName)
		if err != nil {
			return false, err
		}

		emailSubject, err := emailTemplate.GetExecutedSubject(email.SendFeedbackSubjectContent{})
		if err != nil {
			return false, err
		}

		emailBody, err := emailTemplate.GetExecutedBody(email.SendFeedbackBodyContent{
			IsAnonymousSubmission: input.IsAnonymousSubmission,
			ReporterName:          principal.Account().CommonName,
			ReporterEmail:         principal.Account().Email,
			AllowContact:          input.AllowContact,
			CMSRole:               input.CmsRole,
			MINTUsedFor:           humanizeFeedbackMINTUses(input.MintUsedFor, input.MintUsedForOther),
			SystemEasyToUse:       humanizeFeedbackEasyToUse(input.SystemEasyToUse, input.SystemEasyToUseOther),
			HowSatisfied:          humanizeFeedbackSatisfaction(input.HowSatisfied),
			HowCanWeImprove:       input.HowCanWeImprove,
		})
		if err != nil {
			return false, err
		}

		// TODO: SW pull un the address book from the report a problem email
		err = emailService.Send(addressBook.DefaultSender, []string{addressBook.DevTeamEmail}, nil, emailSubject, "text/html", emailBody)
		if err != nil {
			return false, err
		}
		return true, nil

	}

	return true, nil
}

func humanizeFeedbackMINTUses(usedFor []model.MintUses, usedForOther *string) []string {
	//TODO: SW implement
	uses := []string{}
	for _, use := range usedFor {
		uses = append(uses, string(use))
	}
	if usedForOther != nil { //TODO, remove other above?
		uses = append(uses, *usedForOther)
	}

	return uses

}

func humanizeFeedbackEasyToUse(ease model.EaseOfUse, easeOther *string) string {
	// TODO: SW implement
	if easeOther != nil {
		return *easeOther
	}
	return string(ease)
}

func humanizeFeedbackSatisfaction(satisfactionLevel model.SatisfactionLevel) string {
	// TODO: SW implement
	return string(satisfactionLevel)
}
