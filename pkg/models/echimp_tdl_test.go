package models

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestConvertRawTDLSToParsedAllValid(t *testing.T) {
	raw := []*EChimpTDLRaw{
		{TdlNumber: "TDL-1", Title: "Title 1", AssociatedModelUids: "11111111-1111-1111-1111-111111111111"},
		{TdlNumber: "TDL-2", Title: "Title 2", AssociatedModelUids: "22222222-2222-2222-2222-222222222222"},
	}

	parsed, skipErrs := ConvertRawTDLSToParsed(raw)

	assert.Empty(t, skipErrs)
	assert.Len(t, parsed, 2)
	assert.Equal(t, "TDL-1", parsed[0].TdlNumber)
	assert.Equal(t, "TDL-2", parsed[1].TdlNumber)
}

// TestConvertRawTDLSToParsedSkipsInvalidRecords mirrors
// TestConvertRawCRSToParsedSkipsInvalidRecords for TDLs: a single malformed record from the
// upstream ECHIMP export must not prevent the rest of the batch from being parsed.
func TestConvertRawTDLSToParsedSkipsInvalidRecords(t *testing.T) {
	raw := []*EChimpTDLRaw{
		{TdlNumber: "TDL-GOOD-1", Title: "Title", AssociatedModelUids: "11111111-1111-1111-1111-111111111111"},
		{TdlNumber: "TDL-BAD", Title: "Title", AssociatedModelUids: "not-a-uuid"},
		{TdlNumber: "TDL-GOOD-2", Title: "Title", AssociatedModelUids: "22222222-2222-2222-2222-222222222222"},
	}

	parsed, skipErrs := ConvertRawTDLSToParsed(raw)

	require.Len(t, parsed, 2, "both valid records should be returned despite the bad one")
	assert.Equal(t, "TDL-GOOD-1", parsed[0].TdlNumber)
	assert.Equal(t, "TDL-GOOD-2", parsed[1].TdlNumber)

	require.Len(t, skipErrs, 1)
	assert.ErrorContains(t, skipErrs[0], "TDL-BAD")
}

func TestConvertRawTDLSToParsedAllInvalid(t *testing.T) {
	raw := []*EChimpTDLRaw{
		{TdlNumber: "TDL-BAD-1", Title: "Title", AssociatedModelUids: "not-a-uuid"},
		{TdlNumber: "TDL-BAD-2", Title: "Title", AssociatedModelUids: "still-not-a-uuid"},
	}

	parsed, skipErrs := ConvertRawTDLSToParsed(raw)

	assert.Empty(t, parsed)
	assert.Len(t, skipErrs, 2)
}

func TestConvertRawTDLSToParsedEmptyInput(t *testing.T) {
	parsed, skipErrs := ConvertRawTDLSToParsed(nil)

	assert.Empty(t, parsed)
	assert.Empty(t, skipErrs)
}
