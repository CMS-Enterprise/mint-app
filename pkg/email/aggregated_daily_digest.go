package email

import (
	_ "embed"

	"github.com/cms-enterprise/mint-app/pkg/models"
)

// AggregatedDailyDigestTemplateName is the template name definition for the corresponding email template
const AggregatedDailyDigestTemplateName string = "aggregated_daily_digest"

//go:embed templates/aggregated_daily_digest_subject.html
var aggregatedDailyDigestSubjectTemplate string

//go:embed templates/aggregated_daily_digest_body.html
var aggregatedDailyDigestBodyTemplate string

// AggregatedDailyDigestSubjectContent defines the parameters necessary for the corresponding email subject
type AggregatedDailyDigestSubjectContent struct{}

// AggregatedDailyDigestBodyContent defines the parameters necessary for the corresponding email body
type AggregatedDailyDigestBodyContent struct {
	AnalyzedAudits []*models.AnalyzedAudit
	ClientAddress  string
}

// aggregatedDailyDigest is the struct that holds aggregated daily digest email templates
var aggregatedDailyDigest = NewEmailTemplate[AggregatedDailyDigestSubjectContent, AggregatedDailyDigestBodyContent](
	AggregatedDailyDigestTemplateName,
	aggregatedDailyDigestSubjectTemplate,
	aggregatedDailyDigestBodyTemplate,
)
