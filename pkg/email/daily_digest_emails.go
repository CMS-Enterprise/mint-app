package email

import "github.com/cms-enterprise/mint-app/pkg/shared/emailtemplates"

// dailyDigestEmails holds all daily digest email templates
type dailyDigestEmails struct {
	DailyDigest           *emailtemplates.GenEmailTemplate[DailyDigestSubjectContent, DailyDigestBodyContent]
	AggregatedDailyDigest *emailtemplates.GenEmailTemplate[AggregatedDailyDigestSubjectContent, AggregatedDailyDigestBodyContent]
}

// DailyDigestEmails is the exported daily digest emails registry
var DailyDigestEmails = dailyDigestEmails{
	DailyDigest:           dailyDigest,
	AggregatedDailyDigest: aggregatedDailyDigest,
}
