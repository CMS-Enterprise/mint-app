package email

import (
	"time"

	"github.com/cmsgov/mint-app/pkg/models"
)

// ModelPlanShareSubjectContent defines the parameters necessary for the corresponding email subject
type ModelPlanShareSubjectContent struct {
	UserName string
}

// ModelPlanShareBodyContent defines the parameters necessary for the corresponding email body
type ModelPlanShareBodyContent struct {
	UserName                 string
	OptionalMessage          *string
	ModelName                string
	ModelShortName           *string
	ModelCategories          []models.ModelCategory
	ModelStatus              string
	ModelLastUpdated         time.Time
	ModelLeads               []string
	ModelViewFilter          *string
	HumanizedModelViewFilter *string
	ClientAddress            string
	ModelID                  string
}
