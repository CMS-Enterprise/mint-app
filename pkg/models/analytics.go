package models

import "github.com/google/uuid"

// Analytics data types for various model plan metrics and statistics
type ModelChangesAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

type ModelChangesBySectionAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	TableName             *string    `json:"tableName" db:"table_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

type ModelChangesOtherDataAnalytics struct {
	ModelName             *string    `json:"modelName" db:"model_name"`
	TableName             *string    `json:"tableName" db:"table_name"`
	NumberOfChanges       *int       `json:"numberOfChanges" db:"number_of_changes"`
	NumberOfRecordChanges *int       `json:"numberOfRecordChanges" db:"number_of_record_changes"`
	Section               *string    `json:"section" db:"section"`
	ModelPlanID           *uuid.UUID `json:"modelPlanID" db:"id"`
}

type ModelCountAnalytics struct {
	TotalNumberOfModels *int `json:"totalNumberOfModels" db:"total_number_of_models"`
}

type ModelsByStatusAnalytics struct {
	Status         *string `json:"status" db:"status"`
	NumberOfModels *int    `json:"numberOfModels" db:"number_of_models"`
}

type ModelFollowersAnalytics struct {
	ModelName         *string    `json:"modelName" db:"model_name"`
	NumberOfFollowers *int       `json:"numberOfFollowers" db:"number_of_followers"`
	ModelPlanID       *uuid.UUID `json:"modelPlanID" db:"id"`
}

// AnalyticsSummary is the summary of the analytics data
type AnalyticsSummary struct {
	ChangesPerModel           []*ModelChangesAnalytics
	ChangesPerModelBySection  []*ModelChangesBySectionAnalytics
	ChangesPerModelOtherData  []*ModelChangesOtherDataAnalytics
	ModelsByStatus            []*ModelsByStatusAnalytics
	NumberOfFollowersPerModel []*ModelFollowersAnalytics
	TotalNumberOfModels       *ModelCountAnalytics
}
