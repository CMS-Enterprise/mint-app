package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// DailyDigestTemplateName is the template name definition for the corresponding email template
const DailyDigestTemplateName string = "daily_digest"

//go:embed templates/daily_digest_subject.html
var dailyDigestSubjectTemplate string

//go:embed templates/daily_digest_body.html
var dailyDigestBodyTemplate string

// DailyDigestBodyContent defines the parameters necessary for the corresponding email body
type DailyDigestBodyContent struct {
	AnalyzedAudits []*models.AnalyzedAudit
	ClientAddress  string
}

// DailyDigestSubjectContent defines the parameters necessary for the corresponding email subject
type DailyDigestSubjectContent struct{}

// dailyDigest is the struct that holds daily digest email templates
var dailyDigest = NewEmailTemplate[DailyDigestSubjectContent, DailyDigestBodyContent](
	DailyDigestTemplateName,
	dailyDigestSubjectTemplate,
	dailyDigestBodyTemplate,
)
