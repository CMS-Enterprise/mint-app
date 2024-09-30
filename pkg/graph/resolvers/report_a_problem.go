package resolvers

import (
	"github.com/cms-enterprise/mint-app/pkg/email"
	"github.com/cms-enterprise/mint-app/pkg/models"
	"github.com/cms-enterprise/mint-app/pkg/shared/oddmail"

	"github.com/cms-enterprise/mint-app/pkg/graph/model"

	"github.com/cms-enterprise/mint-app/pkg/authentication"
)

// ReportAProblem is the resolver to send an email with a problem report
func ReportAProblem(
	emailService oddmail.EmailService,
	emailTemplateService email.TemplateService,
	addressBook email.AddressBook,
	principal authentication.Principal,
	input model.ReportAProblemInput,
) (bool, error) {
	if emailService != nil && emailTemplateService != nil {
		emailTemplate, err := emailTemplateService.GetEmailTemplate(email.ReportAProblemTemplateName)
		if err != nil {
			return false, err
		}

		emailSubject, err := emailTemplate.GetExecutedSubject(email.ReportAProblemSubjectContent{})
		if err != nil {
			return false, err
		}

		emailBody, err := emailTemplate.GetExecutedBody(email.ReportAProblemBodyContent{
			IsAnonymousSubmission: input.IsAnonymousSubmission,
			ReporterName:          principal.Account().CommonName,
			ReporterEmail:         principal.Account().Email,
			AllowContact:          humanizeReportAProblemAllowContact(input.AllowContact),
			Section:               humanizeSection(input.Section, input.SectionOther),
			WhatDoing:             models.ValueOrEmpty(input.WhatDoing),
			WhatWentWrong:         models.ValueOrEmpty(input.WhatWentWrong),
			Severity:              humanizeSeverity(input.Severity, input.SeverityOther),
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

func humanizeSection(section *model.ReportAProblemSection, sectionOther *string) string {
	if section == nil {
		return ""
	}

	switch *section {
	case model.ReportAProblemSectionReadView:
		return "Model Plan Read View"
	case model.ReportAProblemSectionTaskList:
		return "Model Plan Task List"
	case model.ReportAProblemSectionItSolutions:
		return "IT solution and implementation status tracker"
	case model.ReportAProblemSectionHelpCenter:
		return "Help Center"
	case model.ReportAProblemSectionOther:
		if sectionOther == nil {
			return "Other"
		}
		return "Other - " + *sectionOther
	default:
		return ""
	}
}

func humanizeSeverity(severity *model.ReportAProblemSeverity, severityOther *string) string {
	if severity == nil {
		return ""
	}

	switch *severity {
	case model.ReportAProblemSeverityPreventedTask:
		return "It prevented me from completing my task"
	case model.ReportAProblemSeverityDelayedTask:
		return "It delayed completion of my task"
	case model.ReportAProblemSeverityMinor:
		return "It was a minor annoyance"
	case model.ReportAProblemSeverityOther:
		if severityOther == nil {
			return "Other"
		}
		return "Other - " + *severityOther
	default:
		return ""
	}
}

func humanizeReportAProblemAllowContact(allowFeedback *bool) string {
	if allowFeedback == nil {
		return "" //the text for this case is part of the email template to allow formatting
		// return "User didn’t specify if they could be contacted"
	}
	if *allowFeedback {
		return "Yes, the MINT team may contact me for additional information."
	}

	return "No, the MINT team may not contact me for additional information."

}
