package email

import (
	"github.com/cmsgov/mint-app/pkg/models"
)

// DailyDigestBodyContent defines the parameters necessary for the corresponding email body
type DailyDigestBodyContent struct {
	AnalyzedAudits []*models.AnalyzedAudit
	ClientAddress  string
}

// DailyDigestSubjectContent defines the parameters necessary for the corresponding email subject
type DailyDigestSubjectContent struct{}
