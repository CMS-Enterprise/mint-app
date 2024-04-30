package models

import (
	"time"

	"github.com/google/uuid"
)

// NDAAgreement represents an NDAAgreement saved in the database
type NDAAgreement struct {
	// baseStruct
	UserID      uuid.UUID  `json:"userID" db:"user_id"`
	V1Agreed    bool       `json:"v1Agreed" db:"v1_agreed"`
	V1AgreedDts *time.Time `json:"v1AgreedDts" db:"v1_agreed_dts"`
	V2Agreed    bool       `json:"v2Agreed" db:"v2_agreed"`
	V2AgreedDts *time.Time `json:"v2AgreedDts" db:"v2_agreed_dts"`

	ID          uuid.UUID  `json:"id" db:"id"`
	CreatedBy   uuid.UUID  `json:"createdBy" db:"created_by"`
	CreatedDts  time.Time  `json:"createdDts" db:"created_dts"`
	ModifiedBy  *uuid.UUID `json:"modifiedBy" db:"modified_by"`
	ModifiedDts *time.Time `json:"modifiedDts" db:"modified_dts"`
}
