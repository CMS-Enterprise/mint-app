package models

import (
	"time"

	"github.com/google/uuid"
)

// NDAAgreement represents an NDAAgreement saved in the database
type NDAAgreement struct {
	// baseStruct
	UserID    uuid.UUID  `json:"userID" db:"user_id"`
	Agreed    bool       `json:"agreed" db:"v2_agreed"`
	AgreedDts *time.Time `json:"agreedDts" db:"agreed_dts"`

	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}
