package models

import (
	"errors"
	"time"

	"github.com/google/uuid"
)

type CTATDashboardRelativeDateFilter string

const (
	CTATDashboardRelativeDateFilterPastWeek         CTATDashboardRelativeDateFilter = "PAST_WEEK"
	CTATDashboardRelativeDateFilterPastMonth        CTATDashboardRelativeDateFilter = "PAST_MONTH"
	CTATDashboardRelativeDateFilterPastQuarter      CTATDashboardRelativeDateFilter = "PAST_QUARTER"
	CTATDashboardRelativeDateFilterPastCalendarYear CTATDashboardRelativeDateFilter = "PAST_CALENDAR_YEAR"
	CTATDashboardRelativeDateFilterAllTime          CTATDashboardRelativeDateFilter = "ALL_TIME"
	CTATDashboardRelativeDateFilterCustomDateRange  CTATDashboardRelativeDateFilter = "CUSTOM_DATE_RANGE"
)

// Input for filtering CTAT Dashboard data
type CTATDashboardFilter struct {
	DivisionFilter     *CTATDashboardCMMIFilter           `json:"divisionFilter,omitempty"`
	ModelFilter        *uuid.UUID                         `json:"modelFilter,omitempty"`
	ContractTypeFilter *CTATContractType                  `json:"contractTypeFilter,omitempty"`
	DateFilter         *CTATDashboardSubmissionDateFilter `json:"dateFilter,omitempty"`
}

// Input for filtering on CMMI Groups/Divisions
type CTATDashboardCMMIFilter struct {
	Groups            []*CTATDashboardCMMIGroupFilter `json:"groups"`
	IncludeOtherGroup bool                            `json:"includeOtherGroup"`
}

// Input for specific in-group filtering
type CTATDashboardCMMIGroupFilter struct {
	Group     CTATCMMIGroupOption      `json:"group"`
	Divisions []CTATCMMIDivisionOption `json:"divisions"`
}

// Input for date filtering
type CTATDashboardSubmissionDateFilter struct {
	Selection CTATDashboardRelativeDateFilter `json:"selection"`
	StartDate *time.Time                      `json:"startDate,omitempty"`
	EndDate   *time.Time                      `json:"endDate,omitempty"`
}

func (c *CTATDashboardFilter) Validate() error {
	if c == nil {
		return nil
	}

	// confirm start and end date exist (and are in order) when we receive a Custom date filter
	if c.DateFilter != nil && c.DateFilter.Selection == CTATDashboardRelativeDateFilterCustomDateRange {
		if c.DateFilter.StartDate == nil || c.DateFilter.EndDate == nil {
			return errors.New("startDate and endDate must both be non-nil when `Custom` is selected as the date filter")
		}

		if c.DateFilter.StartDate.After(*c.DateFilter.EndDate) {
			return errors.New("startDate cannot be after end date")
		}
	}

	return nil
}
