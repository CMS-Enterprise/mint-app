package models

import (
	"github.com/google/uuid"
	"github.com/samber/lo"
)

// WaiverInfo is a convenience struct for embedding waiver information about a model plan
type WaiverInfo struct {
	modelPlanRelation
	CommonWaivers []*CommonWaiver `json:"commonWaivers"`
}

// NewWaiverInfo returns a new WaiverInfo object
func NewWaiverInfo(modelPlanID uuid.UUID, commonWaivers []*CommonWaiver) *WaiverInfo {
	return &WaiverInfo{
		modelPlanRelation: NewModelPlanRelation(modelPlanID),
		CommonWaivers:     commonWaivers,
	}
}

// UnusedCommonWaivers returns a list of common waivers that are unused (i.e. not answered and not suggested)
func (w *WaiverInfo) UnusedCommonWaivers() []*CommonWaiver {
	return lo.Filter(w.CommonWaivers, func(cw *CommonWaiver, _ int) bool {
		return cw.IsUnused()
	})
}

// SuggestedCommonWaivers returns a list of common waivers that are suggested
func (w *WaiverInfo) SuggestedCommonWaivers() []*CommonWaiver {
	return lo.Filter(w.CommonWaivers, func(cw *CommonWaiver, _ int) bool {
		return cw.IsSuggested()
	})
}
