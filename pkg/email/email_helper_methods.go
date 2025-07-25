package email

import (
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func boolToYesNo(b bool) string {
	if b {
		return "Yes"
	}
	return "No"
}

func valueOrEmpty(s *string) string {
	if s != nil {
		return *s
	}
	return ""
}

func ToTitleCase(input string) string {
	// Replace underscores with spaces
	input = strings.ReplaceAll(input, "_", " ")

	// Convert to lowercase
	lowerSlice := strings.ToLower(input)

	// Convert to title case
	return cases.Title(language.English).String(lowerSlice)
}
