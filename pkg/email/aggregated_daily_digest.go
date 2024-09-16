package email

import (
	"github.com/cms-enterprise/mint-app/pkg/models"
)

// AggregatedDailyDigestSubjectContent defines the parameters necessary for the corresponding email subject
type AggregatedDailyDigestSubjectContent struct{}

// AggregatedDailyDigestBodyContent defines the parameters necessary for the corresponding email body
type AggregatedDailyDigestBodyContent struct {
	AnalyzedAudits []*models.AnalyzedAudit
	ClientAddress  string
}
