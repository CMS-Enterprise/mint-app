package models

import "github.com/google/uuid"

// ModelChangesAnalytics is the analytics data for changes by model
type ModelChangesAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

// ModelChangesBySectionAnalytics is the analytics data for changes by section
type ModelChangesBySectionAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	TableName             *string    `json:"tableName" db:"table_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

// ModelChangesOtherDataAnalytics is the analytics data for changes by other data
type ModelChangesOtherDataAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	TableName             *string    `json:"tableName" db:"table_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	Section               *string    `json:"section" db:"section"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

// ModelCountAnalytics is the analytics data for the total number of models
type ModelCountAnalytics struct {
	TotalNumberOfModels *int `json:"totalNumberOfModels" db:"total_number_of_models"`
}

// ModelsByStatusAnalytics is the analytics data for models by status
type ModelsByStatusAnalytics struct {
	Status         *string `json:"status" db:"status"`
	NumberOfModels *int    `json:"numberOfModels" db:"number_of_models"`
}

// ModelFollowersAnalytics is the analytics data for the number of followers per model
type ModelFollowersAnalytics struct {
	ModelName         *string    `json:"modelName" db:"model_name"`
	NumberOfFollowers *int       `json:"numberOfFollowers" db:"number_of_followers"`
	ModelPlanID       *uuid.UUID `json:"modelPlanID" db:"id"`
}

// AnalyticsSummary is the summary of the analytics data for all models
type AnalyticsSummary struct {
	ChangesPerModel           []*ModelChangesAnalytics
	ChangesPerModelBySection  []*ModelChangesBySectionAnalytics
	ChangesPerModelOtherData  []*ModelChangesOtherDataAnalytics
	ModelsByStatus            []*ModelsByStatusAnalytics
	NumberOfFollowersPerModel []*ModelFollowersAnalytics
	TotalNumberOfModels       *ModelCountAnalytics
}
