package models

import (
	"time"

	"github.com/google/uuid"
)

// RecentModification is a struct to enable a view of the recently modified activity
type RecentModification struct {
	modifiedByRelation
}

// NewRecentModification creates a new Recent Modification type
func NewRecentModification(modifiedBy uuid.UUID, modifiedDTs time.Time) RecentModification {
	return RecentModification{
		modifiedByRelation: modifiedByRelation{
			ModifiedBy:  &modifiedBy,
			ModifiedDts: &modifiedDTs,
		},
	}

}
