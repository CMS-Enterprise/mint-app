package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
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
			AllowContact:          humanizeFeedbackAllowContact(input.AllowContact),
			CMSRole:               models.ValueOrEmpty(input.CmsRole),
			MINTUsedFor:           humanizeFeedbackMINTUses(input.MintUsedFor, input.MintUsedForOther),
			SystemEasyToUse:       humanizeFeedbackEasyToUse(input.SystemEasyToUse, input.SystemEasyToUseOther),
			HowSatisfied:          humanizeFeedbackSatisfaction(input.HowSatisfied),
			HowCanWeImprove:       models.ValueOrEmpty(input.HowCanWeImprove),
		})
		if err != nil {
			return false, err
		}

		err = emailService.Send(addressBook.DefaultSender, []string{addressBook.DevTeamEmail}, nil, emailSubject, "text/html", emailBody)
		if err != nil {
			return false, err
		}
		return true, nil

	}

	return true, nil
}

func humanizeFeedbackAllowContact(allowFeedback *bool) string {
	if allowFeedback == nil {
		return "" //the text for this case is part of the email template to allow formatting
		// return "User didn’t specify if they could be contacted"
	}
	if *allowFeedback {
		return "Yes, the MINT team may contact me for additional information."
	}

	return "No, the MINT team may not contact me for additional information."

}

func humanizeFeedbackMINTUses(usedFor []model.MintUses, usedForOther *string) []string {

	uses := []string{}
	containsOther := false
	for _, use := range usedFor {
		humanized := humanizeFeedbackMINTUse(use)
		if humanized == "" {
			continue
		}
		if humanized == "Other" {
			containsOther = true
			if models.ValueOrEmpty(usedForOther) != "" { // only add the text if isn't nil or empty.
				humanized = humanized + " - " + *usedForOther
			}
		}
		uses = append(uses, humanized)
	}
	if !containsOther && models.ValueOrEmpty(usedForOther) != "" { // It other wasn't selected, but the optional text was filled out include it anyways
		use := "Other - " + *usedForOther
		uses = append(uses, use)
	}

	return uses

}
func humanizeFeedbackMINTUse(use model.MintUses) string {
	switch use {
	case model.MintUsesViewModel:
		return "To view Model Plans"
	case model.MintUsesEditModel:
		return "To edit Model Plans"
	case model.MintUsesShareModel:
		return "To share or export Model Plan content"
	case model.MintUsesTrackSolutions:
		return "To track operational solutions"
	case model.MintUsesContributeDiscussions:
		return "To contribute to Model Discussions"
	case model.MintUsesViewHelp:
		return "To view the Help Center"
	case model.MintUsesOther:
		return "Other"
	default:
		return string(use)
	}
}

func humanizeFeedbackEasyToUse(ease *model.EaseOfUse, easeOther *string) string {
	if easeOther != nil {
		easeSt := "I'm not sure"
		if *easeOther != "" {
			easeSt = easeSt + " - " + *easeOther
		}
		return easeSt
	}
	if ease == nil {
		return ""
	}
	switch *ease {
	case model.EaseOfUseAgree:
		return "Agree"
	case model.EaseOfUseDisagree:
		return "Disagree"
	default:
		return string(*ease)
	}
}

func humanizeFeedbackSatisfaction(satisfactionLevel *model.SatisfactionLevel) string {

	if satisfactionLevel == nil {
		return ""
	}
	switch *satisfactionLevel {
	case model.SatisfactionLevelVerySatisfied:
		return "Very Satisfied"
	case model.SatisfactionLevelSatisfied:
		return "Satisfied"
	case model.SatisfactionLevelNeutral:
		return "Neutral"
	case model.SatisfactionLevelDissatisfied:
		return "Dissatisfied"
	case model.SatisfactionLevelVeryDissatisfied:
		return "Very Dissatisfied"
	default:
		return string(*satisfactionLevel)
	}
}
