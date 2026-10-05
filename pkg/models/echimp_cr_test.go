package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConvertRawCRSToParsedAllValid(t *testing.T) {
	raw := []*EChimpCRRaw{
		{CrNumber: "CR-1", CrSummary: "Summary 1", AssociatedModelUids: "11111111-1111-1111-1111-111111111111"},
		{CrNumber: "CR-2", CrSummary: "Summary 2", AssociatedModelUids: "22222222-2222-2222-2222-222222222222"},
	}

	parsed, skipErrs := ConvertRawCRSToParsed(raw)

	assert.Empty(t, skipErrs)
	assert.Len(t, parsed, 2)
	assert.Equal(t, "CR-1", parsed[0].CrNumber)
	assert.Equal(t, "CR-2", parsed[1].CrNumber)
}

// TestConvertRawCRSToParsedSkipsInvalidRecords is the regression test for the ECHIMP cache
// resilience fix: a single malformed CR from the upstream ECHIMP export (here, an
// AssociatedModelUids that isn't a valid UUID) must not prevent the rest of the batch from being
// parsed. Before this fix, one bad record failed the whole batch.
func TestConvertRawCRSToParsedSkipsInvalidRecords(t *testing.T) {
	raw := []*EChimpCRRaw{
		{CrNumber: "CR-GOOD-1", CrSummary: "Summary", AssociatedModelUids: "11111111-1111-1111-1111-111111111111"},
		{CrNumber: "CR-BAD", CrSummary: "Summary", AssociatedModelUids: "not-a-uuid"},
		{CrNumber: "CR-GOOD-2", CrSummary: "Summary", AssociatedModelUids: "22222222-2222-2222-2222-222222222222"},
	}

	parsed, skipErrs := ConvertRawCRSToParsed(raw)

	require.Len(t, parsed, 2, "both valid records should be returned despite the bad one")
	assert.Equal(t, "CR-GOOD-1", parsed[0].CrNumber)
	assert.Equal(t, "CR-GOOD-2", parsed[1].CrNumber)

	require.Len(t, skipErrs, 1)
	assert.ErrorContains(t, skipErrs[0], "CR-BAD")
}

func TestConvertRawCRSToParsedAllInvalid(t *testing.T) {
	raw := []*EChimpCRRaw{
		{CrNumber: "CR-BAD-1", CrSummary: "Summary", AssociatedModelUids: "not-a-uuid"},
		{CrNumber: "CR-BAD-2", CrSummary: "Summary", AssociatedModelUids: "still-not-a-uuid"},
	}

	parsed, skipErrs := ConvertRawCRSToParsed(raw)

	assert.Empty(t, parsed)
	assert.Len(t, skipErrs, 2)
}

func TestConvertRawCRSToParsedEmptyInput(t *testing.T) {
	parsed, skipErrs := ConvertRawCRSToParsed(nil)

	assert.Empty(t, parsed)
	assert.Empty(t, skipErrs)
}
