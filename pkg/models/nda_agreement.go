package models

import "time"

// NDAAgreement represents an NDAAgreement saved in the database
type NDAAgreement struct {
	BaseStruct
	UserID    string     `json:"userID" db:"user_id"`
	Agreed    bool       `json:"agreed" db:"agreed"`
	AgreedDts *time.Time `json:"agreedDts" db:"agreed_dts"`
}
