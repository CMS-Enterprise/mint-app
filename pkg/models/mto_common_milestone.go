package models

type MTOCommonMilestone struct {
	baseStruct

	CategoryName string `json:"categoryName" db:"category_name"`
}
