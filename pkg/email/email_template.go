package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

func NewEmailTemplate[subjectType any, bodyType any](name string, subject string, body string) *emailtemplates.GenEmailTemplate[subjectType, bodyType] {

	return emailtemplates.MustNewGenEmailTemplate[subjectType, bodyType](
		name,
		subject,
		body,
		EmbeddedTemplates,
	)
}
