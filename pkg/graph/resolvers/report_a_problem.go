package resolvers

import (
	"github.com/cmsgov/mint-app/pkg/email"
	"github.com/cmsgov/mint-app/pkg/shared/oddmail"

	"github.com/cmsgov/mint-app/pkg/graph/model"

	"github.com/cmsgov/mint-app/pkg/authentication"
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
			AllowContact:          input.AllowContact,
			Section:               humanizeSection(input.Section, input.SectionOther),
			WhatDoing:             input.WhatDoing,
			WhatWentWrong:         input.WhatWentWrong,
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
