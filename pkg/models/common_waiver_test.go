package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestCommonWaiverWaiverFocusDisplay(t *testing.T) {
	waiver := CommonWaiver{
		WaiverFocus: EnumArray[CommonWaiverFocus]{
			CommonWaiverFocusSiteOfCare,
			CommonWaiverFocusSafeHarbors,
		},
	}

	assert.Equal(t, "Site of care, Safe harbors", waiver.WaiverFocusDisplay())
}
