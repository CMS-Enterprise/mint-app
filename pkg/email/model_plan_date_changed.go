package email

import "time"

// ModelPlanDateChangedSubjectContent defines the parameters necessary for the corresponding email subject
type ModelPlanDateChangedSubjectContent struct {
	ModelName string
}

// DateChange defines the parameters necessary for parsing date changes, both singular and ranges
// If the OldRange and NewRange are both nil, then the change is singular
type DateChange struct {
	IsChanged                                              bool
	Field                                                  string
	IsRange                                                bool
	OldDate, NewDate                                       *time.Time
	OldRangeStart, OldRangeEnd, NewRangeStart, NewRangeEnd *time.Time
}

// ModelPlanDateChangedBodyContent defines the parameters necessary for the corresponding email body
type ModelPlanDateChangedBodyContent struct {
	ClientAddress string
	ModelName     string
	ModelID       string
	DateChanges   []DateChange
	ShowFooter    bool
}
