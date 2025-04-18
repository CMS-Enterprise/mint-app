package email

import (
	"time"
)

// ModelPlanShareSubjectContent defines the parameters necessary for the corresponding email subject
type ModelPlanShareSubjectContent struct {
	UserName string
}

// ModelPlanShareBodyContent defines the parameters necessary for the corresponding email body
type ModelPlanShareBodyContent struct {
	UserName                   string
	OptionalMessage            *string
	ModelName                  string
	ModelShortName             *string
	ModelCategories            []string
	ModelStatus                string
	ModelLastUpdated           time.Time
	ModelLeads                 []string
	ModelViewFilter            *string
	ModelShareSectionHumanized *string
	ModelShareSectionRoute     *string
	HumanizedModelViewFilter   *string
	ClientAddress              string
	ModelID                    string
}
