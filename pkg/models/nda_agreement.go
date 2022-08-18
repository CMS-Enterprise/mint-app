package models

import "time"

//NDAAgreement represents an NDAAgreement saved in the database
type NDAAgreement struct {
	BaseStruct
	UserID      string     `json:"userID" db:"user_id"`
	Accepted    bool       `json:"accepted" db:"accepted"`
	AcceptedDts *time.Time `json:"acceptedDts" db:"accepted_dts"`
}
