package models

//NDAAgreement represents an NDAAgreement saved in the database
type NDAAgreement struct {
	BaseStruct
	UserID   string `json:"userID" db:"user_id"`
	Accepted bool   `json:"accepted" db:"accepted"`
}
