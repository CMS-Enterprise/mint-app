package email

import (
	_ "embed"
)

const MTOCommonMilestoneCreatedTemplateName = "mto_common_milestone_created"

//go:embed templates/mto_common_milestone_created_subject.html
var MTOCommonMilestoneCreatedSubjectTemplate string

//go:embed templates/mto_common_milestone_created_body.html
var MTOCommonMilestoneCreatedBodyTemplate string

type MTOCommonMilestoneCreatedSubjectContent struct{ MilestoneTitle string }

type MTOCommonMilestoneCreatedBodyContent struct {
	UserName       string
	MilestoneTitle string
	Description    string
	CategoryAndSub string
	Roles          string // comma-separated
	Solutions      string // comma-separated
	ClientAddress  string
}
