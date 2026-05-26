package models

import (
	"fmt"
	"time"

	"github.com/google/uuid"
)

// CTATRequestLite is a lite version of the full CTAT request that contains the required data for table population in the UI
type CTATRequestLite struct {
	ID                    uuid.UUID            `json:"id"`
	HumanReadableIDNumber int                  `json:"humanReadableIDNumber"`
	SubmissionDate        time.Time            `json:"submissionDate"`
	ContractName          *string              `json:"contractName,omitempty"`
	TypeOfHelpNeeded      []CTATHelpNeededType `json:"typeOfHelpNeeded"`
	TypeOfHelpNeededOther *string              `json:"typeOfHelpNeededOther,omitempty"`
	Status                *CTATStatus          `json:"status,omitempty"`
}

// HumanReadableID composes the display ID from the fixed CTAT prefix and stored numeric suffix.
func (c *CTATRequestLite) HumanReadableID() string {
	if c == nil || c.HumanReadableIDNumber == 0 {
		// really shouldn't be possible with the data type in the DB, but will guard for safety
		return "CTAT-000"
	}

	// pad number to force number minimum width of 3 (i.e., `25` becomes `025`, but `1000` remains `1000`)
	return fmt.Sprintf("%s-%03d", ctatRequestHumanReadableIDPrefix, c.HumanReadableIDNumber)
}
