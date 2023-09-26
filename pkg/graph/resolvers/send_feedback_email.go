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
		humanized := humanizeFeedbackMINTUse(use)
		if humanized == "" {
			continue
		}
		uses = append(uses, humanized)
	}
	if usedForOther != nil {
		uses = append(uses, "Other - "+*usedForOther)
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
		return "" // TODO: SW should we include the actual word other?
	default:
		return string(use)
	}
}

func humanizeFeedbackEasyToUse(ease model.EaseOfUse, easeOther *string) string {
	if easeOther != nil {
		return "I'm not sure - " + *easeOther
	}
	switch ease {
	case model.EaseOfUseAgree:
		return "Agree"
	case model.EaseOfUseDisagree:
		return "Disagree"
	default:
		return string(ease)
	}
}

func humanizeFeedbackSatisfaction(satisfactionLevel model.SatisfactionLevel) string {

	switch satisfactionLevel {
	case model.SatisfactionLevelVerySatisfied:
		return "VERY_SATISFIED"
	case model.SatisfactionLevelSatisfied:
		return "SATISFIED"
	case model.SatisfactionLevelNeutral:
		return "NEUTRAL"
	case model.SatisfactionLevelDissatisfied:
		return "DISSATISFIED"
	case model.SatisfactionLevelVeryDissatisfied:
		return "VERY_DISSATISFIED"
	default:
		return string(satisfactionLevel)
	}
}
