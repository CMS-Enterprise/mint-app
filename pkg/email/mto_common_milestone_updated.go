package email

import (
	_ "embed"
)

const MTOCommonMilestoneUpdatedTemplateName = "mto_common_milestone_updated"

//go:embed templates/mto_common_milestone_updated_subject.html
var MTOCommonMilestoneUpdatedSubjectTemplate string

//go:embed templates/mto_common_milestone_updated_body.html
var MTOCommonMilestoneUpdatedBodyTemplate string

type MTOCommonMilestoneUpdatedSubjectContent struct{ MilestoneTitle string }

type MTOCommonMilestoneUpdatedBodyContent struct {
	UserName               string
	PreviousTitle          string
	PreviousDescription    string
	PreviousCategoryAndSub string
	PreviousRoles          string // comma-separated
	PreviousSolutions      string // comma-separated
	NewTitle               string
	NewDescription         string
	NewCategoryAndSub      string
	NewRoles               string // comma-separated
	NewSolutions           string // comma-separated
	ClientAddress          string
}
