package email

import (
	_ "embed"
)

const MTOCommonMilestoneRemovedTemplateName = "mto_common_milestone_removed"

//go:embed templates/mto_common_milestone_removed_subject.html
var MTOCommonMilestoneRemovedSubjectTemplate string

//go:embed templates/mto_common_milestone_removed_body.html
var MTOCommonMilestoneRemovedBodyTemplate string

type MTOCommonMilestoneRemovedSubjectContent struct{}

type MTOCommonMilestoneRemovedBodyContent struct {
	UserName       string
	MilestoneTitle string
	CategoryAndSub string
	Roles          string // comma-separated
	Solutions      string // comma-separated
	ClientAddress  string
}
